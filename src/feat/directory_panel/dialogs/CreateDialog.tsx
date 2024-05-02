import { Dialog, Button, DialogContent, DialogDescription, DialogTitle, Kbd, TextField, Flex, DropdownMenu, Select, Link, Separator, Switch, TextFieldInput, Strong } from "@radix-ui/themes";
import { useState } from "react";
import { DialogProps } from "./DialogProps";
import { getParentDirectory, isMarkdownFile, validateDirectoryName, fixMdFileName } from "@/utils/path";
import { toast } from "sonner";
import { createDirectory, createFile } from "@/store/directory";
import { useTranslation } from "react-i18next";

export function CreateDialog({ show, entity, onOpenChange, newItemType }:
  DialogProps & { newItemType: "dir" | "file"; }) {
  const [inputName, setInputName] = useState("");
  const targetDir = entity.type === "dir" ? entity : getParentDirectory(entity.path);

  const { t } = useTranslation()

  async function confirm() {
    let result = false
    if (!validateDirectoryName(inputName)) {
      toast.error(
        t("create_dialog.invalid_name.title"),
        { description: t("create_dialog.invalid_name.description") }
      );
      onOpenChange(false)
      setInputName("");
      return
    }
    let finalName = inputName.trim()
    switch (newItemType) {
      case "file":
        finalName = fixMdFileName(inputName);
        result = await createFile(targetDir, finalName)
        break;
      case "dir":
        result = await createDirectory(targetDir, finalName)
        break;
    }
    if (result) {
      toast.success(t("create_dialog.success.title", { target_name: finalName }));
    } else {
      toast.error(
        t("create_dialog.fail.title", { target_name: finalName }),
        { description: t("create_dialog.fail.description") }
      );
    }
    onOpenChange(false);
    setInputName("");
  }


  const placeholder = newItemType === "dir" ?
    t("create_dialog.placeholder_folder")
    : t("create_dialog.placeholder_file")

  const title = newItemType === "dir" ?
    t("create_dialog.title_folder") :
    t("create_dialog.title_file")

  const description = newItemType === "dir" ?
    t("create_dialog.desc_folder", { dir_name: targetDir.name }) :
    t("create_dialog.desc_file", { dir_name: targetDir.name })

  return (
    <Dialog.Root open={show} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="my-3">
          {description}
          <TextField.Input
            my="2" value={inputName} placeholder={placeholder}
            onInput={(e) => setInputName(e.currentTarget.value)}
            onKeyUp={(e) => e.key === "Enter" && confirm()}
          />
        </DialogDescription>

        <Flex justify={"end"} gap={"2"}>
          <Button variant="soft" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={confirm} disabled={inputName.trim().length === 0}>{t("confirm")}</Button>
        </Flex>
      </DialogContent>
    </Dialog.Root>
  );
}
