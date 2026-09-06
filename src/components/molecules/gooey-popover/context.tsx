import { createContext, useContext } from "react";
import type {
  IGooeyPopoverContext,
  TGooeyPopoverContextComponents,
} from "./types";

const GooeyPopoverContext = createContext<IGooeyPopoverContext | null>(null);

const useGooeyPopover = <T extends TGooeyPopoverContextComponents>(
  component: T,
): IGooeyPopoverContext => {
  const ctx = useContext(GooeyPopoverContext);
  if (!ctx) {
    throw new Error(
      `${component} must be rendered inside <GooeyPopover.Root>.`,
    );
  }
  return ctx;
};

export { GooeyPopoverContext, useGooeyPopover };
