import React, { memo, useEffect } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import {
  Canvas,
  Skia,
  Shader,
  Fill,
  vec,
  Uniforms,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import type { IUnstableSiriORB } from "./types";
import { SHADER_SOURCE } from "./conf";

const SIRI_ORB_SHADER = Skia.RuntimeEffect.Make(SHADER_SOURCE)!;

export const UnstableSiriOrb: React.FC<IUnstableSiriORB> &
  React.FunctionComponent<IUnstableSiriORB> = memo<IUnstableSiriORB>(
  ({
    size = 300,
    speed = 1,
    primaryColor = { r: 0.4, g: 0.6, b: 1.0 },
    secondaryColor = { r: 0.0, g: 0.8, b: 0.8 },
    noiseIntensity = 1,
    glowIntensity = 1.5,
    saturation = 2,
    brightness = 1,
    rotationSpeed = 1,
    noiseScale = 3,
    coreIntensity = 0.5,
    edgeSoftness = 0.04,
    paused = false,
    ...prop
  }) => {
    const time = useSharedValue<number>(0);

    useEffect(() => {
      if (paused) {
        cancelAnimation(time);
      } else {
        time.value = withRepeat<number>(
          withTiming<number>(100, {
            duration: 100000 / speed,
            easing: Easing.linear,
          }),
          -1,
          false,
        );
      }
      return () => cancelAnimation(time);
    }, [speed, paused]);

    const uniforms = useDerivedValue<Uniforms>(() => ({
      iResolution: vec(size, size),
      iTime: time.value,
      primaryColor: [primaryColor.r, primaryColor.g, primaryColor.b],
      secondaryColor: [secondaryColor.r, secondaryColor.g, secondaryColor.b],
      noiseIntensity,
      glowIntensity,
      saturation,
      brightness,
      rotationSpeed,
      noiseScale,
      coreIntensity,
      edgeSoftness,
    }));

    return (
      <View
        style={[styles.container, { width: size, height: size }, prop.style]}
      >
        <Canvas style={styles.canvas}>
          <Fill>
            <Shader source={SIRI_ORB_SHADER} uniforms={uniforms} />
          </Fill>
        </Canvas>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 1000,
  },
  canvas: {
    flex: 1,
  },
});

export default UnstableSiriOrb;
