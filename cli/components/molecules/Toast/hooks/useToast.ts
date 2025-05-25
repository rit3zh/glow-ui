import { useContext } from "react";
import { ToastContextValue } from "../Toast.types";

export const useToast = <T extends ToastContextValue>(
  ReactContext: React.Context<T>
): ToastContextValue => {
  const context = useContext(ReactContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
