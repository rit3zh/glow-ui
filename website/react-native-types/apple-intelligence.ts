import type { ReactNode } from "react";
import type { DerivedValue, SharedValue, FrameCallback } from "react-native-reanimated";

interface IAppleIntelligenceProvider {
  children: ReactNode;
  readonly introDuration?: number;
  readonly outroDuration?: number;
  readonly wave?: ISiriWaveConfig;
  readonly noise?: ISiriNoiseConfig;
  readonly glow?: ISiriGlowConfig;
  readonly shimmer?: ISiriShimmerConfig;
  readonly border?: ISiriBorderConfig;
}

interface ISiriWaveConfig {
  readonly speed?: number;
  readonly strength?: number;
  readonly origin?: [number, number];
}

interface ISiriNoiseConfig {
  readonly scale?: number;
  readonly speed?: number;
  readonly strength?: number;
}

interface ISiriGlowConfig {
  readonly speed?: number;
  readonly saturation?: number;
  readonly lightness?: number;
  readonly colors?: string[];
}

interface ISiriShimmerConfig {
  readonly amount?: number;
  readonly speed?: number;
}

interface ISiriBorderConfig {
  readonly margin?: number;
  readonly spread?: number;
  readonly radius?: number;
}

interface ISiriToggleOptions {
  readonly wave?: ISiriWaveConfig;
  readonly noise?: ISiriNoiseConfig;
  readonly glow?: ISiriGlowConfig;
  readonly shimmer?: ISiriShimmerConfig;
  readonly border?: ISiriBorderConfig;
}

interface ISiriContext {
  toggle: (options?: ISiriToggleOptions) => void;
  setOverlay: (content: ReactNode) => void;
  isActive: boolean;
}

type RGB = [number, number, number];

interface IMergedConfigs {
  wave: Required<ISiriWaveConfig>;
  noise: Required<ISiriNoiseConfig>;
  glow: Required<ISiriGlowConfig>;
  shimmer: Required<ISiriShimmerConfig>;
  border: Required<ISiriBorderConfig>;
}

interface IDefaultOverrides {
  wave?: ISiriWaveConfig;
  noise?: ISiriNoiseConfig;
  glow?: ISiriGlowConfig;
  shimmer?: ISiriShimmerConfig;
  border?: ISiriBorderConfig;
}

interface IShaderUniforms {
  [key: string]: number | readonly [number, number] | [number, number, number];
  iTime: number;
  intensity: number;
  iResolution: readonly [number, number];
  uMargin: number;
  uExcess: number;
  uRadius: number;
  uWaveSpeed: number;
  uWaveStrength: number;
  uWaveOrigin: readonly [number, number];
  uNoiseScale: number;
  uNoiseSpeed: number;
  uNoiseStrength: number;
  uGlowSpeed: number;
  uGlowSaturation: number;
  uGlowLightness: number;
  uShimmerAmount: number;
  uShimmerSpeed: number;
  uColorCount: number;
  uColor0: [number, number, number];
  uColor1: [number, number, number];
  uColor2: [number, number, number];
  uColor3: [number, number, number];
  uColor4: [number, number, number];
  uColor5: [number, number, number];
  uColor6: [number, number, number];
  uColor7: [number, number, number];
}

interface IUseSiriUniformsOptions {
  layout: { width: number; height: number };
  defaultWave?: ISiriWaveConfig;
  defaultNoise?: ISiriNoiseConfig;
  defaultGlow?: ISiriGlowConfig;
  defaultShimmer?: ISiriShimmerConfig;
  defaultBorder?: ISiriBorderConfig;
}

interface IUseSiriUniformsResult {
  iTime: SharedValue<number>;
  intensity: SharedValue<number>;
  uniforms: DerivedValue<IShaderUniforms>;
  applyConfig: (override?: ISiriToggleOptions) => void;
  frameCallback: FrameCallback;
}

export type {
  IAppleIntelligenceProvider,
  ISiriWaveConfig,
  ISiriNoiseConfig,
  ISiriGlowConfig,
  ISiriShimmerConfig,
  ISiriBorderConfig,
  ISiriToggleOptions,
  ISiriContext,
  IDefaultOverrides,
  IMergedConfigs,
  RGB,
  IUseSiriUniformsOptions,
  IUseSiriUniformsResult,
  IShaderUniforms,
};
