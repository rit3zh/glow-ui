import type { StyleProp, TextStyle } from "react-native";

export interface SubtitleProps {
  children: React.ReactNode;
  size?: number;
  style?: StyleProp<TextStyle>;
  className?: string;
}
