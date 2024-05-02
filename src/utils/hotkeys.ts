import i18n from "@/i18n/i18n"
import { closeCurrentDoc, createNewDoc, saveDocument } from "@/store/document"
import { toast } from "sonner"

export async function handleEditorHotKey(e: KeyboardEvent) {
  const key = e.key.toLowerCase()
  const t = i18n.t
  
  if (e.ctrlKey || e.metaKey) {
    switch (key) {
      case 's': // Ctrl+S
        try {
          const res = await saveDocument()
          if (res) toast.success(t("toast.save_success"), { id: "save-success", duration: 3000 })
        } catch (error) {
          toast.error("保存失败", { description: `${error}`, duration: 10000 })
          console.error(error);
        }
        break
      case 'n': // Ctrl+N
        createNewDoc()
        break
      case 'w':
      case 'q': // Ctrl+W or Ctrl+Q
        await closeCurrentDoc()
        break
      default:
        return
    }
  }
}