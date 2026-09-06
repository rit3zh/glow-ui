import { createContext, useContext } from "react";
import type { IMorphFabContext, TMorphFabContextComponents } from "./types";

const MorphFabContext = createContext<IMorphFabContext | null>(null);

const useMorphFab = <T extends TMorphFabContextComponents>(
  component: T,
): IMorphFabContext => {
  const ctx = useContext(MorphFabContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <MorphFab.Root>.`);
  }
  return ctx;
};

export { MorphFabContext, useMorphFab };
