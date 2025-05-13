import type { StyleProp, ViewProps, ViewStyle } from "react-native";

export interface PaginationProps extends ViewProps {
  activeIndex: number;
  totalItems: number;
  inactiveColor?: string;
  activeColor?: string;
  currentColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  dotSize?: number;
  borderRadius?: number;
  dotContainer?: number;
  onIndexChange?: (index: number) => void;
}
