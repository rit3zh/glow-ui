import React, { createContext, useContext } from "react";
import type { IFanContext } from "./types";

const FanContext = createContext<IFanContext | null>(null);

const useFan = (): IFanContext => {
  const ctx = useContext(FanContext);
  if (!ctx) {
    throw new Error("FanMenu.* must be rendered inside <FanMenu>.");
  }
  return ctx;
};

export { FanContext, useFan };
