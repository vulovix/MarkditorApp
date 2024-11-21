import { PlatformAPI } from "@/ipc";
import useDocumentStore from "@/store/document";
import { Button, Flex, IconButton, Popover } from "@radix-ui/themes";
import { t } from "i18next";
import { CheckCircle2, FolderOpen, LoaderIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

function openInSystem() {
  const fullPath = useDocumentStore.getState().path;
  if (fullPath) {
    PlatformAPI.locateFile(fullPath);
  }
}

function DocInfoPopover({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const fileName = useDocumentStore((state) => state.fileName ?? t("doc_info.untitled_file"));
  const path = useDocumentStore((state) => state.path ?? t("doc_info.unknown_path"));
  const content = useDocumentStore((state) => state.content ?? "");

  let lineCount = 0;
  for (const s of content) {
    if (s === "\n") lineCount++;
  }

  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content style={{ width: 360 }}>
        <Flex className="text-sm" gap="2" direction="column">
          <div className="line-clamp-1 font-bold">{fileName}</div>
          <Flex justify="between" align="center" gap="5">
            <div className="line-clamp-3">{path}</div>
            <IconButton size="1" variant="soft" onClick={openInSystem}>
              {" "}
              <FolderOpen size={14} />
            </IconButton>
          </Flex>

          <Flex justify="between">
            <div>{t("doc_info.statistic")}</div>
            <div>
              {t("doc_info.count", {
                lineCount: lineCount,
                charCount: content.trim().length,
              })}
            </div>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}

export function DocInfoRow() {
  const saved = useDocumentStore((state) => state.saved);
  const content = useDocumentStore((state) => state.content ?? "");

  const { t } = useTranslation();

  return (
    <DocInfoPopover>
      <Button variant="ghost" className="py-2.5 px-4" radius="none">
        <Flex gap="4" className="items-center text-sm select-none">
          <Flex gap="1" className={(saved ? "opacity-30" : "") + " items-center"}>
            {saved ? <CheckCircle2 strokeWidth={1.5} size={16} /> : <LoaderIcon strokeWidth={1.5} size={16} />}
            <div>{saved ? t("doc_info.saved") : t("doc_info.unsaved")}</div>
          </Flex>
          <div className="mr-1">{t("doc_info.char_count", { charCount: content.trim().length })}</div>
        </Flex>
      </Button>
    </DocInfoPopover>
  );
}
