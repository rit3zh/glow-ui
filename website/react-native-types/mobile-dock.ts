import type { ColorValue, StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface IDockItem {
  icon: React.ReactNode;
  label: string;
  readonly onPress?: () => void;
}

interface IDock {
  items: IDockItem[];
  readonly height?: number;
  readonly size?: number;
  readonly peakSize?: number;
  readonly spread?: number;
  readonly damping?: number;
  readonly stiffness?: number;
  readonly mass?: number;
  readonly dockColor?: ColorValue;
  readonly iconColor?: ColorValue;
  readonly tipColor?: ColorValue;
  readonly tipFontColor?: ColorValue;
  readonly iconRadius?: number;
  readonly dockRadius?: number;
  readonly showTip?: boolean;
  readonly gap?: number;
  readonly paddingTop?: number;
  readonly paddingBottom?: number;
  readonly marginBottom?: number;
  readonly style?: StyleProp<ViewStyle>;
}

interface IAnimatedDockIcon {
  item: IDockItem;
  index: number;
  size: number;
  inputRange: readonly number[];
  outputRange: readonly number[];
  activeIndex: SharedValue<number>;
  isActive: SharedValue<number>;
  iconColor: ColorValue;
  tipColor: ColorValue;
  tipFontColor: ColorValue;
  iconRadius: number;
  showTip: boolean;
  gap: number;
}

export type { IAnimatedDockIcon, IDock, IDockItem };
