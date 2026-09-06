import type { ReactNode } from "react";
import type {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TRippleButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

type TRippleButtonSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "icon-xs"
  | "icon-sm"
  | "icon"
  | "icon-lg";

type TRippleButtonTheme = "light" | "dark";

type TRippleButtonIconPosition = "start" | "end";

type TRippleButtonContext =
  | "RippleButton.Content"
  | "RippleButton.Label"
  | "RippleButton.Icon"
  | "RippleButton.Spinner";

interface IRippleButtonPalette {
  bg: string;
  bgPressed: string;
  border: string;
  fg: string;
  ripple: string;
}

interface IRippleButtonMetrics {
  height: number;
  paddingHorizontal: number;
  radius: number;
  gap: number;
  fontSize: number;
  iconSize: number;
  iconOnly: boolean;
}

interface IRippleButtonRipple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface IRippleButtonRoot {
  children?: ReactNode;
  readonly variant?: TRippleButtonVariant;
  readonly size?: TRippleButtonSize;
  readonly theme?: TRippleButtonTheme;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly disableRipple?: boolean;
  readonly icon?: ReactNode;
  readonly iconPosition?: TRippleButtonIconPosition;
  readonly loadingIcon?: ReactNode;
  readonly accessibilityLabel?: string;
  readonly onPress?: (event: GestureResponderEvent) => void;
  readonly onLongPress?: (event: GestureResponderEvent) => void;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface IRippleButtonContent {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IRippleButtonLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IRippleButtonIcon {
  children?: ReactNode;
  readonly position?: TRippleButtonIconPosition;
  readonly style?: StyleProp<ViewStyle>;
}

interface IRippleButtonSpinner {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IRippleButtonContextValue {
  variant: TRippleButtonVariant;
  size: TRippleButtonSize;
  theme: TRippleButtonTheme;
  palette: IRippleButtonPalette;
  metrics: IRippleButtonMetrics;
  disabled: boolean;
  loading: boolean;
  loadingIcon?: ReactNode;
  pressed: SharedValue<number>;
}

export type {
  TRippleButtonVariant,
  TRippleButtonSize,
  TRippleButtonTheme,
  TRippleButtonIconPosition,
  TRippleButtonContext,
  IRippleButtonPalette,
  IRippleButtonMetrics,
  IRippleButtonRipple,
  IRippleButtonRoot,
  IRippleButtonContent,
  IRippleButtonLabel,
  IRippleButtonIcon,
  IRippleButtonSpinner,
  IRippleButtonContextValue,
};
