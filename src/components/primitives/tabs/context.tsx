import { createContext, useContext } from "react";

import type {
  ITabsContextValue,
  ITabsListContextValue,
  TTabsContext,
} from "./types";

const TabsContext = createContext<ITabsContextValue | null>(null);

const TabsListContext = createContext<ITabsListContextValue | null>(null);

const useTabs = (component: TTabsContext): ITabsContextValue => {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Tabs.Root>.`);
  }
  return ctx;
};

const useTabsList = (component: TTabsContext): ITabsListContextValue => {
  const ctx = useContext(TabsListContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Tabs.List>.`);
  }
  return ctx;
};

export { TabsContext, TabsListContext, useTabs, useTabsList };
