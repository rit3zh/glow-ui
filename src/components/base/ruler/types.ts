import type { SharedValue } from "react-native-reanimated";

interface IRuler {
  height: number;
  width: number;
  minValue: number;
  maxValue: number;
  step: number;
  readonly onScroll?: (value: number) => void;
  readonly onValueChange?: (value: number) => void;
  readonly tickColor?: string;
  readonly activeTickColor?: string;
  readonly backgroundColor?: string;
  readonly notchHeight?: number;
  readonly notchWidth?: number;
  readonly enableHaptics?: boolean;
  readonly animateOnMount?: boolean;
}

interface ITick {
  index: number;
  tickX: number;
  xCenter: number;
  yCenter: number;
  translateX: SharedValue<number>;
  mountAnimation: SharedValue<number>;
  notchHeight: number;
  notchWidth: number;
  tickColor: string;
  activeTickColor: string;
  step: number;
}

export type { IRuler, ITick };
