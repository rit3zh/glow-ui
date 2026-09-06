import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface IPieChartPoint {
  readonly label: string;
  readonly value: number;
  readonly color?: string;
}

interface IPieChartSlice {
  readonly value: number;
  readonly fraction: number;
}

interface IPieChartArc {
  readonly start: number;
  readonly end: number;
  readonly mid: number;
}

interface IPieChartContext {
  readonly data: readonly IPieChartPoint[];
  readonly slices: IPieChartSlice[];
  readonly total: number;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly innerRadius: number;
  readonly activeOffset: number;
  readonly bottomInset: number;
  readonly arcs: SharedValue<IPieChartArc[]>;
  readonly grow: SharedValue<number>;
  readonly isActive: SharedValue<number>;
  readonly selectedIndex: SharedValue<number>;
}

interface IPieChartRoot {
  children?: ReactNode;
  readonly data: readonly IPieChartPoint[];
  readonly radius?: number;
  readonly innerRadius?: number;
  readonly startAngle?: number;
  readonly padAngle?: number;
  readonly bottomInset?: number;
  readonly activeOffset?: number;
  readonly animate?: boolean;
  readonly growDuration?: number;
  readonly morphDuration?: number;
  readonly enableGesture?: boolean;
  readonly onSliceChange?: (point: IPieChartPoint, index: number) => void;
  readonly onGestureStart?: () => void;
  readonly onGestureEnd?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IPieChartSlices {
  readonly colors?: readonly string[];
  readonly activeColor?: string;
  readonly inactiveOpacity?: number;
  readonly strokeColor?: string;
  readonly strokeWidth?: number;
}

interface IPieChartLabel {
  children?: ReactNode;
  readonly format?: (point: IPieChartPoint, index: number) => string;
  readonly formatValue?: (point: IPieChartPoint, index: number) => string;
  readonly placeholder?: string;
  readonly placeholderValue?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

interface IPieChartLegend {
  readonly colors?: readonly string[];
  readonly format?: (point: IPieChartPoint, index: number) => string;
  readonly direction?: "row" | "column";
  readonly style?: StyleProp<ViewStyle>;
  readonly itemStyle?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly activeLabelStyle?: StyleProp<TextStyle>;
}

interface IPieChartTooltip {
  children?: ReactNode;
  readonly name?: string;
  readonly format?: (point: IPieChartPoint, index: number) => string;
  readonly colors?: readonly string[];
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly nameStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

export type {
  IPieChartPoint,
  IPieChartSlice,
  IPieChartArc,
  IPieChartContext,
  IPieChartRoot,
  IPieChartSlices,
  IPieChartLabel,
  IPieChartLegend,
  IPieChartTooltip,
};
