import React, { memo, useCallback, useMemo } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import {
  Canvas,
  Skia,
  Shader,
  Fill,
  vec,
  Uniforms,
} from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import type { ISiriIOS27 } from "./types";
import { SHADER_SOURCE } from "./conf";
import { DEFAULTS, DEFAULT_PERFORMANCE } from "./const";
import { useFrameTime } from "./useFrameTime";

const SIRI_IOS27_SHADER = Skia.RuntimeEffect.Make(SHADER_SOURCE)!;

const MAX_PALETTE = 8;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
      : h.padEnd(6, "0").slice(0, 6);
  const int = parseInt(full, 16);
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ];
};

const buildPalette = (
  colors?: readonly string[],
): { palette: number[]; paletteCount: number } => {
  const list = (colors ?? []).slice(0, MAX_PALETTE);
  const palette: number[] = [];
  for (let i = 0; i < MAX_PALETTE; i++) {
    const [r, g, b] = list[i] ? hexToRgb(list[i]) : [0, 0, 0];
    palette.push(r, g, b);
  }
  return { palette, paletteCount: list.length };
};

export const SiriIOS27: React.FC<ISiriIOS27> &
  React.FunctionComponent<ISiriIOS27> = memo<ISiriIOS27>(
  ({
    width: paramsWidth = DEFAULTS.width,
    height: paramsHeight = DEFAULTS.height,
    speed = DEFAULTS.speed,
    level = DEFAULTS.level,
    amplitude = DEFAULTS.amplitude,
    thickness = DEFAULTS.thickness,
    strandCount = DEFAULTS.strandCount,
    hueShift = DEFAULTS.hueShift,
    colors,
    exposure = DEFAULTS.exposure,
    animated = DEFAULTS.animated,
    performance,
    style,
  }) => {
    const scale =
      performance?.undersampling ?? DEFAULT_PERFORMANCE.undersampling;
    const fpsLock = performance?.fpsLock ?? DEFAULT_PERFORMANCE.fpsLock;

    const { palette, paletteCount } = useMemo(
      () => buildPalette(colors),
      [colors],
    );

    const width = useSharedValue<number>(paramsWidth < 1 ? 1 : paramsWidth);
    const height = useSharedValue<number>(paramsHeight < 1 ? 1 : paramsHeight);

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        const h = e.nativeEvent.layout.height;
        width.value = w < 1 ? 1 : w;
        height.value = h < 1 ? 1 : h;
      },
      [width, height],
    );

    const time = useFrameTime({ fpsLock, animated, speed });

    const uniforms = useDerivedValue<Uniforms>(() => ({
      iResolution: vec(width.value * scale, height.value * scale),
      iTime: time.value,
      level,
      amplitude,
      thickness,
      hueShift,
      exposure,
      strandCount,
      paletteCount,
      palette,
    }));

    const canvasWrapperStyle = useAnimatedStyle(() => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: Math.round(width.value * scale),
      height: Math.round(height.value * scale),
      transform: [{ scale: 1 / scale }],
      transformOrigin: "left top",
      zIndex: -9999,
    }));

    return (
      <View
        onLayout={onLayout}
        style={[
          styles.container,
          { width: paramsWidth, height: paramsHeight },
          style,
        ]}
      >
        <Animated.View style={canvasWrapperStyle}>
          <Canvas style={StyleSheet.absoluteFill}>
            <Fill>
              <Shader source={SIRI_IOS27_SHADER} uniforms={uniforms} />
            </Fill>
          </Canvas>
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});

export default SiriIOS27;
