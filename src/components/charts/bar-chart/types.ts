import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface IBarChartPoint {
  readonly label: string;
  readonly value: number;
}

interface IBarChartSlot {
  readonly x: number;
  readonly width: number;
  readonly center: number;
}

interface IBarChartDomain {
  readonly min: number;
  readonly max: number;
  readonly ticks: number[];
}

interface IBarChartBar {
  readonly x: number;
  readonly width: number;
  readonly top: number;
  readonly height: number;
}

interface IBarChartContext {
  readonly data: readonly IBarChartPoint[];
  readonly domain: IBarChartDomain;
  readonly slots: IBarChartSlot[];
  readonly width: number;
  readonly height: number;
  readonly plotLeft: number;
  readonly plotTop: number;
  readonly plotBottom: number;
  readonly plotWidth: number;
  readonly plotHeight: number;
  readonly bars: SharedValue<IBarChartBar[]>;
  readonly grow: SharedValue<number>;
  readonly isActive: SharedValue<number>;
  readonly selectedIndex: SharedValue<number>;
}

interface IBarChartRoot {
  children?: ReactNode;
  readonly data: readonly IBarChartPoint[];
  readonly maxY?: number;
  readonly tickCount?: number;
  readonly barRatio?: number;
  readonly leftInset?: number;
  readonly bottomInset?: number;
  readonly topInset?: number;
  readonly animate?: boolean;
  readonly growDuration?: number;
  readonly morphDuration?: number;
  readonly stagger?: number;
  readonly enablePan?: boolean;
  readonly onBarChange?: (point: IBarChartPoint, index: number) => void;
  readonly onGestureStart?: () => void;
  readonly onGestureEnd?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IBarChartBars {
  readonly color?: string;
  readonly gradientColors?: readonly string[];
  readonly radius?: number;
  readonly activeColor?: string;
}

interface IBarChartGrid {
  readonly color?: string;
  readonly thickness?: number;
}

interface IBarChartHighlight {
  readonly color?: string;
  readonly radius?: number;
  readonly inset?: number;
}

interface IBarChartYAxis {
  readonly format?: (value: number) => string;
  readonly style?: StyleProp<TextStyle>;
}

interface IBarChartXAxis {
  readonly format?: (point: IBarChartPoint, index: number) => string;
  readonly style?: StyleProp<TextStyle>;
  readonly activeStyle?: StyleProp<TextStyle>;
}

interface IBarChartTooltip {
  children?: ReactNode;
  readonly name?: string;
  readonly format?: (point: IBarChartPoint, index: number) => string;
  readonly swatchColor?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly nameStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

export type {
  IBarChartPoint,
  IBarChartSlot,
  IBarChartDomain,
  IBarChartBar,
  IBarChartContext,
  IBarChartRoot,
  IBarChartBars,
  IBarChartGrid,
  IBarChartHighlight,
  IBarChartYAxis,
  IBarChartXAxis,
  IBarChartTooltip,
};
