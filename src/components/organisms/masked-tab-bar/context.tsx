import { createContext, useContext } from "react";

import type { IMaskedTabBarContext, TMaskedTabBarLayer } from "./types";

const MaskedTabBarContext = createContext<IMaskedTabBarContext | null>(null);

function useMaskedTabBar(part: string): IMaskedTabBarContext {
  const ctx = useContext(MaskedTabBarContext);
  if (!ctx) {
    throw new Error(`<${part}> must be rendered inside <MaskedTabBar>`);
  }
  return ctx;
}

const MaskedTabLayerContext = createContext<TMaskedTabBarLayer>("base");

function useMaskedTabLayer(): TMaskedTabBarLayer {
  return useContext(MaskedTabLayerContext);
}

export {
  MaskedTabBarContext,
  MaskedTabLayerContext,
  useMaskedTabBar,
  useMaskedTabLayer,
};
