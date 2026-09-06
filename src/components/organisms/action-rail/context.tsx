import { createContext, useContext } from "react";

import type { IActionRailContext } from "./types";

const ActionRailContext = createContext<IActionRailContext | null>(null);

function useActionRail(part: string): IActionRailContext {
  const ctx = useContext(ActionRailContext);
  if (!ctx) {
    throw new Error(`<${part}> must be rendered inside <ActionRail>`);
  }
  return ctx;
}

const ActionRailTintContext = createContext<string | null>(null);

function useActionRailTint(fallback: string): string {
  return useContext(ActionRailTintContext) ?? fallback;
}

export {
  ActionRailContext,
  ActionRailTintContext,
  useActionRail,
  useActionRailTint,
};
