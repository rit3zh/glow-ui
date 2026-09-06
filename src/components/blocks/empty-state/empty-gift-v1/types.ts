import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface IHaloRing {
  size: number;

  opacity: number;
}

export interface IEmptyGiftState {
  title?: string;

  description?: string;

  actionLabel?: string;

  artwork?: ImageSourcePropType;

  hideAction?: boolean;

  hideHalo?: boolean;

  style?: StyleProp<ViewStyle>;

  onActionPress?: () => void;
}
