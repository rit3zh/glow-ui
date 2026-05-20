import React from "react";
import type { StyleProp, ViewStyle } from "react-native";

interface IMeshGradientColor {
  r: number;
  g: number;
  b: number;
}

interface IFrameBack {
  fpsLock: number;
  animated: boolean;
  speed: number;
}

interface IPerformance {
  undersampling?: number;
  fpsLock?: number;
}

interface IAnimatedMeshGradient {
  readonly performance?: IPerformance;
  readonly colors?: IMeshGradientColor[];
  readonly speed?: number;
  readonly noise?: number;
  readonly blur?: number;
  readonly contrast?: number;
  readonly animated?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly width?: number;
  readonly height?: number;
  readonly children?: React.ReactNode;
}

export type {
  IAnimatedMeshGradient,
  IMeshGradientColor,
  IPerformance,
  IFrameBack,
};
