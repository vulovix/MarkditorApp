import useDirectoryStore, { copyFileInPlace, openFile, refreshRootDir } from "@/store/directory";
import { ContextMenu } from "@radix-ui/themes";
import { useState } from "react";
import { CreateDialog } from "./dialogs/CreateDialog";
import { RenameDialog } from "./dialogs/RenameDialog";
import { DeleteDialog } from "./dialogs/DeleteDialog";
import { PlatformAPI } from "@/ipc";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type NonRootDirectoryMenuItemsProps = {
  entity: DirectoryEntity;
  onRename: () => void;
  onDelete: () => void;
}

function openInSystem(entity: DirectoryEntity) {
  if (entity.type === 'file')
    PlatformAPI.locateFile(entity.path);
  else
    PlatformAPI.locateFolder(entity.path);
}

function NonRootDirectoryMenuItems({ entity, onRename, onDelete }: NonRootDirectoryMenuItemsProps) {
  async function handleCopy() {
    if (entity.type === 'file') {
      const destPath = await copyFileInPlace(entity.path)
      if (destPath) {
        toast.success(t("toast.copy_success"), { description: destPath });
      } else {
        toast.error(t("toast.copy_fail"));
      }
    }
  }

  const {t} = useTranslation()

  return (
    <>
      <ContextMenu.Item onClick={() => openFile(entity.path)}>{t("diranel_context_menu.open")}</ContextMenu.Item>
      <ContextMenu.Item onClick={onRename}>{t("dir_panel_context_menu.rename")}</ContextMenu.Item>
      {entity.type === 'file' && <ContextMenu.Item onClick={handleCopy}>{t("diranel_context_menu.copy")}</ContextMenu.Item>}
      <ContextMenu.Item color="red" onClick={onDelete}>{t("dir_panel_context_menu.delete")}</ContextMenu.Item>
    </>
  )
}

export function DirectoryContextMenu({ children, entity }: { children: React.ReactNode, entity: DirectoryEntity }) {
  const rootDir = useDirectoryStore((state) => state.root)
  const isRoot = entity.path === rootDir?.path

  const [showDelete, setShowDelete] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newItemType, setNewItemType] = useState<"dir" | "file">("dir")

  const { t } = useTranslation()

  function handleCreateFile() {
    setNewItemType("file")
    setShowCreate(true)
  }

  function handleCreateDirectory() {
    setNewItemType("dir")
    setShowCreate(true)
  }

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
        <ContextMenu.Content onContextMenu={(e) => e.stopPropagation()}
          className="">
          <div className="line-clamp-1 w-[11rem] max-w-[15rem] text-xs text-ellipsis break-all py-1.5 px-3 mb-1 opacity-40 h-6">
            {entity.name}
          </div>
          {
            !isRoot &&
            <NonRootDirectoryMenuItems
              entity={entity}
              onRename={() => setShowRename(true)}
              onDelete={() => setShowDelete(true)}
            />
          }
          <ContextMenu.Separator />

          <ContextMenu.Item onClick={handleCreateFile}>{t("dir_panel_context_menu.create_file")}</ContextMenu.Item>
          <ContextMenu.Item onClick={handleCreateDirectory}>{t("dir_panel_context_menu.create_folder")}</ContextMenu.Item>

          <ContextMenu.Separator />

          <ContextMenu.Item onClick={() => openInSystem(entity)}>{t("dir_panel_context_menu.open_in_explorer")}</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>


      <DeleteDialog show={showDelete} entity={entity} onOpenChange={setShowDelete} />
      <RenameDialog show={showRename} key={entity.path} entity={entity} onOpenChange={setShowRename} />
      <CreateDialog show={showCreate}
        newItemType={newItemType}
        entity={entity} onOpenChange={setShowCreate}
      />
    </>
  )
}