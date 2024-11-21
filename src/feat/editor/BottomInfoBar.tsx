import { Button, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { Code2Icon, CodeIcon, ListIcon, Redo2Icon, Undo2Icon } from "lucide-react";
import { DocInfoRow } from "./DocInfoRow";
import { editorAction } from "@/store/editor";
import { useTranslation } from "react-i18next";

type BottomInfoBarButtonProps = {
  tooltip: string;
  onClick: () => void;
  children: React.ReactNode;
};

function BottomInfoBarButton(props: BottomInfoBarButtonProps) {
  return (
    <Tooltip content={props.tooltip}>
      <IconButton variant="ghost" className="px-2 py-2 mx-0" radius="none" onClick={props.onClick}>
        {props.children}
      </IconButton>
    </Tooltip>
  );
}

export function BottomInfoBar() {
  const iconSize = 17;
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center border-t bg-background">
      <Flex gap="1" grow={"1"}>
        <BottomInfoBarButton tooltip={t("bottom_info_bar.outline")} onClick={editorAction.toggleOutline}>
          <ListIcon width={iconSize} />
        </BottomInfoBarButton>

        {/*  TODO Source Code mode  */}
        {/* <BottomInfoBarButton tooltip={t("bottom_info_bar.source_code")} onClick={() => { }}>
          <Code2Icon width={iconSize} />
        </BottomInfoBarButton> */}

        <BottomInfoBarButton tooltip={t("bottom_info_bar.undo")} onClick={editorAction.undo}>
          <Undo2Icon width={iconSize} />
        </BottomInfoBarButton>

        <BottomInfoBarButton tooltip={t("bottom_info_bar.redo")} onClick={editorAction.redo}>
          <Redo2Icon width={iconSize} />
        </BottomInfoBarButton>

        <div className="flex-1"></div>
        <DocInfoRow />
      </Flex>
    </div>
  );
}
