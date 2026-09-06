import { createContext, useContext } from "react";

import type { IDialogContextValue, TDialogContext } from "./types";

const DialogContext = createContext<IDialogContextValue | null>(null);

const useDialog = <T extends TDialogContext>(
  component: T,
): IDialogContextValue => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <Dialog.Root>.`);
  }
  return ctx;
};

export { DialogContext, useDialog };
