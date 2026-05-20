import React, { memo, useMemo } from "react";
import { StyleSheet } from "react-native";
import {
  Canvas,
  Fill,
  Skia,
  Shader,
  type SkRuntimeEffect as RuntimeEffect,
  type Uniforms,
} from "@shopify/react-native-skia";
import {
  useSharedValue,
  useFrameCallback,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { hexToRgb } from "./helper";
import type { UnstableOrbProps } from "./types";
import { SHADER_SOURCE } from "./conf";

export const UnstableOrb: React.FC<UnstableOrbProps> &
  React.FunctionComponent<UnstableOrbProps> = memo<UnstableOrbProps>(
  ({
    colorShift = 0,
    intensity = 0.2,
    background = "#000000",
    colors = ["#9C43FE", "#4CC2E9", "#101499"],
    style = { width: 200, height: 200 },
  }: UnstableOrbProps): React.ReactNode & React.JSX.Element => {
    const size = useSharedValue({ width: 0, height: 0 });
    const time = useSharedValue<number>(0);
    const animatedIntensity = useSharedValue<number>(intensity);

    const shader: RuntimeEffect | null = useMemo(() => {
      const effect = Skia.RuntimeEffect.Make(SHADER_SOURCE);
      if (!effect) {
        console.error("[MetallicPaint] Failed to create runtime effect");
        return null;
      }
      return effect;
    }, []);

    useFrameCallback(() => {
      time.value += 0.016;
    });

    React.useEffect(() => {
      animatedIntensity.value = withTiming<number>(intensity, {
        duration: 400,
      });
    }, [intensity]);

    const [bgR, bgG, bgB] = hexToRgb<string>(background);
    const [orb1R, orb1G, orb1B] = hexToRgb<string>(colors[0]);
    const [orb2R, orb2G, orb2B] = hexToRgb<string>(colors[1]);
    const [orb3R, orb3G, orb3B] = hexToRgb<string>(colors[2]);

    const uniforms = useDerivedValue<Uniforms>(() => ({
      iTime: time.value,
      iResolution: [size.value.width, size.value.height],
      colorShift: colorShift,
      distortion: animatedIntensity.value,
      bgColor: [bgR, bgG, bgB],
      orbColor1: [orb1R, orb1G, orb1B],
      orbColor2: [orb2R, orb2G, orb2B],
      orbColor3: [orb3R, orb3G, orb3B],
    }));

    return (
      <Canvas style={[styles.canvas, style]} onSize={size}>
        <Fill>
          <Shader source={shader as RuntimeEffect} uniforms={uniforms} />
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

export default memo<UnstableOrbProps>(UnstableOrb);
