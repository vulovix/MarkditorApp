import "@mdxeditor/editor/style.css";
import {
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  tablePlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
} from "@mdxeditor/editor";
import "./style.css";
import { useEffect, useState } from "react";
import useDocumentStore, { updateContent } from "@/store/document";
import { handleEditorHotKey } from "@/utils/hotkeys";
import { BottomInfoBar } from "../editor/BottomInfoBar";
import { EditorContextMenu } from "../editor/EditorContextMenu";
import { useThemeContext } from "@radix-ui/themes";
import usePreferenceStore from "@/store/preference";

export function Editor() {
  const [content, setContent] = useState("");
  const [documentPath, setDocumentPath] = useState("");

  useEffect(() => {
    const initialState = useDocumentStore.getState();
    setContent(initialState.content ?? "");
    setDocumentPath(initialState.path ?? "");
    const unsubscribe = useDocumentStore.subscribe((state, prevState) => {
      console.log(state, prevState);
      if (state.path === prevState.path && state.content !== undefined) {
        return;
      }
      setContent(state.content ?? "");
      setDocumentPath(state.path ?? "");
    });
    document.addEventListener("keydown", handleEditorHotKey);
    return () => {
      unsubscribe();
      document.removeEventListener("keydown", handleEditorHotKey);
    };
  }, []);

  const themeMode = usePreferenceStore.getState().themeMode();

  const editorTheme = themeMode === "dark" ? "dark-editor dark:prose-invert" : "";
  return (
    <div className="flex flex-col h-full">
      <EditorContextMenu>
        <MDXEditor
          key={documentPath}
          markdown={content}
          onChange={(value) => {
            setContent(value);
            updateContent(value);
          }}
          contentEditableClassName={`prose MarkDownEditor ${editorTheme}`}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin({}),
            tablePlugin(),
            markdownShortcutPlugin(),
            diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
            toolbarPlugin({
              toolbarClassName: "MarkDownToolBarWrapper",
              toolbarContents: () => (
                <div className="MarkDownToolBar">
                  <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <Separator />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <Separator />
                    <ListsToggle />
                    <Separator />
                    <BlockTypeSelect />
                    <Separator />
                    <CreateLink />
                    <InsertTable />
                    <InsertThematicBreak />
                  </DiffSourceToggleWrapper>
                </div>
              ),
            }),
          ]}
        />
      </EditorContextMenu>
      <BottomInfoBar />
    </div>
  );
}

function Separator() {
  return <div data-orientation="vertical" aria-orientation="vertical" role="separator"></div>;
}
