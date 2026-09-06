import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TSwitchSize = "sm" | "md" | "lg";
type TSwitchTheme = "light" | "dark";
type TSwitchContext =
  | "Switch.Track"
  | "Switch.Thumb"
  | "Switch.Content"
  | "Switch.Label"
  | "Switch.Description";

interface ISwitchPalette {
  trackOff: string;
  trackOn: string;
  border: string;
  thumb: string;
  label: string;
  description: string;
}

interface ISwitchMetrics {
  trackWidth: number;
  trackHeight: number;
  thumbSize: number;
  padding: number;
  travel: number;
}

interface ISwitchRoot {
  children?: ReactNode;
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly disabled?: boolean;
  readonly size?: TSwitchSize;
  readonly theme?: TSwitchTheme;
  readonly trackColor?: string;
  readonly thumbColor?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface ISwitchThumb {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISwitchTrack {
  children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISwitchContent {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface ISwitchLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface ISwitchDescription {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface ISwitchContextValue {
  checked: boolean;
  disabled: boolean;
  size: TSwitchSize;
  palette: ISwitchPalette;
  metrics: ISwitchMetrics;
  progress: SharedValue<number>;
  pressed: SharedValue<number>;
  thumbColor?: string;
  toggle: () => void;
}

export type {
  TSwitchSize,
  TSwitchTheme,
  TSwitchContext,
  ISwitchPalette,
  ISwitchMetrics,
  ISwitchRoot,
  ISwitchThumb,
  ISwitchTrack,
  ISwitchContent,
  ISwitchLabel,
  ISwitchDescription,
  ISwitchContextValue,
};
