import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface ITabItem {
  keyPath: string;
  name: string;
}

interface ITabBar {
  tabBackground: string;
  inactiveText: string;
  activeText: string;
  readonly shadowColor?: string;
  readonly glassBackground?: string;
}

interface IMorphicTabBarContext {
  activeIndex: number;
  setActive: (index: number, keyPath: string) => void;
  animationProgress: SharedValue<number>;
  previousIndex: SharedValue<number>;
  theme: ITabBar;
  borderRadius: number;
  enableGlass: boolean;
  enableShadow: boolean;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface IMorphicTabSlot {
  index: number;
  totalItems: number;
}

interface IMorphicTabBarRoot {
  readonly children?: ReactNode;
  /** Convenience shorthand — renders a `List` of `Trigger`s when no children are given. */
  readonly items?: ITabItem[];
  readonly onTabChange?: <T extends string, I extends number>(
    path: T,
    index: I,
  ) => void;
  readonly initialActiveIndex?: number;
  readonly animationDuration?: number;
  readonly borderRadius?: number;
  readonly light?: ITabBar;
  readonly dark?: ITabBar;
  readonly enableGlass?: boolean;
  readonly enableShadow?: boolean;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface IMorphicTabBarList {
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMorphicTabBarTrigger {
  readonly children?: ReactNode;
  readonly value: string;
  readonly style?: StyleProp<ViewStyle>;
}

interface IMorphicTabBarLabel {
  readonly children?: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IMorphicTabBarBackground {
  width: number;
  height: number;
  borderRadius: number;
  theme: ITabBar;
  enableGlass: boolean;
  enableShadow: boolean;
}

/** @deprecated kept for source compatibility — use `IMorphicTabBarRoot`. */
type IMorphicTabBar = IMorphicTabBarRoot;
/** @deprecated kept for source compatibility — use `IMorphicTabBarBackground`. */
type IBackground = IMorphicTabBarBackground;

export type {
  ITabItem,
  ITabBar,
  IMorphicTabBarContext,
  IMorphicTabSlot,
  IMorphicTabBarRoot,
  IMorphicTabBarList,
  IMorphicTabBarTrigger,
  IMorphicTabBarLabel,
  IMorphicTabBarBackground,
  IMorphicTabBar,
  IBackground,
};
