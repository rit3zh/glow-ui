import type { ReactNode } from "react";
import type { ImageSourcePropType } from "react-native";
import type { SharedValue } from "react-native-reanimated";
export interface VerticalPageItemProps<ItemT extends VerticalPageItem> {
  item: ItemT;
  index: number;
  scrollY: SharedValue<number>;
  renderItem: (info: { item: ItemT; index: number }) => React.ReactElement;
  itemHeight: number;
  cardMargin: number;
  cardSpacing: number;
  scaleRange: [number, number, number];
  rotationRange: [number, number, number];
  opacityRange: [number, number, number];
}

export interface VerticalPageProps<ItemT extends VerticalPageItem> {
  data: ItemT[];
  renderItem: (info: { item: ItemT; index: number }) => React.ReactElement;
  keyExtractor?: (item: ItemT, index: number) => string;
  itemHeight?: number;
  cardMargin?: number;
  cardSpacing?: number;
  pagingEnabled?: boolean;
  showVerticalScrollIndicator?: boolean;
  scaleRange?: [number, number, number];
  rotationRange?: [number, number, number];
  opacityRange?: [number, number, number];
}

export interface VerticalPageItem {
  image?: ImageSourcePropType;
  [key: string]: any;
}
