import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TToastId = string | number;

type TToastType =
  | "default"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "loading";

type TToastPosition = "top" | "bottom";

type TToastTheme = "light" | "dark" | "system";

type TToastContent = ReactNode | (() => ReactNode);

type TOnDismiss = (toast: IToast) => void;

type TPromise<TData = unknown> = Promise<TData> | (() => Promise<TData>);

type TPromiseResult<TData = unknown> = ReactNode | ((data: TData) => ReactNode);

type TToastSwipeDirection = "horizontal" | "vertical" | "any" | "none";

type TToastActionSide = "left" | "right" | "both";

interface IToastSwipeAction {
  icon?: ReactNode | ((toast: IToast) => ReactNode);
  label?: ReactNode;
  color?: string;
  tint?: string;
  revealWidth?: number;
  commitThreshold?: number;
  commitOffset?: number;
  direction?: TToastActionSide;
  onCommit?: (toast: IToast) => void;
  dismissOnCommit?: boolean;
}

interface IToastAction {
  label: ReactNode;
  onPress: (id: TToastId) => void;
}

interface IToast {
  id: TToastId;
  type?: TToastType;
  title?: TToastContent;
  description?: TToastContent;
  icon?: ReactNode;
  jsx?: ReactNode;
  duration?: number;
  dismissible?: boolean;
  position?: TToastPosition;
  action?: IToastAction;
  cancel?: IToastAction;
  onDismiss?: TOnDismiss;
  onAutoClose?: TOnDismiss;
  promise?: TPromise;
  swipeAction?: IToastSwipeAction | null;
  style?: StyleProp<ViewStyle>;
  delete?: boolean;
}

type TExternalToast = Omit<
  IToast,
  "id" | "type" | "title" | "jsx" | "promise" | "delete"
> & {
  id?: TToastId;
};

interface IPromiseData<TData = unknown> extends Omit<
  TExternalToast,
  "description"
> {
  loading?: ReactNode;
  success?: TPromiseResult<TData>;
  error?: TPromiseResult;
  description?: TPromiseResult;
  finally?: () => void | Promise<void>;
}

interface IToastToDismiss {
  id: TToastId;
  dismiss: true;
}

interface IToastIcons {
  success?: ReactNode;
  info?: ReactNode;
  warning?: ReactNode;
  error?: ReactNode;
  loading?: ReactNode;
  close?: ReactNode;
}

interface IToastHeight {
  toastId: TToastId;
  height: number;
  position: TToastPosition;
}

/**
 * Measured heights keyed by toast id, built once per render by the `Toaster`.
 * Every item reads from the same map instead of scanning a shared array, which
 * keeps a burst of toasts linear rather than quadratic.
 */
type TToastHeightMap = ReadonlyMap<TToastId, number>;

