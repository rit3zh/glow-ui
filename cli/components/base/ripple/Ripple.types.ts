import type { StyleProp, ViewStyle } from "react-native";

export type TouchableRippleProps = {
  children: React.ReactElement;
  onPress?: () => void;
  onLongPress?: () => void;
  rippleColor?: string;
  duration?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};
