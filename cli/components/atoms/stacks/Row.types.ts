import { StyleProp, ViewStyle } from "react-native";

export interface RowProps {
  children: React.ReactNode;
  spacing?: number;
  style?: StyleProp<ViewStyle>;
}
