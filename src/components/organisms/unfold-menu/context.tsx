import { createContext, useContext } from "react";

import type {
  IUnfoldMenuContext,
  IUnfoldMenuGridContext,
  IUnfoldMenuMorph,
  IUnfoldMenuPoint,
  TUnfoldMenuSlot,
} from "./types";

const UnfoldMenuContext = createContext<IUnfoldMenuContext | null>(null);

function useUnfoldMenu(part: string): IUnfoldMenuContext {
  const ctx = useContext(UnfoldMenuContext);
  if (!ctx) {
    throw new Error(`<${part}> must be rendered inside <UnfoldMenu>`);
  }
  return ctx;
}

const UnfoldMenuGridContext = createContext<IUnfoldMenuGridContext | null>(
  null,
);

function useUnfoldMenuGrid(part: string): IUnfoldMenuGridContext {
  const ctx = useContext(UnfoldMenuGridContext);
  if (!ctx) {
    throw new Error(`<${part}> must be rendered inside <UnfoldMenu.Grid>`);
  }
  return ctx;
}

const UnfoldMenuTintContext = createContext<string | null>(null);

function useUnfoldMenuTint(fallback: string): string {
  return useContext(UnfoldMenuTintContext) ?? fallback;
}

const UnfoldMenuSlotContext = createContext<TUnfoldMenuSlot>("anchor");

function useUnfoldMenuSlot(): TUnfoldMenuSlot {
  return useContext(UnfoldMenuSlotContext);
}

/**
 * Present only inside the trigger's overlay copy. Lets `Icon` and `Label`
 * pick up the animated styles that drive the morph into the header title.
 */
const UnfoldMenuMorphContext = createContext<IUnfoldMenuMorph | null>(null);

function useUnfoldMenuMorph(): IUnfoldMenuMorph | null {
  return useContext(UnfoldMenuMorphContext);
}

/** Offset of the current subtree inside the panel, accumulated by `Header`. */
const UnfoldMenuOffsetContext = createContext<IUnfoldMenuPoint>({ x: 0, y: 0 });

function useUnfoldMenuOffset(): IUnfoldMenuPoint {
  return useContext(UnfoldMenuOffsetContext);
}

export {
  UnfoldMenuContext,
  UnfoldMenuGridContext,
  UnfoldMenuMorphContext,
  UnfoldMenuOffsetContext,
  UnfoldMenuSlotContext,
  UnfoldMenuTintContext,
  useUnfoldMenu,
  useUnfoldMenuGrid,
  useUnfoldMenuMorph,
  useUnfoldMenuOffset,
  useUnfoldMenuSlot,
  useUnfoldMenuTint,
};
