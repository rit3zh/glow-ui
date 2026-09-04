import React, { createContext, useContext } from "react";
import type { QRCodeContextValue } from "./types";

const QRCodeContext = createContext<QRCodeContextValue | null>(null);

const useQRCode = (): QRCodeContextValue => {
  const ctx = useContext(QRCodeContext);
  if (!ctx) {
    throw new Error("QRCode.* must be rendered inside <QRCode>.");
  }
  return ctx;
};

export { QRCodeContext, useQRCode };
