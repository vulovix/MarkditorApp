import { PlatformAPI } from "@/ipc";
import useDocumentStore, { saveDocument, createNewDoc } from "@/store/document";
import useNavigationStore, { toggleSidebarExpanded } from "@/store/navigation";
import { SidebarClose, SidebarOpen, SaveIcon, PlusCircleIcon, Search, Settings, TerminalSquare, MoreHorizontal, MoonIcon, Sun } from "lucide-react";
import { TitleMenuItem, TitleMenuItemProps } from "./TitleMenuItem";
import { toast } from "sonner";
import { TitleBarDropdownMenus } from "./TitleBarDropdownMenus";
import { EnvConstants } from "@/utils/constants";
import usePreferenceStore, { prefActions } from "@/store/preference";
import { dialogActions } from "@/store/dialog";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const iconSize = 16;

function ToggleFolderView() {
  const open = useNavigationStore((state) => state.sidebarExpanded);
  let icon;
  if (open) {
    icon = <SidebarClose size={iconSize} />;
  } else {
    icon = <SidebarOpen size={iconSize} />;
  }

  const { t } = useTranslation();

  const props: TitleMenuItemProps = {
    icon: icon,
    label: t("titlebar_menu.sidebar"),
    onClick: () => {
      toggleSidebarExpanded();
    },
    isDisabled: false,
  };

  return <TitleMenuItem props={props} />;
}

function Save() {
  const saved = useDocumentStore((state) => state.saved);
  const icon = <SaveIcon size={iconSize} />;
  const props: TitleMenuItemProps = {
    icon: icon,
    label: t("titlebar_menu.save"),
    onClick: async () => {
      const res = await saveDocument();
      if (res) {
        toast.success(t("toast.save_success"));
      } else {
        toast.error(t("toast.save_fail"));
      }
    },
    isDisabled: saved,
  };
  return <TitleMenuItem props={props} />;
}

const NewFile = () => {
  const saved = useDocumentStore((state) => state.saved);
  const props: TitleMenuItemProps = {
    icon: <PlusCircleIcon size={iconSize} />,
    label: t("titlebar_menu.new_file"),
    onClick: () => {
      dialogActions.showUnsaveAlertIfNeeded({
        doNext: createNewDoc,
      });
    },
    isDisabled: false,
  };

  if (saved) {
    return <TitleMenuItem props={props} />;
  }

  return <TitleMenuItem props={props} />;
};

function ShowSearch() {
  const props: TitleMenuItemProps = {
    icon: <Search size={iconSize} />,
    label: t("titlebar_menu.search"),
    onClick: () => {},
    isDisabled: false,
  };
  return <TitleMenuItem props={props} />;
}

function OpenDevTool() {
  if (EnvConstants.isTauri) {
    return <></>;
  }
  const openDevToolMenuItem: TitleMenuItemProps = {
    icon: <TerminalSquare size={iconSize} />,
    label: t("titlebar_menu.devtools"),
    onClick: () => PlatformAPI.openDevTools(),
    isDisabled: false,
  };
  return <TitleMenuItem props={openDevToolMenuItem} />;
}

function ToggleThemeMode() {
  const themeMode = usePreferenceStore((s) => s.themeMode());
  const menuItem: TitleMenuItemProps = {
    icon: themeMode === "light" ? <Sun size={iconSize} /> : <MoonIcon size={iconSize} />,
    label: t("titlebar_menu.theme_mode"),
    onClick: () => {
      prefActions.setThemeMode(themeMode === "light" ? "dark" : "light");
    },
    isDisabled: false,
  };
  return <TitleMenuItem props={menuItem} />;
}

function MoreMenuItem() {
  const moreMenuItem: TitleMenuItemProps = {
    icon: <MoreHorizontal size={iconSize} />,
    label: t("titlebar_menu.more"),
  };
  return <TitleMenuItem props={moreMenuItem} />;
}

export const TitleBarMenuItems = () => (
  <>
    <ToggleFolderView key={"ToggleFolderViewMenuItem"} />
    <NewFile key={"NewFileMenuItem"} />
    <Save key={"SaveMenuItem"} />
    <OpenDevTool key={"OpenDevToolMenuItem"} />
    <ToggleThemeMode key={"ToggleThemeMode"} />
    <TitleBarDropdownMenus key={"MoreMenuItem"}>
      <MoreMenuItem />
    </TitleBarDropdownMenus>
  </>
);
