import { createContext, useContext } from "react";
import type { ISplitViewContext, TSplitViewComponents } from "./types";

const SplitViewContext = createContext<ISplitViewContext | null>(null);
const useSplitView = <T extends TSplitViewComponents>(
  component: T,
): ISplitViewContext => {
  const ctx = useContext(SplitViewContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <SplitView.Root>.`);
  }
  return ctx;
};

export { SplitViewContext, useSplitView };
