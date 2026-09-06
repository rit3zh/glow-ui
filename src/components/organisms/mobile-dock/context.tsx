import React, { createContext, useContext } from "react";
import type { IDockContext } from "./types";

/** Shared state for the whole dock (animation drivers + config). */
const DockContext = createContext<IDockContext | null>(null);

/** Per-item position, injected by <Dock.Items> onto each child. */
const ItemIndexContext = createContext<number>(-1);

const useDock = (): IDockContext => {
  const ctx = useContext(DockContext);
  if (!ctx) {
    throw new Error("Dock compound components must be rendered inside <Dock>.");
  }
  return ctx;
};

const useItemIndex = (): number => useContext(ItemIndexContext);

export { DockContext, ItemIndexContext, useDock, useItemIndex };
