/**
 * Aurora Shader Component
 * Inspired by ReactBits
 * https://reactbits.dev/backgrounds/aurora
 */

import React, { memo } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  Fill,
  Skia,
  Shader,
  Uniforms,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
} from "react-native-reanimated";
import { SHADER_SOURCE } from "./conf";
import type { UnstableAuroraProps as AuroraProps } from "./types";
import { hexToRgb } from "./helper";

const source = Skia.RuntimeEffect.Make(SHADER_SOURCE);

export const UnstableAurora: React.FC<AuroraProps> &
  React.FunctionComponent<AuroraProps> = memo<AuroraProps>(
  ({
    colors = ["#5227FF", "#7cff67", "#5227FF"],
    speed = 1,
    blend = 0.5,
    direction = "bottom",
    amplitude = 1,
    style,
  }: AuroraProps): React.ReactNode & React.ReactElement => {
    const size = useSharedValue({ width: 0, height: 0 });
    const time = useSharedValue<number>(0);

    useFrameCallback(() => {
      time.value += 0.016 * speed;
    });

    const [c0r, c0g, c0b] = hexToRgb<(typeof colors)[0]>(colors[0]);
    const [c1r, c1g, c1b] = hexToRgb<(typeof colors)[1]>(colors[1]);
    const [c2r, c2g, c2b] = hexToRgb<(typeof colors)[2]>(colors[2]);

    const uniforms = useDerivedValue<Uniforms>(() => ({
      uTime: time.value,
      uAmplitude: amplitude,
      uColor0: [c0r, c0g, c0b],
      uColor1: [c1r, c1g, c1b],
      uColor2: [c2r, c2g, c2b],
      uResolution: [size.value.width, size.value.height],
      uBlend: blend,
      uDirection: direction === "top" ? -1.0 : 1.0,
    }));

    return (
      <Canvas style={[styles.canvas, style]} onSize={size}>
        <Fill>
          <Shader source={source!} uniforms={uniforms} />
        </Fill>
      </Canvas>
    );
  },
);

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});

export default memo<AuroraProps>(UnstableAurora);
