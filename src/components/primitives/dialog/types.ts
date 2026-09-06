import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TDialogTheme = "light" | "dark";

type TDialogDirection = "top" | "bottom" | "left" | "right";

type TDialogContext =
  | "Dialog.Trigger"
  | "Dialog.Portal"
  | "Dialog.Overlay"
  | "Dialog.Content"
  | "Dialog.Close"
  | "Dialog.Header"
  | "Dialog.Footer"
  | "Dialog.Title"
  | "Dialog.Description";

interface IDialogPalette {
  scrim: string;
  surface: string;
  border: string;
  title: string;
  description: string;
  close: string;
  closeBg: string;
}

interface IDialogRoot {
  children: ReactNode;
  /** Controlled open state. */
  readonly open?: boolean;
  /** Uncontrolled initial open state. */
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly theme?: TDialogTheme;
}

interface IDialogTrigger {
  children: ReactNode;
  /** Render the child as the trigger instead of wrapping it in a pressable. */
  readonly asChild?: boolean;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface IDialogPortal {
  children: ReactNode;
  /** Draw behind the status bar on Android. Defaults to `true`. */
  readonly statusBarTranslucent?: boolean;
  /** Close the dialog on the Android hardware back button. Defaults to `true`. */
  readonly dismissOnBackPress?: boolean;
}

interface IDialogOverlay {
  children?: ReactNode;
  /** Blur strength. Maps to `expo-blur` intensity on iOS and to a blur radius on Android. */
  readonly intensity?: number;
  /** Tint drawn over the blur. Defaults to the theme scrim. */
  readonly tint?: string;
  readonly dismissOnPress?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface IDialogContent {
  children: ReactNode;
  /** Edge the dialog flips in from. Defaults to `"top"`. */
  readonly from?: TDialogDirection;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface IDialogClose {
  children?: ReactNode;
  readonly asChild?: boolean;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface IDialogHeader {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IDialogFooter {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IDialogTitle {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IDialogDescription {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IDialogContextValue {
  isOpen: boolean;
  /** Stays `true` until the exit animation has finished. */
  isMounted: boolean;
  theme: TDialogTheme;
  palette: IDialogPalette;
  /** 0 = fully closed, 1 = fully open. */
  progress: SharedValue<number>;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

export type {
  TDialogTheme,
  TDialogDirection,
  TDialogContext,
  IDialogPalette,
  IDialogRoot,
  IDialogTrigger,
  IDialogPortal,
  IDialogOverlay,
  IDialogContent,
  IDialogClose,
  IDialogHeader,
  IDialogFooter,
  IDialogTitle,
  IDialogDescription,
  IDialogContextValue,
};
