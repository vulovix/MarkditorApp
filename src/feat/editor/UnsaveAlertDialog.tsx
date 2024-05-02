import useDialogStore, { dialogActions } from "@/store/dialog";
import { saveDocument } from "@/store/document";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export function UnsaveAlertDialog() {
  const visible = useDialogStore((state) => state.unsaveAlert.visible);
  const doNext = useDialogStore((state) => state.unsaveAlert.doNext);

  const {t} = useTranslation();

  function cancel() {
    dialogActions.hideUnsaveAlert();
  }

  async function handleDoNext(save: boolean) {
    if (save) {
      await saveDocument()
    }
    doNext?.()
    dialogActions.hideUnsaveAlert();
  }

  return (
    <Dialog.Root open={visible} onOpenChange={dialogActions.hideUnsaveAlert}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{t("unsave_dialog.title")}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {t("unsave_dialog.content")}
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" onClick={cancel}>
            {t("unsave_dialog.do_nothing")}
          </Button>
          <Button variant="soft" color="red" onClick={() => handleDoNext(false)}>
            {t("unsave_dialog.discard")}
          </Button>
          <Button onClick={() => handleDoNext(true)}>{t("unsave_dialog.save")}</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}