import { useContext } from "react";
import { DialogContextType } from "../Dialog.types";
import { DialogContext } from "../context/DialogContext";

export const useDialog = (): DialogContextType => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
};
