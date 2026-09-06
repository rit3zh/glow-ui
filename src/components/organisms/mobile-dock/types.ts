import type { ColorValue, StyleProp, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

/**
 * Root <Dock> props. All visual/physics configuration lives here and is
 * shared with every descendant through context.
 */
interface IDock {
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
  readonly children: React.ReactNode;
}

/** <Dock.Items> — the row that lays out and indexes each <Dock.Item>. */
interface IDockItems {
  readonly style?: StyleProp<ViewStyle>;
  readonly children: React.ReactNode;
}

/** <Dock.Item> — a single magnifying slot. */
interface IDockItem {
  readonly onPress?: () => void;
  readonly children: React.ReactNode;
}

interface IDockItemImage {
  readonly style?: StyleProp<ViewStyle>;
  readonly children?: React.ReactNode;
  readonly useBackgroundColor?: boolean;
}
interface IDockItemLabel {
  readonly children: React.ReactNode;
}

/**
 * Config shared through context. Split out so leaf components can read only
 * what they need without prop drilling.
 */
interface IDockConfig {
  readonly size: number;
  readonly peakSize: number;
  readonly spread: number;
  readonly gap: number;
  readonly iconColor: ColorValue;
  readonly tipColor: ColorValue;
  readonly tipFontColor: ColorValue;
  readonly iconRadius: number;
  readonly showTip: boolean;
  readonly paddingTop: number;
  readonly paddingBottom: number;
  readonly inputRange: number[];
  readonly outputRange: number[];
}

interface IDockContext {
  readonly activeIndex: SharedValue<number>;
  readonly isActive: SharedValue<number>;
  readonly itemCount: SharedValue<number>;
  readonly config: IDockConfig;
  readonly registerPress: (index: number, onPress?: () => void) => void;
}

export type {
  IDock,
  IDockItems,
  IDockItem,
  IDockItemImage,
  IDockItemLabel,
  IDockConfig,
  IDockContext,
};
