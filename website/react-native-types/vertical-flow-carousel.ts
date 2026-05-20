import type { ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface VerticalCarouselProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  spacing?: number;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  onItemPress?: (item: T, index: number) => void;
  showBlur?: boolean;
  blurIntensity?: number;
  rotationAngle?: number;
  scaleInactive?: number;
  opacityInactive?: number;
  snapEnabled?: boolean;
}

interface AnimatedItemProps<T> {
  item: T;
  index: number;
  scrollY: SharedValue<number>;
  itemHeight: number;
  spacing: number;
  rotationAngle: number;
  scaleInactive: number;
  opacityInactive: number;
  showBlur: boolean;
  blurIntensity: number;
  children: React.ReactNode;
  totalItems: number;
}

export { VerticalCarouselProps, AnimatedItemProps };
