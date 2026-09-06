import type { StyleProp, ViewStyle } from "react-native";
import React from "react";

interface IRippleImage {
  width: number;
  height: number;
  source: string;
  readonly amplitude?: number;
  readonly frequency?: number;
  readonly decay?: number;
  readonly speed?: number;
  readonly duration?: number;
  readonly borderRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly fit?: "contain" | "cover" | "fill" | "none" | "scaleDown";
}

interface IRippleRect {
  width: number;
  height: number;
  color: string;
  readonly amplitude?: number;
  readonly frequency?: number;
  readonly decay?: number;
  readonly speed?: number;
  readonly duration?: number;
  readonly borderRadius?: number;
  readonly style?: ViewStyle;
  readonly children?: React.ReactNode;
}

interface IRippleSkiaEffect {
  width: number;
  height: number;
  /**
   * Any React Native view(s). They are snapshotted with `makeImageFromView`
   * and the ripple shader is applied to the captured image.
   */
  readonly children?: React.ReactNode;
  readonly amplitude?: number;
  readonly frequency?: number;
  readonly decay?: number;
  readonly speed?: number;
  readonly duration?: number;
  readonly borderRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export type { IRippleImage, IRippleRect, IRippleSkiaEffect };
