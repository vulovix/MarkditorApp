import useEditorStore, { getVditor, editorAction } from "@/store/editor";
import { Bold, Code, Italic, StrikethroughIcon } from "lucide-react";
import { ContextMenu, Flex } from "@radix-ui/themes";
import Vditor from "vditor";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function EditorContextToolbar({ selected }: { selected: string }) {
  let isBold = false;
  let isItalic = false;
  let isStrikethrough = false;
  let isCode = false;

  if (selected.startsWith("**") && selected.endsWith("**")) {
    isBold = true;
    if (selected.startsWith("***") && selected.endsWith("***")) {
      isItalic = true;
    }
  } else if (selected.startsWith("*") && selected.endsWith("*")) {
    isItalic = true;
  }

  if (selected.startsWith("~~") && selected.endsWith("~~")) {
    isStrikethrough = true;
  }
  if (selected.startsWith("`") && selected.endsWith("`")) {
    isCode = true;
  }

  const selectedClass = "text-primary hover:text-white bg-accent hover:bg-primary";

  return (
    <Flex gap={"1"}>
      <ContextMenu.Item onClick={() => editorAction.toggleRangeBold(!isBold)} className={isBold ? selectedClass : ""}>
        <Bold className="h-4 w-4 " />
      </ContextMenu.Item>
      <ContextMenu.Item onClick={() => editorAction.toggleRangeItalic(!isItalic)} className={isItalic ? selectedClass : ""}>
        <Italic className="h-4 w-4" />
      </ContextMenu.Item>
      <ContextMenu.Item onClick={() => editorAction.toggleRangeStrikeline(!isStrikethrough)} className={isStrikethrough ? selectedClass : ""}>
        <StrikethroughIcon className="h-4 w-4" />
      </ContextMenu.Item>
      <ContextMenu.Item className={isCode ? selectedClass : ""}>
        <Code className="h-4 w-4" />
      </ContextMenu.Item>
    </Flex>
  );
}

export function EditorContextMenu({ children }: { children: React.ReactNode; vditor?: Vditor }) {
  const [hasSelection, setHasSelection] = useState(false);
  const [selected, setSelected] = useState("");

  function onOpenChange(open: boolean) {
    if (open) {
      const text = editorAction.getEditorSelection() ?? "";
      setSelected(text);
      setHasSelection(text.length > 0);
    }
  }

  const { t } = useTranslation();

  const toolbarVisible = useEditorStore((s) => s.toolbarVisible);

  return (
    <ContextMenu.Root onOpenChange={onOpenChange}>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <EditorContextToolbar selected={selected} />

        <ContextMenu.Separator />

        <ContextMenu.Item onClick={editorAction.insertImage}>{t("editor.context_menu.insert_image")}</ContextMenu.Item>

        {/* <ContextMenu.Item onClick={editorAction.insertTable}>
        {t("editor.context_menu.insert_table")}
        </ContextMenu.Item> */}

        {/* <ContextMenu.Item onClick={editorAction.}>
        {t("editor.context_menu.insert_para_upper")}
        </ContextMenu.Item> */}

        {/* <ContextMenu.Item onClick={editorAction.}>
        {t("editor.context_menu.insert_para_below")}
        </ContextMenu.Item> */}

        <ContextMenu.Separator />

        <ContextMenu.Item disabled={!hasSelection} shortcut="Ctrl X" onClick={editorAction.cutContent}>
          {t("editor.context_menu.cut")}
        </ContextMenu.Item>

        <ContextMenu.Item disabled={!hasSelection} shortcut="Ctrl C" onClick={editorAction.copyContent}>
          {t("editor.context_menu.copy")}
        </ContextMenu.Item>

        <ContextMenu.Item shortcut="Ctrl V" onClick={editorAction.pasteContent}>
          {t("editor.context_menu.paste")}
        </ContextMenu.Item>

        {/* <ContextMenu.Sub>
          <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Move to project…</ContextMenu.Item>
            <ContextMenu.Item>Move to folder…</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Advanced options…</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub> */}

        <ContextMenu.Separator />
        <ContextMenu.Item onClick={() => editorAction.toggleToolbar()}>
          {toolbarVisible ? t("editor.context_menu.hide_toolbar") : t("editor.context_menu.show_toolbar")}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
