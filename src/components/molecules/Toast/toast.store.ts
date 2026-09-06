import type { ReactElement } from "react";

import { Emitter } from "./toast.emitter";
import type {
  IPromiseData,
  IToast,
  IToastToDismiss,
  TCreateInput,
  TExternalToast,
  TPromise,
  TToastContent,
  TToastId,
} from "./Toast.types";

const HISTORY_LIMIT = 50;

let counter = 1;

type TToastEvent = IToast | IToastToDismiss;

class ToastEmitter extends Emitter<TToastEvent> {
  toasts: IToast[] = [];

  private dismissed = new Set<TToastId>();

  private addToast = (data: IToast) => {
    this.publish(data);
    this.toasts = [...this.toasts, data].slice(-HISTORY_LIMIT);
  };

  create = (data: TCreateInput): TToastId => {
    const { message, ...rest } = data;

    const id =
      typeof data.id === "number" || (data.id && String(data.id).length > 0)
        ? (data.id as TToastId)
        : counter++;

    const exists = this.toasts.find((toast) => toast.id === id);
    const dismissible = data.dismissible ?? true;

    if (this.dismissed.has(id)) {
      this.dismissed.delete(id);
    }

    if (exists) {
      this.toasts = this.toasts.map((toast) => {
        if (toast.id !== id) {
          return toast;
        }

        const next: IToast = {
          ...toast,
          ...rest,
          id,
          dismissible,
          title: message ?? toast.title,
        };

        this.publish(next);

        return next;
      });
    } else {
      this.addToast({
        ...rest,
        title: message,
        dismissible,
        id,
      });
    }

    return id;
  };

  update = (id: TToastId, data: Omit<TCreateInput, "id">): TToastId =>
    this.create({ ...data, id });

  dismiss = (id?: TToastId): TToastId | undefined => {
    if (id == null) {
      this.toasts.forEach((toast) => {
        this.dismissed.add(toast.id);
        this.publish({ id: toast.id, dismiss: true });
      });

      return undefined;
    }

    this.dismissed.add(id);

    this.publish({
      id,
      dismiss: true,
    });

    return id;
  };

  remove = (id: TToastId) => {
    this.dismissed.delete(id);
  };

  message = (message: TToastContent, data?: TExternalToast) =>
    this.create({
      ...data,
      message,
    });

  success = (message: TToastContent, data?: TExternalToast) =>
    this.create({
      ...data,
      type: "success",
      message,
    });

  error = (message: TToastContent, data?: TExternalToast) =>
    this.create({
      ...data,
      type: "error",
      message,
    });

  info = (message: TToastContent, data?: TExternalToast) =>
    this.create({
      ...data,
      type: "info",
      message,
    });

  warning = (message: TToastContent, data?: TExternalToast) =>
    this.create({
      ...data,
      type: "warning",
      message,
    });

  loading = (message: TToastContent, data?: TExternalToast) =>
    this.create({
      ...data,
      type: "loading",
      message,
    });

  custom = (jsx: (id: TToastId) => ReactElement, data?: TExternalToast) => {
    const id = data?.id ?? counter++;

    this.create({
      ...data,
      id,
      jsx: jsx(id),
    });

    return id;
  };

  promise = <TData>(promise: TPromise<TData>, data?: IPromiseData<TData>) => {
    if (!data) {
      return;
    }

    let id: TToastId | undefined;

    if (data.loading !== undefined) {
      id = this.create({
        ...data,
        type: "loading",
        message: data.loading,
        description:
          typeof data.description !== "function" ? data.description : undefined,
      });
    }

    const run = Promise.resolve(
      promise instanceof Function ? promise() : promise,
    );

    run
      .then((response) => {
        if (data.success !== undefined) {
          const message =
            typeof data.success === "function"
              ? data.success(response)
              : data.success;

          const description =
            typeof data.description === "function"
              ? data.description(response)
              : data.description;

          this.create({
            id,
            type: "success",
            message,
            description,
            promise: undefined,
          });
        } else if (id != null) {
          this.dismiss(id);
        }
      })
      .catch((error) => {
        if (data.error !== undefined) {
          const message =
            typeof data.error === "function" ? data.error(error) : data.error;

          const description =
            typeof data.description === "function"
              ? data.description(error)
              : data.description;

          this.create({
            id,
            type: "error",
            message,
            description,
            promise: undefined,
          });
        } else if (id != null) {
          this.dismiss(id);
        }
      })
      .finally(() => {
        void data.finally?.();
      });

    return id;
  };

  getActiveToasts = () =>
    this.toasts.filter((toast) => !this.dismissed.has(toast.id));
}

const toastEmitter = new ToastEmitter();

const baseToast = (message: TToastContent, data?: TExternalToast): TToastId =>
  toastEmitter.create({
    ...data,
    message,
  });

const toast = Object.assign(baseToast, {
  message: toastEmitter.message,
  success: toastEmitter.success,
  error: toastEmitter.error,
  info: toastEmitter.info,
  warning: toastEmitter.warning,
  loading: toastEmitter.loading,
  custom: toastEmitter.custom,
  promise: toastEmitter.promise,
  update: toastEmitter.update,
  dismiss: toastEmitter.dismiss,
  dismissAll: () => toastEmitter.dismiss(),
  getHistory: () => toastEmitter.toasts,
  getActive: () => toastEmitter.getActiveToasts(),
});

export { toast, toastEmitter };
