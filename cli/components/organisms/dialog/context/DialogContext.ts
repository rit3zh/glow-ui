import { createContext } from "react";
import { DialogContextType } from "../Dialog.types";

export const DialogContext = createContext<DialogContextType | null>(null);
