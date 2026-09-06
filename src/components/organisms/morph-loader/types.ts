import type { StyleProp, ViewStyle } from "react-native";
import type { EasingFunction } from "react-native-reanimated";

import type { Cubic } from "./cubic";
import type { RoundedPolygon } from "./polygon";
import type { ShapeName } from "./shape-registry";

interface Point {
  x: number;
  y: number;
}

interface CornerRounding {
  radius: number;
  smoothing: number;
}

type Feature =
  | { type: "edge"; cubics: Cubic[] }
  | { type: "corner"; cubics: Cubic[]; convex: boolean };

interface PointNRound {
  r: CornerRounding;
  x: number;
  y: number;
}

type ShapeFactory = () => RoundedPolygon;

interface Measurer {
  findCubicCutPoint(c: Cubic, m: number): number;
  measureCubic(c: Cubic): number;
}

interface ProgressableFeature {
  feature: Feature;
  progress: number;
}

interface MeasuredCubic {
  cubic: Cubic;
  endOutlineProgress: number;
  measuredSize: number;
  startOutlineProgress: number;
}

interface MeasuredPolygon {
  cubics: MeasuredCubic[];
  features: ProgressableFeature[];
  measurer: Measurer;
}

interface MorphFrames {
  readonly flat: number[];
  readonly frameCount: number;
}

interface IMorphingEasing {
  readonly emphasized: EasingFunction;
  readonly emphasizedDecelerate: EasingFunction;
  readonly emphasizedAccelerate: EasingFunction;
  readonly standard: EasingFunction;
}

interface IMorphLoader {
  readonly size?: number;
  readonly color?: string;
  readonly rotationDuration?: number;
  readonly morphDuration?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly shapes?: readonly ShapeName[];
  readonly easing?: EasingFunction;
}

export type {
  Point,
  CornerRounding,
  IMorphLoader,
  MorphFrames,
  MeasuredPolygon,
  ShapeFactory,
  PointNRound,
  Feature,
  MeasuredCubic,
  Measurer,
  ProgressableFeature,
  IMorphingEasing,
};
