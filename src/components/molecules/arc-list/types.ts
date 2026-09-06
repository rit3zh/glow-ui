import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type Animated from "react-native-reanimated";
import type { AnimatedRef, SharedValue } from "react-native-reanimated";

type ArcSide = "left" | "right";

interface IArcListRoot {
  children: ReactNode;
  itemHeight?: number;
  height?: number;
  sweep?: number;
  radius?: number;
  side?: ArcSide;
  snap?: boolean;
  index?: number;
  defaultIndex?: number;
  minOpacity?: number;
  minScale?: number;

  haptics?: boolean;
  onIndexChange?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

interface IArcListViewport {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

interface IArcListItem {
  children: ReactNode;
  index?: number;
  disabled?: boolean;
  onPress?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

interface IArcListLabel {
  children: ReactNode;
  color?: string;
  activeColor?: string;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

interface IArcListIndicator {
  children?: ReactNode;
  size?: number;
  color?: string;
  activeColor?: string;
  borderWidth?: number;
  style?: StyleProp<ViewStyle>;
}

interface IArcListContext {
  readonly scrollRef: AnimatedRef<Animated.ScrollView>;
  readonly scrollY: SharedValue<number>;
  readonly count: SharedValue<number>;
  readonly itemHeight: number;
  readonly radius: number;
  readonly halfHeight: number;
  readonly direction: number;
  readonly side: ArcSide;
  readonly snap: boolean;
  readonly minOpacity: number;
  readonly minScale: number;
  readonly initialIndex: number;
  readonly scrollToIndex: (index: number, animated?: boolean) => void;
  readonly setCount: (count: number) => void;
}

interface IArcListItemContext {
  readonly index: number;
  readonly proximity: SharedValue<number>;
}

export type {
  ArcSide,
  IArcListContext,
  IArcListIndicator,
  IArcListItem,
  IArcListItemContext,
  IArcListLabel,
  IArcListRoot,
  IArcListViewport,
};
