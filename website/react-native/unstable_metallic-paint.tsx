/**
 * Metallic Paint Shader Component
 * Inspired by ReactBits
 * https://reactbits.dev/animations/metallic-paint
 */

import React, { memo, useMemo } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import {
  Canvas,
  Skia,
  Shader,
  Fill,
  ImageShader,
  useImage,
  type SkRuntimeEffect as RuntimeEffect,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";
import type { MetallicPaintProps } from "./types";
import { SHADER_SOURCE } from "./const";

const UnStableMetallicPaintComponent: React.FC<MetallicPaintProps> = ({
  unstable_uri: imageUri,
  size = 200,
  patternScale = 1.5,
  refraction = 0.025,
  edge = 1.5,
  patternBlur = 0.003,
  liquid = 0.12,
  speed = 0.5,
}) => {
  const image = useImage(imageUri);
  const time: SharedValue<number> = useSharedValue(0);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const width = size ?? windowWidth;
  const height = size ?? windowHeight;

  useFrameCallback(({ timeSincePreviousFrame }) => {
    if (timeSincePreviousFrame != null) {
      time.value += timeSincePreviousFrame * speed;
    }
  });

  const shader: RuntimeEffect | null = useMemo(() => {
    const effect = Skia.RuntimeEffect.Make(SHADER_SOURCE);
    if (!effect) {
      console.error("[MetallicPaint] Failed to create runtime effect");
      return null;
    }
    return effect;
  }, []);

  const uniforms = useDerivedValue(
    () => ({
      u_time: time.value,
      u_ratio: width / height,
      u_patternScale: patternScale,
      u_refraction: refraction,
      u_edge: edge,
      u_patternBlur: patternBlur,
      u_liquid: liquid,
      u_resolution: [width, height] as const,
    }),
    [width, height, patternScale, refraction, edge, patternBlur, liquid],
  );

  if (!shader || !image) return null;

  const containerStyle: ViewStyle | undefined = size
    ? { width: size, height: size }
    : undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      <Canvas style={styles.canvas}>
        <Fill>
          <Shader source={shader} uniforms={uniforms}>
            <ImageShader
              image={image}
              x={0}
              y={0}
              width={width}
              height={height}
              fit="contain"
            />
          </Shader>
        </Fill>
      </Canvas>
    </View>
  );
};

export const UnStableMetallicPaint = memo(UnStableMetallicPaintComponent);

const styles = StyleSheet.create({
  container: {},
  canvas: {
    flex: 1,
  },
});

export default memo(UnStableMetallicPaint);
