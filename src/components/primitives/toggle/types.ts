import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TToggleVariant = "default" | "outline";

type TToggleSize = "sm" | "md" | "lg";

type TToggleTheme = "light" | "dark";

type TToggleContext =
  | "Toggle.Content"
  | "Toggle.Label"
  | "Toggle.Icon"
  | "Toggle.Fill"
  | "Toggle.Sheen";

interface ITogglePalette {
  fill: string;
  border: string;
  labelOn: string;
  labelOff: string;
  sheen: string;
}

interface IToggleMetrics {
  height: number;
  minWidth: number;
  paddingHorizontal: number;
  radius: number;
  gap: number;
  fontSize: number;
  iconSize: number;
}

interface IToggleRoot {
  children?: ReactNode;
  readonly pressed?: boolean;
  readonly defaultPressed?: boolean;
  readonly onPressedChange?: (pressed: boolean) => void;
  readonly variant?: TToggleVariant;
  readonly size?: TToggleSize;
  readonly theme?: TToggleTheme;
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface IToggleContent {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IToggleLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IToggleIcon {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IToggleContextValue {
  pressed: boolean;
  disabled: boolean;
  variant: TToggleVariant;
  size: TToggleSize;
  theme: TToggleTheme;
  palette: ITogglePalette;
  metrics: IToggleMetrics;
  fillProgress: SharedValue<number>;
  iconScale: SharedValue<number>;
  iconScaleX: SharedValue<number>;
  iconScaleY: SharedValue<number>;
  color: string;
  toggle: () => void;
}

export type {
  TToggleVariant,
  TToggleSize,
  TToggleTheme,
  TToggleContext,
  ITogglePalette,
  IToggleMetrics,
  IToggleRoot,
  IToggleContent,
  IToggleLabel,
  IToggleIcon,
  IToggleContextValue,
};
