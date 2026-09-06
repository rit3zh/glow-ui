import { createContext, useContext } from "react";
import type {
  IChipGroupContext,
  IChipItemContext,
  TChipComponents,
} from "./types";

const ChipGroupContext = createContext<IChipGroupContext | null>(null);
const ChipItemContext = createContext<IChipItemContext | null>(null);

const useChipGroup = <T extends TChipComponents>(
  component: T,
): IChipGroupContext => {
  const ctx = useContext(ChipGroupContext);
  if (!ctx) {
    throw new Error(
      `${component} must be rendered inside <AnimatedChip.Group>.`,
    );
  }
  return ctx;
};

/**
 * State of the chip the caller is rendering inside — the escape hatch for
 * children that need to react to selection without a render prop.
 */
const useChipItem = <T extends TChipComponents>(
  component: T,
): IChipItemContext => {
  const ctx = useContext(ChipItemContext);
  if (!ctx) {
    throw new Error(
      `${component} must be rendered inside <AnimatedChip.Item>.`,
    );
  }
  return ctx;
};

export { ChipGroupContext, ChipItemContext, useChipGroup, useChipItem };
