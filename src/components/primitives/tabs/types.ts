import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TTabsVariant = "default" | "underline";

type TTabsSize = "sm" | "default" | "lg";

type TTabsTheme = "light" | "dark";

type TTabsOrientation = "horizontal" | "vertical";

type TTabsContext = "Tabs.List" | "Tabs.Tab" | "Tabs.Panel" | "Tabs.Indicator";

interface ITabsPalette {
  listBg: string;
  indicator: string;
  underline: string;
  activeText: string;
  inactiveText: string;
  accent: string;
}

interface ITabsMetrics {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  iconSize: number;
  gap: number;
  listPadding: number;
  underlineSize: number;
}

interface ITabLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  contentX: number;
  contentY: number;
  contentWidth: number;
  contentHeight: number;
}

interface ITabsRoot {
  children?: ReactNode;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly orientation?: TTabsOrientation;
  readonly theme?: TTabsTheme;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

interface ITabsList {
  children?: ReactNode;
  readonly variant?: TTabsVariant;
  readonly size?: TTabsSize;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITabsTab {
  children?: ReactNode;
  readonly value: string;
  readonly size?: TTabsSize;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
}

interface ITabsPanel {
  children?: ReactNode;
  readonly value: string;
  readonly keepMounted?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface ITabsContextValue {
  value: string;
  setValue: (value: string) => void;
  orientation: TTabsOrientation;
  theme: TTabsTheme;
  palette: ITabsPalette;
}

interface ITabsListContextValue {
  variant: TTabsVariant;
  size: TTabsSize;
  metrics: ITabsMetrics;
  registerTab: (value: string, layout: ITabLayout) => void;
  indicator: {
    x: SharedValue<number>;
    y: SharedValue<number>;
    width: SharedValue<number>;
    height: SharedValue<number>;
    ready: SharedValue<number>;
  };
}

export type {
  TTabsVariant,
  TTabsSize,
  TTabsTheme,
  TTabsOrientation,
  TTabsContext,
  ITabsPalette,
  ITabsMetrics,
  ITabLayout,
  ITabsRoot,
  ITabsList,
  ITabsTab,
  ITabsPanel,
  ITabsContextValue,
  ITabsListContextValue,
};
