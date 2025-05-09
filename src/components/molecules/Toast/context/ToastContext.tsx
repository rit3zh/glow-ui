import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Toast, ToastContextValue, ToastOptions } from "../Toast.types";

const DEFAULT_TOAST_OPTIONS: Required<ToastOptions> = {
  duration: 3000,
  type: "default",
  position: "bottom",
  onClose: () => {},
  action: {},
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback(
    (content: React.ReactNode | string, options?: ToastOptions): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: Toast = {
        id,
        content,
        options: {
          ...DEFAULT_TOAST_OPTIONS,
          ...options,
        },
      };

      setToasts((prevToasts) => [...prevToasts, toast]);
      return id;
    },
    []
  );

  const update = useCallback(
    (id: string, content: React.ReactNode | string, options?: ToastOptions) => {
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === id
            ? {
                ...toast,
                content,
                options: {
                  ...toast.options,
                  ...options,
                },
              }
            : toast
        )
      );
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timeouts: NodeJS.Timeout[] = [];

    toasts.forEach((toast) => {
      if (toast.options.duration > 0) {
        const timeout = setTimeout(() => {
          dismiss(toast.id);
          toast.options.onClose?.();
        }, toast.options.duration);
        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [toasts, dismiss]);

  const value: ToastContextValue = {
    toasts,
    show,
    update,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
