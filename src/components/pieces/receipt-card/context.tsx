import { createContext, useContext } from "react";

import type { IReceiptCardContext, TReceiptComponents } from "./types";

const ReceiptCardContext = createContext<IReceiptCardContext | null>(null);

const useReceiptCard = (
  component: TReceiptComponents = "ReceiptCard.Item",
): IReceiptCardContext => {
  const ctx = useContext<IReceiptCardContext | null>(ReceiptCardContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <ReceiptCard>.`);
  }
  return ctx;
};

export { ReceiptCardContext, useReceiptCard };