interface IToaster {
  position?: TToastPosition;
  duration?: number;
  gap?: number;
  visibleToasts?: number;
  expand?: boolean;
  offset?: number;
  closeButton?: boolean;
  swipeToDismiss?: boolean;
  swipeDirection?: TToastSwipeDirection;
  swipeAction?: IToastSwipeAction;
  haptics?: boolean;
  theme?: TToastTheme;
  colors?: Partial<TToastColors>;
  icons?: IToastIcons;
  style?: StyleProp<ViewStyle>;
  toastStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

interface IToastProvider extends IToaster {
  children: ReactNode;
}

interface IToastItem {
  toast: IToast;
  toasts: IToast[];
  heightMap: TToastHeightMap;
  index: number;
  expanded: boolean;
  expandByDefault: boolean;
  interacting: boolean;
  gap: number;
  position: TToastPosition;
  visibleToasts: number;
  closeButton: boolean;
  swipeToDismiss: boolean;
  swipeDirection: TToastSwipeDirection;
  swipeAction?: IToastSwipeAction;
  haptics: boolean;
  duration: number;
  icons?: IToastIcons;
  toastStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  setHeights: Dispatch<SetStateAction<IToastHeight[]>>;
  removeToast: (toast: IToast) => void;
  onInteractingChange: (interacting: boolean) => void;
  onExpand: () => void;
}

interface IToastBody {
  toast: IToast;
  iconNode: ReactNode;
  type: TToastType;
  dismissible: boolean;
  closeButton: boolean;
  icons?: IToastIcons;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  onCancel: () => void;
  onAction: () => void;
  onClose: () => void;
}

interface IToastSwipeActionLayer {
  action: IToastSwipeAction;
  toast: IToast;
  side: Exclude<TToastActionSide, "both">;
  rowHeight: number;
  rowWidth: number;
  dragX: SharedValue<number>;
  onPress: () => void;
}

interface IIcon {
  size?: number;
  color: string;
}

interface IToastGeometry {
  isBottom: boolean;
  dir: number;
  targetY: number;
  targetScale: number;
  targetOpacity: number;
  enterDistance: number;
  /** Whether the row has reported a real height yet. */
  measured: boolean;
}

interface IToastLayout {
  toastId: TToastId;
  toasts: IToast[];
  heightMap: TToastHeightMap;
  /** This row's own measured height, known locally a beat before the map is. */
  selfHeight: number;
  index: number;
  position: TToastPosition;
  expanded: boolean;
  expandByDefault: boolean;
  gap: number;
  visibleToasts: number;
}

interface IToastLifecycle {
  toast: IToast;
  duration: number;
  disabled: boolean;
  paused: boolean;
  presence: SharedValue<number>;
  removeToast: (toast: IToast) => void;
}

interface IToastMotion {
  toast: IToast;
  layout: IToastGeometry;
  actionMode: boolean;
}

interface IToastSwipe {
  enabled: boolean;
  swipeDirection: TToastSwipeDirection;
  action?: IToastSwipeAction;
  isBottom: boolean;
  rowWidth: number;
  screenW: number;
  screenH: number;
  haptics: boolean;
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  lockedAxis: SharedValue<number>;
  swipeOrigin: SharedValue<number>;
  armed: SharedValue<number>;
  presence: SharedValue<number>;
  commitBySwipe: () => void;
  dismissBySwipe: () => void;
  onOpenChange: (open: boolean) => void;
  onInteractingChange: (interacting: boolean) => void;
}

type TToastColors = {
  card: string;
  border: string;
  foreground: string;
  mutedForeground: string;
  primaryForeground: string;
  subtle: string;
  destructive: string;
  success: string;
  info: string;
  warning: string;
  shadow: string;
};

type TSubscriber = (toast: IToast | IToastToDismiss) => void;

type TCreateInput = TExternalToast & {
  message?: TToastContent;
  type?: TToastType;
  jsx?: ReactNode;
  promise?: TPromise;
};

interface IToastLegacyOptions {
  duration?: number;
  type?: Exclude<TToastType, "loading">;
  position?: TToastPosition;
  onClose?: () => void;
  action?: { label: string; onPress: () => void } | null;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  swipeAction?: IToastSwipeAction | null;
}

export type {
  IIcon,
  IPromiseData,
  IToast,
  IToastAction,
  IToastBody,
  IToaster,
  IToastGeometry,
  IToastHeight,
  IToastIcons,
  IToastItem,
  IToastLayout,
  IToastLegacyOptions,
  IToastLifecycle,
  IToastMotion,
  IToastProvider,
  IToastSwipe,
  IToastSwipeAction,
  IToastSwipeActionLayer,
  IToastToDismiss,
  TCreateInput,
  TExternalToast,
  TOnDismiss,
  TPromise,
  TPromiseResult,
  TSubscriber,
  TToastActionSide,
  TToastColors,
  TToastContent,
  TToastHeightMap,
  TToastId,
  TToastPosition,
  TToastSwipeDirection,
  TToastTheme,
  TToastType,
};
