import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

type TActionRailSize = "sm" | "md";
type TActionRailTheme = "light" | "dark";

interface IActionRailPalette {
  readonly track: string;
  readonly border: string;
  readonly action: string;
  readonly actionText: string;
  readonly toggle: string;
  readonly toggleText: string;
}

interface IActionRailMetrics {
  readonly trackPadding: number;
  readonly gap: number;
  readonly actionHeight: number;
  readonly actionPaddingX: number;
  readonly actionGap: number;
  readonly toggleSize: number;
  readonly iconSize: number;
  readonly fontSize: number;
}

interface IActionRailIconState {
  readonly color: string;
  readonly size: number;
}

interface IActionRailTriggerState extends IActionRailIconState {
  readonly expanded: boolean;
}

interface IActionRailContext {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  notifyAction: (value?: string) => void;
  palette: IActionRailPalette;
  metrics: IActionRailMetrics;
  reduceMotion: boolean;
}

interface IActionRail {
  children: ReactNode;
  readonly expanded?: boolean;
  readonly defaultExpanded?: boolean;
  readonly onExpandedChange?: (expanded: boolean) => void;
  readonly onAction?: (value?: string) => void;
  readonly collapseOnAction?: boolean;
  readonly size?: TActionRailSize;
  readonly theme?: TActionRailTheme;
  readonly palette?: Partial<IActionRailPalette>;
  readonly style?: StyleProp<ViewStyle>;
}

interface IActionRailGroup {
  children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface IActionRailOverflow extends IActionRailGroup {}

interface IActionRailAction {
  children: ReactNode;
  readonly value?: string;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

interface IActionRailIcon {
  children: ReactNode | ((state: IActionRailIconState) => ReactNode);
  readonly style?: StyleProp<ViewStyle>;
}

interface IActionRailLabel {
  children: ReactNode;
  readonly style?: StyleProp<TextStyle>;
}

interface IActionRailTrigger {
  children?: ReactNode | ((state: IActionRailTriggerState) => ReactNode);
  readonly style?: StyleProp<ViewStyle>;
}

export type {
  IActionRail,
  IActionRailAction,
  IActionRailContext,
  IActionRailGroup,
  IActionRailIcon,
  IActionRailIconState,
  IActionRailLabel,
  IActionRailMetrics,
  IActionRailOverflow,
  IActionRailPalette,
  IActionRailTrigger,
  IActionRailTriggerState,
  TActionRailSize,
  TActionRailTheme,
};
