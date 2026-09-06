import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

/**
 * A palette entry. Either a hex string, or a hex string paired with an
 * alpha so a stop can fade the border out.
 */
type MetalStop = string | { color: string; alpha: number };

interface IMetal {
  children?: ReactNode;

  /**
   * Palette swept around the border. Two to eight stops, mirrored by the
   * shader so the first and last stop meet.
   */
  colors?: readonly MetalStop[];

  /**
   * Thickness of the border in pixels.
   */
  borderWidth?: number;

  /**
   * Corner radius of the border. Falls back to the radius on the wrapped
   * child, then to the radius on `style`. Values past half the shortest
   * side clamp to a full circle or pill.
   */
  borderRadius?: number;

  /**
   * Edge feathering of the border in pixels.
   */
  softness?: number;

  /**
   * Overall border opacity.
   */
  opacity?: number;

  /**
   * Outward bloom around the border, 0 disables it.
   */
  glow?: number;

  /**
   * Strength of the specular highlight that orbits the border.
   */
  sheen?: number;

  /**
   * Animation speed.
   */
  speed?: number;

  /**
   * How many times the palette repeats around the border.
   */
  bands?: number;

  /**
   * Transition hardness between stops. 1 is a smooth gradient, higher
   * values give crisp chrome banding.
   */
  sharpness?: number;

  /**
   * Strength of the noise warp applied to the bands.
   */
  distortion?: number;

  /**
   * Frequency of the noise warp, smaller values give broader reflections.
   */
  noiseScale?: number;

  /**
   * Cross section shading, 0 is a flat line and 1 a rounded wire.
   */
  bevel?: number;

  /**
   * Gamma applied to the final colour. Above 1 deepens the darks.
   */
  contrast?: number;

  /**
   * Rotates the pattern around the border in degrees.
   */
  direction?: number;

  /**
   * Pauses the animation.
   */
  paused?: boolean;

  style?: StyleProp<ViewStyle>;
}

export type { IMetal, MetalStop };
