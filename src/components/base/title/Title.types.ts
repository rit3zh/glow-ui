import type { StyleProp, TextStyle } from "react-native";

export interface TitleProps {
  children: React.ReactNode;
  size?: number;
  style?: StyleProp<TextStyle>;
}
