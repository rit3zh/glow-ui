import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
interface ISquircleView {
  readonly width?: number;
  readonly height?: number;
  readonly cornerRadius?: number | SharedValue<number>;
  readonly cornerSmoothing?: number | SharedValue<number>;
  readonly backgroundColor?: string;
  readonly borderColor?: string;
  readonly borderWidth?: number;
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

export type { ISquircleView };
