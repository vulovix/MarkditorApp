import { Editor } from "./feat/editor/Editor";
import { useEffect, useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./components/ui/resizable";
import { DirectoryPanel } from "./feat/directory_panel/DirectoryPanel";
import useNavigationStore from "./store/navigation";
import { WindowTitleBar } from "./feat/title_bar/TitleBar";
import useDocumentStore from "./store/document";
import { Welcome } from "./feat/welcome/Welcome";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "sonner";
import usePreferenceStore from "./store/preference";
import { UnsaveAlertDialog } from "./feat/editor/UnsaveAlertDialog";
import { PlatformAPI } from "@/ipc";
import { openFile, setRootDir } from "@/store/directory";
import { initDirectoryOpenListener } from "@/store/preference";
import { getParentDirectory } from "./utils/path";
import i18n from "./i18n/i18n";


// -------------------------------
// Custom lifecycle
// onAppLaunch() -> onAppReady() -> onAppExit()
// -------------------------------

onAppLaunch()

/**
 * Execuate once as soon as the app is launched, 
 * before DOM is ready. May be finished after `onAppReady()`
 */
async function onAppLaunch() {
  const pathArg = (await PlatformAPI.os.readCliArgs()).source
  if (pathArg) {
    if (await PlatformAPI.exists(pathArg)) {
      openFile(pathArg)
      setRootDir(getParentDirectory(pathArg))
    }
  }

  i18n.changeLanguage(usePreferenceStore.getState().languageCode)
}


/**
 * Execute after ReactDOM is ready. 
 * Used in `useEffect()` inside `<ThemedApp />` componment.
 */
async function onAppReady() {
  registerListeners()
}

/**
 * Execute after ReactDOM is unmout. 
 * Used in `useEffect()` inside `<ThemedApp />` componment.
 */
function onAppExit() {
  unregisterListeners()
}

// -------------------------------
// Global event listeners
// -------------------------------
let unlistenDirOpen: () => void | undefined

function registerListeners(): void {
  unlistenDirOpen = initDirectoryOpenListener()
}

function unregisterListeners(): void {
  unlistenDirOpen?.()
}

// -------------------------------
// App component & Themed wrapper
// -------------------------------

const App = () => {
  const showSidePanel = useNavigationStore((state) => state.sidebarExpanded);
  const [panelSize, setPanelSize] = useState(20)
  const onResize = (size: number) => setPanelSize(size)
  const titleBarHeight = 32;

  const hasDoc = useDocumentStore((state) => state.hasDocOpened());

  return (
    <div>
      <div style={{ height: titleBarHeight }}>
        <WindowTitleBar />
      </div>
      <div className="flex border-t" style={{ height: `calc(100vh - ${titleBarHeight}px)` }} >
        <ResizablePanelGroup direction="horizontal">

          {/* Sidebar - directory panel */}
          {showSidePanel && (
            <>
              <ResizablePanel id="DirectorySidePanel" order={1}
                defaultSize={panelSize} minSize={15} maxSize={45}
                onResize={onResize}>
                <DirectoryPanel />
              </ResizablePanel>
              <ResizableHandle style={{ width: 0 }} id="handle" />
            </>
          )}

          {/* Main Editor, or Welcome page. */}
          <ResizablePanel id="mainEditor" order={2}>
            {hasDoc ? <Editor /> : <Welcome />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
};

export function ThemedApp() {
  // Right after the DOM is ready
  useEffect(() => {
    onAppReady()
    return onAppExit
  }, [])

  const themeMode = usePreferenceStore((state) => state.themeMode())
  return (
    <Theme appearance={themeMode} className={themeMode === "dark" ? "dark" : ""}>
      <App />
      <Toaster position="bottom-right"
        theme={themeMode} closeButton duration={3000} richColors
        toastOptions={{
          actionButtonStyle: {
            background: "transparent",
            color: "transparent",
          },
          cancelButtonStyle: {
            background: "transparent",
            color: "transparent",
          },
        }}
      />

      {/* Global Alert Dialogs */}
      <UnsaveAlertDialog />
      {/* <ThemePanel /> */}
    </Theme>
  )
}



