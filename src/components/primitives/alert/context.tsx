import { createContext, useContext } from "react";

import type { IAlertContextValue, TAlertContext } from "./types";

const AlertContext = createContext<IAlertContextValue | null>(null);

const useAlert = (component: TAlertContext): IAlertContextValue => {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Alert.Root>.`);
  }
  return ctx;
};

export { AlertContext, useAlert };
