import type { StyleProp, ViewStyle } from "react-native";

interface IOrbitDotLoader {
  dotColor?: string;
  dotRadius?: number;
  centerRadius?: number;
  size?: number;
  duration?: number;
  numDots?: number;
  style?: StyleProp<ViewStyle>;
}

export type { IOrbitDotLoader };
