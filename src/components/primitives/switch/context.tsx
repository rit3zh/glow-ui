import { createContext, useContext } from "react";

import type { ISwitchContextValue, TSwitchContext } from "./types";

const SwitchContext = createContext<ISwitchContextValue | null>(null);

const useSwitch = (component: TSwitchContext): ISwitchContextValue => {
  const ctx = useContext(SwitchContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Switch.Root>.`);
  }
  return ctx;
};

export { SwitchContext, useSwitch };
