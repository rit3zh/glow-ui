import { createContext, useContext } from "react";

import type {
  IBouncyAccordionItemContext,
  IBouncyAccordionRootContext,
} from "./types";

const RootContext = createContext<IBouncyAccordionRootContext | null>(null);
const ItemContext = createContext<IBouncyAccordionItemContext | null>(null);

const useBouncyRoot = (): IBouncyAccordionRootContext => {
  const ctx = useContext(RootContext);
  if (!ctx) {
    throw new Error(
      "BouncyAccordion.* must be rendered inside <BouncyAccordion.Root>.",
    );
  }
  return ctx;
};

const useBouncyItem = (): IBouncyAccordionItemContext => {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error(
      "BouncyAccordion.Trigger/Content must be rendered inside <BouncyAccordion.Item>.",
    );
  }
  return ctx;
};

export { RootContext, ItemContext, useBouncyRoot, useBouncyItem };
