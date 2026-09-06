import type { DataSourceParam } from "@shopify/react-native-skia";
import type { StyleProp, ViewStyle } from "react-native";

interface ILiquidMetal {
  source?: DataSourceParam;

  width?: number;
  height?: number;

  lightColor?: string;
  darkColor?: string;

  /**
   * Controls the width/frequency of the liquid pattern.
   */
  patternScale?: number;

  /**
   * Controls RGB channel separation/refraction.
   */
  refraction?: number;

  /**
   * Controls edge influence.
   */
  edge?: number;

  /**
   * Softens the stripe transitions.
   */
  patternBlur?: number;

  /**
   * Controls the liquid edge distortion.
   */
  liquid?: number;

  /**
   * Animation speed.
   */
  speed?: number;

  /**
   * Radius used for edge detection.
   */
  edgeRadius?: number;

  /**
   * Rotates the liquid pattern in degrees.
   */
  rotation?: number;

  /**
   * Strength of animated noise distortion.
   */
  noiseStrength?: number;

  /**
   * Controls the frequency/scale of the noise.
   */
  noiseScale?: number;

  /**
   * Controls how pronounced the liquid bulge is.
   */
  bulgeStrength?: number;

  /**
   * Controls RGB stripe distortion.
   */
  stripeWarp?: number;

  /**
   * Controls how strongly the detected edge affects
   * the liquid effect.
   */
  edgeSoftness?: number;

  /**
   * Pauses the animation.
   */
  paused?: boolean;

  style?: StyleProp<ViewStyle>;
}

export type { ILiquidMetal };
