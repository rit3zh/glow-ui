import { createContext, useContext } from "react";

import type { IBarcodeBadgeContext, TBarcodeComponents } from "./types";

const BarcodeBadgeContext = createContext<IBarcodeBadgeContext | null>(null);

const useBarcodeBadge = (
  component: TBarcodeComponents = "BarcodeBadge.Bars",
): IBarcodeBadgeContext => {
  const ctx = useContext<IBarcodeBadgeContext | null>(BarcodeBadgeContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <BarcodeBadge>.`);
  }
  return ctx;
};

export { BarcodeBadgeContext, useBarcodeBadge };
