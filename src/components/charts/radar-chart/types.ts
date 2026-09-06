import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface IRadarChartSeries {
  readonly name: string;
  readonly values: readonly number[];
  readonly color?: string;
}

interface IRadarChartDomain {
  readonly min: number;
  readonly max: number;
  readonly ticks: number[];
}

interface IRadarChartVertex {
  readonly x: number;
  readonly y: number;
}

interface IRadarChartContext {
  readonly data: readonly IRadarChartSeries[];
  readonly axes: readonly string[];
  readonly angles: number[];
  readonly domain: IRadarChartDomain;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly labelInset: number;
  readonly vertices: SharedValue<IRadarChartVertex[][]>;
  readonly grow: SharedValue<number>;
  readonly isActive: SharedValue<number>;
  readonly selectedIndex: SharedValue<number>;
}

interface IRadarChartRoot {
  children?: ReactNode;
  readonly data: readonly IRadarChartSeries[];
  readonly axes: readonly string[];
  readonly maxValue?: number;
  readonly levels?: number;
  readonly startAngle?: number;
  readonly radius?: number;
  readonly labelInset?: number;
  readonly animate?: boolean;
  readonly growDuration?: number;
  readonly morphDuration?: number;
  readonly stagger?: number;
  readonly enableGesture?: boolean;
  readonly onAxisChange?: (axis: string, index: number) => void;
  readonly onGestureStart?: () => void;
  readonly onGestureEnd?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IRadarChartGrid {
  readonly color?: string;
  readonly thickness?: number;
  readonly dash?: readonly number[];
}

interface IRadarChartAxes {
  readonly color?: string;
  readonly thickness?: number;
  readonly dash?: readonly number[];
}

interface IRadarChartShapes {
  readonly colors?: readonly string[];
  readonly thickness?: number;
  readonly fillOpacity?: number;
  readonly gradientFill?: boolean;
  readonly showDots?: boolean;
  readonly dotRadius?: number;
  readonly dotFillColor?: string;
  readonly activeDotRadius?: number;
}

interface IRadarChartLabels {
  readonly format?: (axis: string, index: number) => string;
  readonly style?: StyleProp<TextStyle>;
  readonly activeStyle?: StyleProp<TextStyle>;
}

interface IRadarChartTooltip {
  children?: ReactNode;
  readonly colors?: readonly string[];
  readonly format?: (
    series: IRadarChartSeries,
    value: number,
    index: number,
  ) => string;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly nameStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

export type {
  IRadarChartSeries,
  IRadarChartDomain,
  IRadarChartVertex,
  IRadarChartContext,
  IRadarChartRoot,
  IRadarChartGrid,
  IRadarChartAxes,
  IRadarChartShapes,
  IRadarChartLabels,
  IRadarChartTooltip,
};
