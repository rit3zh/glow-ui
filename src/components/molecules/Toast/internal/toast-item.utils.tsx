import { useMemo, type ReactNode } from "react";

import { useToastTheme } from "../toast.theme";
import type {
  IToast,
  IToastIcons,
  TToastContent,
  TToastType,
} from "../Toast.types";
import { getTypeIcon } from "./toast-icons";

function renderContent(content: TToastContent): ReactNode {
  return typeof content === "function" ? content() : content;
}

function useToastIcon(
  toast: IToast,
  type: TToastType,
  icons?: IToastIcons,
): ReactNode {
  const { accents } = useToastTheme();

  return useMemo<ReactNode>(() => {
    if (toast.icon !== undefined) return toast.icon;

    const custom =
      type === "success" ||
      type === "error" ||
      type === "info" ||
      type === "warning" ||
      type === "loading"
        ? icons?.[type]
        : undefined;

    if (custom != null) return custom;

    return getTypeIcon(type, accents[type]);
  }, [toast.icon, type, icons, accents]);
}

export { renderContent, useToastIcon };
