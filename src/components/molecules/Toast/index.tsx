import type { IToastProvider } from "./Toast.types";
import { ToastProvider } from "./ToastProvider";

export { Toaster } from "./Toaster";
export { ToastProvider } from "./ToastProvider";
export { toast, toastEmitter } from "./toast.store";
export { useToast } from "./hooks/useToast";
export type { TToastApi } from "./hooks/useToast";
export {
  createToastStyles,
  darkColors as toastDarkColors,
  lightColors as toastLightColors,
  useToastTheme,
} from "./toast.theme";
export type * from "./Toast.types";

/**
 * @deprecated Renamed to `ToastProvider`, kept so existing imports keep working.
 */
const ToastProviderWithViewport = (props: IToastProvider) => (
  <ToastProvider {...props} />
);

/**
 * @deprecated Use the lowercase `toast` API — `toast.success("…")`.
 */
export { toast as Toast } from "./toast.store";

export { ToastProviderWithViewport };
