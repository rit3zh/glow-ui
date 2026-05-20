import type { StyleProp, ViewStyle } from "react-native";

interface IGridBackground {
  cellSize?: number;
  lineColor?: string;
  lineWidth?: number;
  backgroundColor?: string;
  showVignette?: boolean;
  showTopFade?: boolean;
  showBottomFade?: boolean;
  children?: React.ReactNode;
}

export type { IGridBackground };
