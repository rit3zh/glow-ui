import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface ICardLayout {
  rotate: string;
  translateX: number;
  translateY: number;
}

export interface IEmptyGalleryState {
  title?: string;
  description?: string;
  actionLabel?: string;
  photos?: ImageSourcePropType[];
  hideAction?: boolean;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
}
