import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

import {
  AppState,
  StyleSheet,
  View,
  type AppStateStatus,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Canvas, Fill, Shader, Skia } from "@shopify/react-native-skia";

import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  type FrameInfo,
} from "react-native-reanimated";

import { MAX_STOPS, METAL_SHADER } from "./conf";

import { CONF, DEFAULT_COLORS } from "./const";

import { degreesToRadians, resolvePalette, resolveRadius } from "./helper";

import type { IMetal } from "./types";

const SHADER = Skia.RuntimeEffect.Make(METAL_SHADER)!;

export const Metal: React.FC<IMetal> & React.FunctionComponent<IMetal> =
  memo<IMetal>(
    ({
      children,

      colors = DEFAULT_COLORS,

      borderWidth = CONF.borderWidth,
      borderRadius,
      softness = CONF.softness,
      opacity = CONF.opacity,
      glow = CONF.glow,
      sheen = CONF.sheen,

      speed = CONF.speed,
      bands = CONF.bands,
      sharpness = CONF.sharpness,
      distortion = CONF.distortion,
      noiseScale = CONF.noiseScale,
      bevel = CONF.bevel,
      contrast = CONF.contrast,
      direction = CONF.direction,

      paused = false,
      style,
    }) => {
      const [measured, setMeasured] = useState<{
        width: number;
        height: number;
      }>({
        width: 0,
        height: 0,
      });

      const onLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;

        setMeasured((previous) =>
          previous.width === width && previous.height === height
            ? previous
            : {
                width,
                height,
              },
        );
      }, []);

      const time = useSharedValue<number>(0);

      const speedRef = useSharedValue<number>(speed);

      speedRef.value = speed;

      const [backgrounded, setBackgrounded] = useState<boolean>(false);

      useEffect(() => {
        const subscription = AppState.addEventListener(
          "change",
          (status: AppStateStatus) => {
            setBackgrounded(status !== "active");
          },
        );

        return () => subscription.remove();
      }, []);

      const running = !paused && !backgrounded;

      const frameCallback = useFrameCallback((frameInfo: FrameInfo) => {
        "worklet";

        if (frameInfo.timeSincePreviousFrame != null) {
          time.value +=
            (frameInfo.timeSincePreviousFrame / 1000) * speedRef.value;
        }
      }, false);

      useEffect(() => {
        frameCallback.setActive(running);
      }, [frameCallback, running]);

      const palette = useMemo(() => resolvePalette(colors), [colors]);

      const stops = useMemo(
        () => Math.min(Math.max(colors.length, 2), MAX_STOPS),
        [colors],
      );

      /**
       * The radius the child already rounds by, so wrapping a circle needs
       * no extra prop.
       */
      const childRadius = useMemo<StyleProp<ViewStyle>>(() => {
        const [child] = React.Children.toArray(children);

        return React.isValidElement<{ style?: StyleProp<ViewStyle> }>(child)
          ? child.props.style
          : undefined;
      }, [children]);

      const radius = useMemo(
        () =>
          resolveRadius(
            borderRadius,
            measured.width,
            measured.height,
            childRadius,
            style,
          ),
        [borderRadius, measured.width, measured.height, childRadius, style],
      );

      const bleed = useMemo(
        () => (glow > 0 ? Math.max(borderWidth * 4, 8) : 0),
        [glow, borderWidth],
      );

      const directionRadians = useMemo(
        () => degreesToRadians(direction),
        [direction],
      );

      const canvasWidth = measured.width + bleed * 2;
      const canvasHeight = measured.height + bleed * 2;

      const uniforms = useDerivedValue(() => {
        "worklet";

        return {
          u_resolution: [canvasWidth, canvasHeight] as [number, number],

          u_time: time.value,

          u_colors: palette,

          u_shape: [borderWidth, radius, softness, opacity] as [
            number,
            number,
            number,
            number,
          ],

          u_pattern: [stops, bands, sharpness, directionRadians] as [
            number,
            number,
            number,
            number,
          ],

          u_surface: [distortion, noiseScale, bevel, contrast] as [
            number,
            number,
            number,
            number,
          ],

          u_light: [sheen, glow, bleed] as [number, number, number],
        } as const;
      }, [
        canvasWidth,
        canvasHeight,
        palette,
        stops,
        borderWidth,
        radius,
        softness,
        opacity,
        bands,
        sharpness,
        directionRadians,
        distortion,
        noiseScale,
        bevel,
        contrast,
        sheen,
        glow,
        bleed,
      ]);

      return (
        <View style={style} onLayout={onLayout}>
          {children}

          {measured.width > 0 && measured.height > 0 ? (
            <View
              pointerEvents="none"
              style={[
                styles.overlay,
                {
                  top: -bleed,
                  left: -bleed,
                },
              ]}
            >
              <Canvas
                style={{
                  width: canvasWidth,
                  height: canvasHeight,
                }}
              >
                <Fill>
                  <Shader source={SHADER} uniforms={uniforms} />
                </Fill>
              </Canvas>
            </View>
          ) : null}
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
  },
});

export { METAL_COLORS } from "./const";

export default memo<React.FC<IMetal> & React.FunctionComponent<IMetal>>(Metal);
