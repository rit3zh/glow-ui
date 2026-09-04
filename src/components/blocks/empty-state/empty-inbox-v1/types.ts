import type { StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export interface ISkeletonRow {
  opacity: number;
  scale: number;
  lineWidths: readonly number[];
}

export interface IEmptyInboxState {
  title?: string;
  description?: string;
  actionLabel?: string;
  hideAction?: boolean;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
}
