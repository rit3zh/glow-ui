import type { StyleProp, ViewStyle } from "react-native";

interface UnstableAuroraProps {
  readonly colors?: [string, string, string];
  readonly speed?: number;
  readonly amplitude?: number;
  readonly blend?: number;
  readonly direction?: "top" | "bottom";
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * @unstable
 */
interface UnstableIUniforms {
  readonly uTime: number;
  readonly uAmplitude: number;
  readonly uColor0: [number, number, number];
  readonly uColor1: [number, number, number];
  readonly uColor2: [number, number, number];
  readonly uResolution: [number, number];
  readonly uBlend: number;
  readonly uDirection: number;
}

export type { UnstableAuroraProps, UnstableIUniforms };
