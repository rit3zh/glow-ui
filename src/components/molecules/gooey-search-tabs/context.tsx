import React, { createContext, useContext } from "react";
import type { IGooeyContext, ITabContext } from "./types";

const GooeyContext = createContext<IGooeyContext | null>(null);
const TabContext = createContext<ITabContext | null>(null);

const useGooey = (): IGooeyContext => {
  const ctx = useContext(GooeyContext);
  if (!ctx) {
    throw new Error(
      "GooeySearchTabs.* must be rendered inside <GooeySearchTabs>.",
    );
  }
  return ctx;
};

const useTab = (): ITabContext => {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error(
      "GooeySearchTabs.TabIcon / .TabLabel must be inside <GooeySearchTabs.Tab>.",
    );
  }
  return ctx;
};

export { GooeyContext, TabContext, useGooey, useTab };
