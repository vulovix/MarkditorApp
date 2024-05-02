import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, Flex, Kbd, TextField } from "@radix-ui/themes";
import { DialogProps } from "./DialogProps";
import { useState } from "react";
import { renameDirectory, renameFile } from "@/store/directory";
import { toast } from "sonner";
import { validateDirectoryName, fixMdFileName } from "@/utils/path";
import { useTranslation } from "react-i18next";

export function RenameDialog({ show, entity, onOpenChange }: DialogProps) {
  const [inputName, setInputName] = useState(entity.name);
  const { t } = useTranslation()

  async function confirm() {
    if (!validateDirectoryName(inputName)) {
      toast.error(
        t("rename_dialog.invalid_name.title"),
        { description: t("rename_dialog.invalid_name.description") }
      );
      onOpenChange(false)
      return
    }

    let result = false
    let finalName = inputName.trim()

    if (entity.type === "file") {
      finalName = fixMdFileName(inputName);
      result = await renameFile(entity, finalName);
    } else {
      result = await renameDirectory(entity, finalName);
    }

    if (result) {
      toast.success(t("rename_dialog.success.title"), { description: finalName });
    } else {
      toast.error(
        t("rename_dialog.fail.title"),
        { description: t("rename_dialog.fail.description") }
      )
    }
    // clear state
    onOpenChange(false);
    // setReset(true)
  }

  const title = entity.type === "dir" ?
    t("rename_dialog.title_folder") :
    t("rename_dialog.title_file")

  const desc = entity.type === "dir" ?
    t("rename_dialog.desc_folder") :
    t("rename_dialog.desc_file")

  return (
    <Dialog.Root open={show} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {desc}
          <TextField.Input
            my="2" value={inputName} placeholder={entity.name}
            onInput={(e) => setInputName(e.currentTarget.value)}
            onKeyUp={(e) => e.key === "Enter" && confirm()}
          />
        </DialogDescription>

        <Flex justify={"end"} gap={"2"}>
          <Button variant="soft" onClick={() => onOpenChange(false)}>
            {t("rename_dialog.cancel")}
          </Button>
          <Button onClick={confirm} disabled={inputName.trim().length === 0}>
            {t("rename_dialog.confirm")}
          </Button>
        </Flex>
      </DialogContent>
    </Dialog.Root>
  );
}
