import { createContext, useContext } from "react";

import type { IMorphicTabBarContext, IMorphicTabSlot } from "./types";

const MorphicTabBarContext = createContext<IMorphicTabBarContext | null>(null);

function useMorphicTabBar(part: string): IMorphicTabBarContext {
  const ctx = useContext(MorphicTabBarContext);
  if (!ctx) {
    throw new Error(`<${part}> must be rendered inside <MorphicTabBar>`);
  }
  return ctx;
}

const MorphicTabSlotContext = createContext<IMorphicTabSlot>({
  index: 0,
  totalItems: 1,
});

function useMorphicTabSlot(): IMorphicTabSlot {
  return useContext(MorphicTabSlotContext);
}

export {
  MorphicTabBarContext,
  MorphicTabSlotContext,
  useMorphicTabBar,
  useMorphicTabSlot,
};
