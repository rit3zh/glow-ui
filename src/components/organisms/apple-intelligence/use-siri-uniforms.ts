import { useCallback } from "react";
import { useSharedValue, useDerivedValue, useFrameCallback } from "react-native-reanimated";
import type {
  ISiriToggleOptions,
  IUseSiriUniformsOptions,
  IUseSiriUniformsResult,
  IShaderUniforms,
} from "./types";
import {
  DEFAULT_BORDER,
  DEFAULT_GLOW,
  DEFAULT_NOISE,
  DEFAULT_SHIMMER,
  DEFAULT_WAVE,
  MAX_COLORS,
  ZERO3,
} from "./const";
import { hexToRgb, mergeConfig } from "./helpers";

function useSiriUniforms<T extends IUseSiriUniformsOptions>({
  layout,
  defaultWave,
  defaultNoise,
  defaultGlow,
  defaultShimmer,
  defaultBorder,
}: T): IUseSiriUniformsResult {
  const iTime = useSharedValue<number>(0);
  const intensity = useSharedValue<number>(0);

  const frameCallback = useFrameCallback((frameInfo) => {
    iTime.value = frameInfo.timeSinceFirstFrame / 1000;
  }, false);

  const uMargin = useSharedValue<number>(DEFAULT_BORDER.margin);
  const uExcess = useSharedValue<number>(DEFAULT_BORDER.spread);
  const uRadius = useSharedValue<number>(DEFAULT_BORDER.radius);

  const uWaveSpeed = useSharedValue<number>(DEFAULT_WAVE.speed);
  const uWaveStrength = useSharedValue<number>(DEFAULT_WAVE.strength);
  const uWaveOriginX = useSharedValue<number>(DEFAULT_WAVE.origin[0]);
  const uWaveOriginY = useSharedValue<number>(DEFAULT_WAVE.origin[1]);

  const uNoiseScale = useSharedValue<number>(DEFAULT_NOISE.scale);
  const uNoiseSpeed = useSharedValue<number>(DEFAULT_NOISE.speed);
  const uNoiseStrength = useSharedValue<number>(DEFAULT_NOISE.strength);

  const uGlowSpeed = useSharedValue<number>(DEFAULT_GLOW.speed);
  const uGlowSaturation = useSharedValue<number>(DEFAULT_GLOW.saturation);
  const uGlowLightness = useSharedValue<number>(DEFAULT_GLOW.lightness);

  const uShimmerAmount = useSharedValue<number>(DEFAULT_SHIMMER.amount);
  const uShimmerSpeed = useSharedValue<number>(DEFAULT_SHIMMER.speed);

  const uColorCount = useSharedValue<number>(0);
  const uColor0 = useSharedValue<[number, number, number]>(ZERO3);
  const uColor1 = useSharedValue<[number, number, number]>(ZERO3);
  const uColor2 = useSharedValue<[number, number, number]>(ZERO3);
  const uColor3 = useSharedValue<[number, number, number]>(ZERO3);
  const uColor4 = useSharedValue<[number, number, number]>(ZERO3);
  const uColor5 = useSharedValue<[number, number, number]>(ZERO3);
  const uColor6 = useSharedValue<[number, number, number]>(ZERO3);
  const uColor7 = useSharedValue<[number, number, number]>(ZERO3);

  const uniforms = useDerivedValue<IShaderUniforms>(() => ({
    iTime: iTime.value,
    intensity: intensity.value,
    iResolution: [layout.width, layout.height] as const,
    uMargin: uMargin.value,
    uExcess: uExcess.value,
    uRadius: uRadius.value,
    uWaveSpeed: uWaveSpeed.value,
    uWaveStrength: uWaveStrength.value,
    uWaveOrigin: [uWaveOriginX.value, uWaveOriginY.value] as const,
    uNoiseScale: uNoiseScale.value,
    uNoiseSpeed: uNoiseSpeed.value,
    uNoiseStrength: uNoiseStrength.value,
    uGlowSpeed: uGlowSpeed.value,
    uGlowSaturation: uGlowSaturation.value,
    uGlowLightness: uGlowLightness.value,
    uShimmerAmount: uShimmerAmount.value,
    uShimmerSpeed: uShimmerSpeed.value,
    uColorCount: uColorCount.value,
    uColor0: uColor0.value,
    uColor1: uColor1.value,
    uColor2: uColor2.value,
    uColor3: uColor3.value,
    uColor4: uColor4.value,
    uColor5: uColor5.value,
    uColor6: uColor6.value,
    uColor7: uColor7.value,
  }));

  const applyConfig = useCallback(
    (override?: ISiriToggleOptions) => {
      const { wave, noise, glow, shimmer, border } = mergeConfig(
        {
          wave: defaultWave,
          noise: defaultNoise,
          glow: defaultGlow,
          shimmer: defaultShimmer,
          border: defaultBorder,
        },
        override,
      );

      uMargin.value = border.margin;
      uExcess.value = border.spread;
      uRadius.value = border.radius;

      uWaveSpeed.value = wave.speed;
      uWaveStrength.value = wave.strength;
      uWaveOriginX.value = wave.origin[0];
      uWaveOriginY.value = wave.origin[1];

      uNoiseScale.value = noise.scale;
      uNoiseSpeed.value = noise.speed;
      uNoiseStrength.value = noise.strength;

      uGlowSpeed.value = glow.speed;
      uGlowSaturation.value = glow.saturation;
      uGlowLightness.value = glow.lightness;

      uShimmerAmount.value = shimmer.amount;
      uShimmerSpeed.value = shimmer.speed;

      const colorSlots = [
        uColor0,
        uColor1,
        uColor2,
        uColor3,
        uColor4,
        uColor5,
        uColor6,
        uColor7,
      ];
      const colors =
        glow.colors && glow.colors.length > 0
          ? glow.colors.slice(0, MAX_COLORS)
          : [];
      uColorCount.value = colors.length;
      for (let i = 0; i < MAX_COLORS; i++) {
        colorSlots[i].value =
          i < colors.length ? hexToRgb<string>(colors[i]) : ZERO3;
      }
    },
    [
      defaultWave,
      defaultNoise,
      defaultGlow,
      defaultShimmer,
      defaultBorder,
      uMargin,
      uExcess,
      uRadius,
      uWaveSpeed,
      uWaveStrength,
      uWaveOriginX,
      uWaveOriginY,
      uNoiseScale,
      uNoiseSpeed,
      uNoiseStrength,
      uGlowSpeed,
      uGlowSaturation,
      uGlowLightness,
      uShimmerAmount,
      uShimmerSpeed,
      uColorCount,
      uColor0,
      uColor1,
      uColor2,
      uColor3,
      uColor4,
      uColor5,
      uColor6,
      uColor7,
    ],
  );

  return { iTime, intensity, uniforms, applyConfig, frameCallback };
}
export { useSiriUniforms };
