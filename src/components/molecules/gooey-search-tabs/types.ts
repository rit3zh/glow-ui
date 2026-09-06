import type { ReactNode } from "react";
import type { StyleProp, ViewStyle, TextStyle } from "react-native";
import type { SharedValue, WithSpringConfig } from "react-native-reanimated";

type TRGB = [number, number, number];

interface IColorScheme {
  bg: string;
  fg: string;
  muted: string;
  indicator: string;
}

interface ITabLayout {
  x: number;
  width: number;
}

interface IGooeySearchTabs {
  readonly children: ReactNode;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
  readonly onSearch?: (value: string) => void;
  readonly activeTab?: string;
  readonly defaultActiveTab?: string;
  readonly onTabChange?: (value: string) => void;
  readonly defaultExpanded?: boolean;
  readonly onExpandedChange?: (expanded: boolean) => void;
  readonly placeholder?: string;
  readonly intensity?: number;
  readonly springConfig?: WithSpringConfig;
  readonly colorScheme?: Partial<IColorScheme>;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

interface IGooeyTabs {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IGooeyTab {
  readonly value: string;
  readonly children: ReactNode;
  readonly tabPaddingHorizontal?: number;
  readonly onPress?: (value: string) => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IGooeyTabIcon {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IGooeyTabLabel {
  readonly children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IGooeyTrigger {
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IGooeyContext {
  readonly progress: SharedValue<number>;
  readonly expanded: boolean;
  readonly expand: () => void;
  readonly collapse: () => void;
  readonly toggle: () => void;
  readonly value: string;
  readonly setValue: (v: string) => void;
  readonly activeTab: string;
  readonly selectTab: (v: string) => void;
  readonly registerTab: (value: string) => void;
  readonly unregisterTab: (value: string) => void;
  readonly reportLayout: (value: string, layout: ITabLayout) => void;
  readonly layouts: Record<string, ITabLayout>;
  readonly setTabsWidth: (w: number) => void;
  readonly colorScheme: IColorScheme;
  readonly springConfig: WithSpringConfig;
}

interface ITabContext {
  readonly value: string;
  readonly active: boolean;
}

export type {
  TRGB,
  IColorScheme,
  ITabLayout,
  IGooeySearchTabs,
  IGooeyTabs,
  IGooeyTab,
  IGooeyTabIcon,
  IGooeyTabLabel,
  IGooeyTrigger,
  IGooeyContext,
  ITabContext,
};
