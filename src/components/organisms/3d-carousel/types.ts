import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface ICarousel3D<ItemT = string> {
  data: readonly ItemT[];
  imageExtractor?: (item: ItemT, index: number) => string;
  renderItem?: (info: { item: ItemT; index: number }) => ReactNode;
  keyExtractor?: (item: ItemT, index: number) => string;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
  radius?: number;
  cylinderWidth?: number;
  perspectiveFactor?: number;
  height?: number;
  dragSensitivity?: number;
  snap?: boolean;
  initialIndex?: number;
  backOpacity?: number;
  borderRadius?: number;
  onIndexChange?: (index: number) => void;
  onPressItem?: (item: ItemT, index: number) => void;
  style?: StyleProp<ViewStyle>;
}

interface ICarousel3DFace {
  index: number;
  rotation: SharedValue<number>;
  step: number;
  radius: number;
  perspective: number;
  itemWidth: number;
  itemHeight: number;
  backOpacity: number;
  borderRadius: number;
  onPress?: (index: number) => void;
  children: ReactNode;
}

interface ICarousel3DImage {
  uri: string;
  width: number;
  height: number;
  borderRadius: number;
}

export type {
  ICarousel3D,
  ICarousel3DFace,
  ICarousel3DImage,
};
