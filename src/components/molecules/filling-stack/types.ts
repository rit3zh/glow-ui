import type { BlurTint } from "expo-blur";
import type { ReactNode } from "react";
import type { ViewStyle, StyleProp } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface BaseItemType {
  id: string | number;
}

interface RenderItemInfo<T extends BaseItemType> {
  item: T;
  index: number;
}

interface FlingStackConfig<T extends BaseItemType> {
  data: ReadonlyArray<T>;
  renderItem: (info: RenderItemInfo<T>) => ReactNode;
  visibleCount?: number;
  readonly cardWidth?: number;
  readonly cardHeight?: number;
  readonly cardContainerStyle?: StyleProp<ViewStyle>;
  readonly borderRadius?: number;
  readonly wrapperStyle?: StyleProp<ViewStyle>;
  readonly blurIntensity?: number;
  readonly tint?: BlurTint;
  readonly useBlur?: boolean;
}

interface FlingCardConfig<T extends BaseItemType> {
  visibleCount: number;
  item: T;
  position: number;
  totalItems: number;
  readonly useBlur?: boolean;
  readonly tint?: BlurTint;
  readonly blurIntensity?: number;
  animProgress: SharedValue<number>;
  activeIndex: SharedValue<number>;
  lastIndex: SharedValue<number>;
  renderItem: (info: RenderItemInfo<T>) => ReactNode;
  cardWidth: number;
  cardHeight: number;
  cardContainerStyle?: StyleProp<ViewStyle>;
  readonly borderRadius?: number;
}

type FlingStackComponent = <T extends BaseItemType>(
  props: FlingStackConfig<T>,
) => ReactNode;

type FlingCardComponent = <T extends BaseItemType>(
  props: FlingCardConfig<T>,
) => ReactNode;

export type {
  BaseItemType,
  RenderItemInfo,
  FlingStackConfig,
  FlingCardConfig,
  FlingStackComponent,
  FlingCardComponent,
};
