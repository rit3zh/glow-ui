import type { StyleProp, ViewStyle } from "react-native";

interface IRangeSlider {
  readonly value?: number;
  readonly defaultValue?: number;
  readonly onValueChange?: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly showTicks?: boolean;
  readonly disabled?: boolean;
  readonly trackColor?: string;
  readonly fillColor?: string;
  readonly thumbColor?: string;
  readonly tickColor?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly accessibilityLabel?: string;
}

export type { IRangeSlider };
