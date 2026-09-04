import { createContext, useContext } from "react";

import type { IVerifiedBadgeContext, TVerifiedComponents } from "./types";

const VerifiedBadgeContext = createContext<IVerifiedBadgeContext | null>(null);

const useVerifiedBadge = (
  component: TVerifiedComponents = "VerifiedBadge.Name",
): IVerifiedBadgeContext => {
  const ctx = useContext<IVerifiedBadgeContext | null>(VerifiedBadgeContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <VerifiedBadge>.`);
  }
  return ctx;
};

export { VerifiedBadgeContext, useVerifiedBadge };
