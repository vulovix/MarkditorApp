import { deleteDirectory, deleteFile } from "@/store/directory";
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, Flex, Kbd, Strong } from "@radix-ui/themes";
import { toast } from "sonner";
import { DialogProps } from "./DialogProps";
import { useTranslation } from "react-i18next";

export function DeleteDialog({ show, entity, onOpenChange }: DialogProps) {
  const { t } = useTranslation()

  async function confirm() {
    onOpenChange(false);
    let result = false
    if (entity.type === "dir") {
      result = await deleteDirectory(entity);
    } else {
      result = await deleteFile(entity);
    }
    if (result) {
      toast.success(t("delete_dialog.success.title", { target_name: entity.name }), {
        description: entity.path,
      })
    } else {
      toast.error(t("delete_dialog.fail.title", { target_name: entity.name }), {
        description: t("delete_dialog.fail.description")
      })
    }
  }


  const title = entity.type === "dir" ?
    t("delete_dialog.title_folder") :
    t("delete_dialog.title_file")

  const desc = entity.type === "dir" ?
    t("delete_dialog.desc_folder", { target_name: entity.name }) :
    t("delete_dialog.desc_file", { target_name: entity.name })

  return (
    <Dialog.Root open={show} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{desc} </DialogDescription>

        <Flex justify={"end"} gap={"2"}>
          <Button onClick={() => onOpenChange(false)}>
            {t("delete_dialog.cancel")}
          </Button>
          <Button color="red" onClick={confirm}>
            {t("delete_dialog.confirm")}
          </Button>
        </Flex>
      </DialogContent>
    </Dialog.Root>
  );
}
