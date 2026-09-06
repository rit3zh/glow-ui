import { createContext, useContext } from "react";

import type { IToggleContextValue, TToggleContext } from "./types";

const ToggleContext = createContext<IToggleContextValue | null>(null);

const useToggle = (component: TToggleContext): IToggleContextValue => {
  const ctx = useContext(ToggleContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Toggle.Root>.`);
  }
  return ctx;
};

export { ToggleContext, useToggle };
