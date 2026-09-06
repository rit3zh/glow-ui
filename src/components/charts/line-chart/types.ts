import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";

type TLineChartCurve = "linear" | "natural" | "step";
interface ILineChartPoint {
  readonly x: number;
  readonly y: number;
}
interface ILineChartVector {
  readonly x: number;
  readonly y: number;
}

interface ILineChartFrame {
  readonly points: ILineChartVector[];
  readonly tangents: number[];
}

interface ILineChartContext {
  readonly data: readonly ILineChartPoint[];
  readonly curve: TLineChartCurve;
  readonly width: number;
  readonly height: number;
  readonly horizontalPadding: number;
  readonly verticalPadding: number;
  readonly frame: SharedValue<ILineChartFrame>;
  readonly drawn: SharedValue<ILineChartFrame>;
  readonly draw: SharedValue<number>;
  readonly isActive: SharedValue<number>;
  readonly cursorX: SharedValue<number>;
  readonly cursorY: SharedValue<number>;
  readonly selectedIndex: SharedValue<number>;
}

interface ILineChartRoot {
  children?: ReactNode;
  readonly data: readonly ILineChartPoint[];
  readonly curve?: TLineChartCurve;
  readonly minY?: number;
  readonly maxY?: number;
  readonly horizontalPadding?: number;
  readonly verticalPadding?: number;
  readonly animate?: boolean;
  readonly drawDuration?: number;
  readonly morphDuration?: number;
  readonly enablePan?: boolean;
  readonly panDelay?: number;
  readonly onPointChange?: (point: ILineChartPoint, index: number) => void;
  readonly onGestureStart?: () => void;
  readonly onGestureEnd?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

interface ILineChartLine {
  readonly color?: string;
  readonly thickness?: number;
  readonly gradientColors?: readonly string[];
}

interface ILineChartArea {
  readonly colors?: readonly string[];
  readonly opacity?: number;
}

interface ILineChartGrid {
  readonly count?: number;
  readonly color?: string;
  readonly thickness?: number;
}

interface ILineChartIndicator {
  readonly color?: string;
  readonly radius?: number;
  readonly borderColor?: string;
  readonly pulsating?: boolean;
}

interface ILineChartCursor {
  readonly color?: string;
  readonly radius?: number;
  readonly borderColor?: string;
  readonly showCrosshair?: boolean;
  readonly crosshairColor?: string;
  readonly crosshairThickness?: number;
}

interface ILineChartTooltip {
  children?: ReactNode;
  readonly format?: (point: ILineChartPoint, index: number) => string;
  readonly style?: StyleProp<ViewStyle>;
  readonly textStyle?: StyleProp<TextStyle>;
}

export type {
  TLineChartCurve,
  ILineChartPoint,
  ILineChartVector,
  ILineChartFrame,
  ILineChartContext,
  ILineChartRoot,
  ILineChartLine,
  ILineChartArea,
  ILineChartGrid,
  ILineChartIndicator,
  ILineChartCursor,
  ILineChartTooltip,
};
