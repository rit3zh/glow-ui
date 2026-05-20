import type { StyleProp, ViewStyle } from "react-native";

interface IRotatingSquaresSpinner {
  color?: string;
  squareSize?: number;
  spacing?: number;
  size?: number;
  duration?: number;
  repeatCount?: number;
  style?: StyleProp<ViewStyle>;
}

export type { IRotatingSquaresSpinner };
