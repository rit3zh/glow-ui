import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface IGlyph {
  size?: number;
  color?: string;
}

export interface ICardLayout {
  rotate: number;
  translateX: number;
  translateY: number;
}

export interface IPhotoCard {
  source: ImageSourcePropType | null;
  layout: ICardLayout;
  index: number;
  animated: boolean;
}

export interface IEmptyCollectionState {
  title?: string;
  actionLabel?: string;
  photos?: ImageSourcePropType[];
  hideAction?: boolean;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  onActionPress?: () => void;
}
