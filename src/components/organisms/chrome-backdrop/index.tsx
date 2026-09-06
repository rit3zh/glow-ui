import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  type Uniforms,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

import { BACKDROP_VARIANTS, SHADER_SOURCE } from "./conf";
import { DEFAULTS, STATIC_TIME } from "./const";
import { colorToRGB } from "./helper";
import { useAppActive, useReduceMotion } from "./hooks";
import type { IChromeBackdrop, RGB } from "./types";

const shader = Skia.RuntimeEffect.Make(SHADER_SOURCE);

export const ChromeBackdrop: React.FC<IChromeBackdrop> &
  React.FunctionComponent<IChromeBackdrop> = memo(
  ({
    variant = DEFAULTS.VARIANT,
    accentColor = DEFAULTS.ACCENT,
    baseColor = DEFAULTS.BASE,
    baseOpacity = DEFAULTS.BASE_OPACITY,
    intensity = DEFAULTS.INTENSITY,
    grain = DEFAULTS.GRAIN,
    speed = DEFAULTS.SPEED,
    paused = false,
    width: widthProp,
    height = DEFAULTS.HEIGHT,
    borderRadius = DEFAULTS.BORDER_RADIUS,
    asChild = false,
    children,
    style,
  }: IChromeBackdrop) => {
    const [measured, setMeasured] = useState(0);
    const width = widthProp ?? measured;

    const reduceMotion = useReduceMotion();
    const appActive = useAppActive();

    const tick = useSharedValue<number>(0);

    const frame = useFrameCallback(({ timeSincePreviousFrame }) => {
      const dt =
        timeSincePreviousFrame != null ? timeSincePreviousFrame / 1000 : 0.016;
      tick.value += dt * speed;
    }, false);

    const running = width > 0 && appActive && !paused && !reduceMotion;
    useEffect(() => {
      frame.setActive(running);
      return () => frame.setActive(false);
    }, [frame, running]);

    useEffect(() => {
      if (reduceMotion) tick.value = STATIC_TIME;
    }, [reduceMotion, tick]);

    const accent = useMemo<RGB>(() => colorToRGB(accentColor), [accentColor]);
    const base = useMemo<RGB>(() => colorToRGB(baseColor), [baseColor]);
    const variantIndex =
      BACKDROP_VARIANTS[variant] ?? BACKDROP_VARIANTS[DEFAULTS.VARIANT];

    const uniforms = useDerivedValue<Uniforms>(
      () => ({
        uResolution: [width, height],
        uAspect: width / Math.max(1, height),
        uTime: tick.value,
        uVariant: variantIndex,
        uIntensity: Math.max(0, intensity),
        uGrain: Math.max(0, grain),
        uBaseOpacity: Math.max(0, Math.min(1, baseOpacity)),
        uAccent: accent,
        uBase: base,
      }),
      [
        width,
        height,
        variantIndex,
        intensity,
        grain,
        baseOpacity,
        accent,
        base,
      ],
    );

    const onLayout = useCallback((e: LayoutChangeEvent) => {
      const next = e.nativeEvent.layout.width;
      setMeasured((prev) => (prev === next ? prev : next));
    }, []);

    if (!shader) return null;

    const shaderContent: React.ReactNode & React.ReactElement = (
      <View style={StyleSheet.absoluteFill}>
        {width > 0 ? (
          <Canvas style={styles.canvas}>
            <Fill>
              <Shader source={shader} uniforms={uniforms} />
            </Fill>
          </Canvas>
        ) : null}
      </View>
    );

    const wrapperStyle = [
      styles.wrapper,
      { width: widthProp, height, borderRadius },
      style,
    ];

    if (asChild) {
      return (
        <View style={wrapperStyle} onLayout={onLayout}>
          {shaderContent}
          <View style={[styles.content, { borderRadius }]}>{children}</View>
        </View>
      );
    }

    return (
      <View style={wrapperStyle} onLayout={onLayout}>
        {shaderContent}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "transparent",
    alignSelf: "stretch",
  },
  canvas: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    overflow: "hidden",
  },
});

export type { IChromeBackdrop, BackdropVariant } from "./types";
export default memo<
  React.FC<IChromeBackdrop> & React.FunctionComponent<IChromeBackdrop>
>(ChromeBackdrop);
