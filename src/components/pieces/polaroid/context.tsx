import { createContext, useContext } from "react";

import type { IPolaroidContext, TPolaroidComponents } from "./types";

const PolaroidContext = createContext<IPolaroidContext | null>(null);

const usePolaroid = (
  component: TPolaroidComponents = "Polaroid.Photo",
): IPolaroidContext => {
  const ctx = useContext<IPolaroidContext | null>(PolaroidContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Polaroid>.`);
  }
  return ctx;
};

export { PolaroidContext, usePolaroid };
