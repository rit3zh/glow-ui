import { createContext, useContext } from "react";

import type { IRippleButtonContextValue, TRippleButtonContext } from "./types";

const RippleButtonContext = createContext<IRippleButtonContextValue | null>(null);

const useRippleButton = (component: TRippleButtonContext): IRippleButtonContextValue => {
  const ctx = useContext(RippleButtonContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <RippleButton.Root>.`);
  }
  return ctx;
};

export { RippleButtonContext, useRippleButton };
