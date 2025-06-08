import { Feather } from "@expo/vector-icons";
import { StyleProp, View, TextStyle, ViewStyle } from "react-native";

export interface TimelineItem {
  id: string | number;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: keyof typeof Feather.glyphMap;
  status?: "complete" | "current" | "upcoming";
  meta?: string;
  children?: React.ReactNode;
  childrenContainer?: StyleProp<ViewStyle>;
}

export interface TimelineProps {
  items: TimelineItem[];
  activeColor?: string;
  inactiveColor?: string;
  animated?: boolean;
  animationType?: "bounce" | "spring" | "rotate" | "fade" | "scale";
  onItemPress?: (item: TimelineItem) => void;
  containerStyle?: ViewStyle;
  metaContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  timestampStyle?: TextStyle;
  lineWidth?: number;
  iconSize?: number;
  metaTextStyle?: StyleProp<TextStyle>;
}
