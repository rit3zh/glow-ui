import type { StyleProp, ViewStyle } from "react-native";
export interface ShimmerEffectProps {
  children: React.ReactNode;
  isLoading: boolean;
  shimmerColors?: string[];
  shimmerDuration?: number;
  shimmerWidth?: number;
  shimmerAngle?: number;
  containerStyle?: StyleProp<ViewStyle>;
  blurIntensity?: number;
  blurTint?: "light" | "dark" | "default";
}
