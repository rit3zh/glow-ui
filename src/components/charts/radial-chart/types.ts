import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

interface IRadialChartPoint {
  readonly label: string;
  readonly value: number;
  readonly max?: number;
  readonly color?: string;
}

interface IRadialChartRing {
  readonly value: number;
  readonly max: number;
  readonly fraction: number;
}

interface IRadialChartBand {
  readonly radius: number;
  readonly width: number;
}

type TRadialChartVariant = "circle" | "semicircle";

interface IRadialChartContext {
  readonly data: readonly IRadialChartPoint[];
  readonly rings: IRadialChartRing[];
  readonly variant: TRadialChartVariant;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  readonly barWidth: number;
  readonly gap: number;
  readonly bands: IRadialChartBand[];
  readonly startAngle: number;
  readonly sweepAngle: number;
  readonly bottomInset: number;
  readonly fractions: SharedValue<number[]>;
  readonly grow: SharedValue<number>;
  readonly isActive: SharedValue<number>;
  readonly selectedIndex: SharedValue<number>;
}

interface IRadialChartRoot {
  children?: ReactNode;
  readonly data: readonly IRadialChartPoint[];
  readonly variant?: TRadialChartVariant;
  readonly maxValue?: number;
  readonly radius?: number;
  readonly barWidth?: number;
  readonly gap?: number;
  readonly startAngle?: number;
  readonly sweepAngle?: number;
  readonly bottomInset?: number;
  readonly animate?: boolean;
  readonly growDuration?: number;
  readonly morphDuration?: number;
  readonly enableGesture?: boolean;
  readonly onRingChange?: (point: IRadialChartPoint, index: number) => void;
  readonly onGestureStart?: () => void;
  readonly onGestureEnd?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface IRadialChartTracks {
  readonly color?: string | readonly string[];
  readonly opacity?: number;
  readonly width?: number;
  readonly cap?: "round" | "butt" | "square";
}

interface IRadialChartBars {
  readonly colors?: readonly string[];
  readonly activeColor?: string;
  readonly inactiveOpacity?: number;
  readonly width?: number;
  readonly cap?: "round" | "butt" | "square";
}

interface IRadialChartLabel {
  children?: ReactNode;
  readonly format?: (point: IRadialChartPoint, index: number) => string;
  readonly formatValue?: (point: IRadialChartPoint, index: number) => string;
  readonly placeholder?: string;
  readonly placeholderValue?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

interface IRadialChartLegend {
  readonly colors?: readonly string[];
  readonly format?: (point: IRadialChartPoint, index: number) => string;
  readonly formatValue?: (point: IRadialChartPoint, index: number) => string;
  readonly direction?: "row" | "column";
  readonly style?: StyleProp<ViewStyle>;
  readonly itemStyle?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly activeLabelStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

interface IRadialChartTooltip {
  children?: ReactNode;
  readonly name?: string;
  readonly format?: (point: IRadialChartPoint, index: number) => string;
  readonly colors?: readonly string[];
  readonly style?: StyleProp<ViewStyle>;
  readonly labelStyle?: StyleProp<TextStyle>;
  readonly nameStyle?: StyleProp<TextStyle>;
  readonly valueStyle?: StyleProp<TextStyle>;
}

export type {
  IRadialChartPoint,
  IRadialChartRing,
  IRadialChartBand,
  TRadialChartVariant,
  IRadialChartContext,
  IRadialChartRoot,
  IRadialChartTracks,
  IRadialChartBars,
  IRadialChartLabel,
  IRadialChartLegend,
  IRadialChartTooltip,
};
