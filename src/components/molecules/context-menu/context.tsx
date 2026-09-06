import { createContext, useContext } from "react";

import type { IContextMenuContext, TContextMenuContext } from "./types";

const ContextMenuContext = createContext<IContextMenuContext | null>(null);

const useContextMenu = <T extends TContextMenuContext>(
  component: T,
): IContextMenuContext => {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <ContextMenu.Root>.`);
  }
  return ctx;
};

export { ContextMenuContext, useContextMenu };
