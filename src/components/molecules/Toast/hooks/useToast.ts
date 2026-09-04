import { toast, toastEmitter } from "../toast.store";
import type {
  IToastLegacyOptions,
  TCreateInput,
  TToastContent,
  TToastId,
} from "../Toast.types";

type TToastApi = typeof toast & {
  show: (content: TToastContent, options?: IToastLegacyOptions) => TToastId;
};

function fromLegacyOptions(options?: IToastLegacyOptions): TCreateInput {
  if (!options) return {};

  const { onClose, action, backgroundColor, style, ...rest } = options;

  return {
    ...rest,
    style: backgroundColor ? [{ backgroundColor }, style] : style,
    onDismiss: onClose,
    onAutoClose: onClose,
    action: action
      ? { label: action.label, onPress: () => action.onPress() }
      : undefined,
  };
}

function show(content: TToastContent, options?: IToastLegacyOptions): TToastId {
  return toastEmitter.create({
    ...fromLegacyOptions(options),
    message: content,
  });
}

const toastApi = Object.assign(toast, { show }) as TToastApi;

function useToast(): TToastApi {
  return toastApi;
}

export { useToast };
export type { TToastApi };
