import { FolderOpenIcon } from "@heroicons/react/24/outline";
import { extractChildrenNode } from "./DirectoryItem";
import { Button, ScrollArea } from "@radix-ui/themes";
import useDirectoryStore, { selectRootDir } from "@/store/directory";
import { DirectoryPanelHeader } from "./DirectoryPanelHeader";
import { DirectoryContextMenu } from "./DirectoryContextMenu";
import { dialogActions } from "@/store/dialog";
import { useTranslation } from "react-i18next";

function DirectoryEmptyView() {
  function willSelectDir() {
    dialogActions.showUnsaveAlertIfNeeded({ doNext: selectRootDir });
  }

  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400 m-3 select-none">{t("dir_panel.empty_files")}</p>
        <Button onClick={willSelectDir}>
          <FolderOpenIcon width="16" height="16" /> {t("dir_panel.open_btn")}
        </Button>
      </div>
    </>
  );
}

function DirectoryTreeView() {
  const children = useDirectoryStore((state) => state.root?.children ?? []);
  const rootDir = useDirectoryStore((state) => state.root);

  const childrenNode = extractChildrenNode(children, 0);

  return (
    <DirectoryContextMenu entity={rootDir!}>
      <ScrollArea scrollbars="vertical" style={{ width: "auto" }} size={"1"}>
        <div className="flex flex-col">{childrenNode}</div>
      </ScrollArea>
    </DirectoryContextMenu>
  );
}

export function DirectoryPanel() {
  const root = useDirectoryStore((state) => state.root);

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {root !== undefined && <DirectoryPanelHeader />}
      {root !== undefined ? <DirectoryTreeView /> : <DirectoryEmptyView />}
    </div>
  );
}
