import type { StyleProp, ViewStyle } from "react-native";
export type ShimmerEffectProps = {
  isLoading?: boolean;
  shimmerColors?: string[];
  duration?: number;
  className?: string;
  style?: ViewStyle;
  variant?: "shimmer" | "pulse";
  direction?: ShimmerDirection;
};
export type ShimmerDirection =
  | "leftToRight"
  | "rightToLeft"
  | "topToBottom"
  | "bottomToTop";
