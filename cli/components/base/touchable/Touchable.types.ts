import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface TouchableProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
}
