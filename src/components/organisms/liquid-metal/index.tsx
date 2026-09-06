import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

import {
  AppState,
  StyleSheet,
  useWindowDimensions,
  View,
  type AppStateStatus,
  type LayoutChangeEvent,
} from "react-native";

import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  SkImage,
  useImage,
} from "@shopify/react-native-skia";

import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  type FrameInfo,
} from "react-native-reanimated";

import { LIQUID_METAL_SHADER } from "./conf";

import { DEFAULT_DARK_COLOR, DEFAULT_LIGHT_COLOR, CONF } from "./const";

import { degreesToRadians, emptyImage, fitRect, hexToRgb } from "./helper";

import type { ILiquidMetal } from "./types";

const SHADER = Skia.RuntimeEffect.Make(LIQUID_METAL_SHADER)!;

export const LiquidMetal: React.FC<ILiquidMetal> &
  React.FunctionComponent<ILiquidMetal> = memo<ILiquidMetal>(
  ({
    source,

    width: paramsWidth,
    height: paramsHeight,

    lightColor = DEFAULT_LIGHT_COLOR,
    darkColor = DEFAULT_DARK_COLOR,

    patternScale = CONF.patternScale,
    refraction = CONF.refraction,
    edge = CONF.edge,
    patternBlur = CONF.patternBlur,

    liquid = CONF.liquid,
    speed = CONF.speed,
    edgeRadius = CONF.edgeRadius,

    rotation = CONF.rotation,
    noiseStrength = CONF.noiseStrength,
    noiseScale = CONF.noiseScale,
    bulgeStrength = CONF.bulgeStrength,
    stripeWarp = CONF.stripeWarp,
    edgeSoftness = CONF.edgeSoftness,

    paused = false,
    style,
  }) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const loaded = useImage(source ?? null);
    const fallback = useMemo<SkImage>(() => emptyImage(), []);
    const image = loaded ?? fallback;
    const hasMask = loaded != null;
    const awaitingMask = source != null && !hasMask;

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

    const width = paramsWidth ?? (measured.width || screenWidth);

    const height = paramsHeight ?? (measured.height || screenHeight);

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

    const running = !paused && !backgrounded && !awaitingMask;

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

    const light = useMemo(() => hexToRgb<string>(lightColor), [lightColor]);
    const dark = useMemo(() => hexToRgb<string>(darkColor), [darkColor]);

    const rect = useMemo(
      () => fitRect(loaded, width, height),
      [loaded, width, height],
    );
    const rotationRadians = useMemo(
      () => degreesToRadians(rotation),
      [rotation],
    );

    const uniforms = useDerivedValue(() => {
      "worklet";

      return {
        u_scene: [width, height, time.value, width / Math.max(height, 1)] as [
          number,
          number,
          number,
          number,
        ],

        u_params: [patternScale, refraction, edge, patternBlur] as [
          number,
          number,
          number,
          number,
        ],

        u_extra: [liquid, edgeRadius, hasMask ? 1 : 0, rotationRadians] as [
          number,
          number,
          number,
          number,
        ],

        u_rect: [rect.x, rect.y, rect.width, rect.height] as [
          number,
          number,
          number,
          number,
        ],

        u_tuning: [noiseScale, bulgeStrength, edgeSoftness, stripeWarp] as [
          number,
          number,
          number,
          number,
        ],

        u_noiseStrength: noiseStrength,

        u_lightColor: light as [number, number, number],

        u_darkColor: dark as [number, number, number],
      } as const;
    }, [
      width,
      height,
      patternScale,
      refraction,
      edge,
      patternBlur,
      liquid,
      edgeRadius,
      hasMask,
      rotationRadians,
      noiseScale,
      noiseStrength,
      bulgeStrength,
      stripeWarp,
      edgeSoftness,
      rect,
      light,
      dark,
    ]);

    if (width <= 0 || height <= 0 || awaitingMask) {
      return <View style={[styles.container, style]} onLayout={onLayout} />;
    }

    return (
      <View style={[styles.container, style]} onLayout={onLayout}>
        <Canvas
          style={{
            width,
            height,
          }}
        >
          <Fill>
            <Shader source={SHADER} uniforms={uniforms}>
              <ImageShader
                image={image}
                rect={rect}
                fit="contain"
                tx="decal"
                ty="decal"
              />
            </Shader>
          </Fill>
        </Canvas>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});

export default memo<
  React.FC<ILiquidMetal> & React.FunctionComponent<ILiquidMetal>
>(LiquidMetal);
