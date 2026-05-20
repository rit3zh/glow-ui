import type { StyleProp, ViewStyle } from "react-native";

interface IColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

interface IUnstableSiriORB {
  /** Size of the orb in pixels */
  readonly size?: number;
  /** Animation speed multiplier (default: 1) */
  readonly speed?: number;
  /** Container style */
  readonly style?: StyleProp<ViewStyle>;
  /** Primary color for the orb gradient */
  readonly primaryColor?: IColor;
  /** Secondary color for the orb gradient */
  readonly secondaryColor?: IColor;
  /** Noise intensity (0-2, default: 1) */
  readonly noiseIntensity?: number;
  /** Glow intensity (0-3, default: 1.5) */
  readonly glowIntensity?: number;
  /** Color saturation multiplier (default: 2) */
  readonly saturation?: number;
  /** Brightness multiplier (default: 1) */
  readonly brightness?: number;
  /** Rotation speed multiplier (default: 1) */
  readonly rotationSpeed?: number;
  /** Noise scale - affects pattern size (default: 3) */
  readonly noiseScale?: number;
  /** Inner core intensity (0-1, default: 0.5) */
  readonly coreIntensity?: number;
  /** Edge softness (0-1, default: 0.04) */
  readonly edgeSoftness?: number;
  /** Whether animation is paused */
  readonly paused?: boolean;
}

export type { IUnstableSiriORB, IColor };
