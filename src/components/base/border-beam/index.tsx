import React, { memo, useMemo, useState } from "react";
import {
  Dimensions,
  ScaledSize,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from "react-native";
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  Uniforms,
  useClock,
} from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import { BORDER_BEAM_SHADER } from "./conf";
import { DEFAULT_COLORS } from "./const";
import { buildPalette } from "./utils";
import type { IBorderBeam } from "./types";

const effect = Skia.RuntimeEffect.Make(BORDER_BEAM_SHADER);

const BorderBeam: React.FC<IBorderBeam> & React.FunctionComponent<IBorderBeam> =
  memo<IBorderBeam>(
    ({
      children,
      borderRadius = 16,
      borderWidth = 1.5,
      glow = 18,
      duration = 5,
      beamLength = 0.36,
      colors = DEFAULT_COLORS,
      intensity = 1,
      ambient = 0.12,
      style,
    }: IBorderBeam): React.JSX.Element &
      React.ReactElement &
      React.ReactNode => {
      const [size, setSize] = useState<Pick<ScaledSize, "height" | "width">>({
        width: 0,
        height: 0,
      });
      const clock = useClock();

      const _PAD = glow * 2 + borderWidth + 2;
      const _SPEED = 1 / Math.max(duration, 0.1);
      const _ARC = Math.max(beamLength, 0.02) * 0.5;

      const palette = useMemo(() => buildPalette<string>(colors), [colors]);

      const onLayout = <T extends LayoutChangeEvent>(e: T) => {
        const { width, height } = e.nativeEvent.layout;
        setSize((prev) =>
          prev.width === width && prev.height === height
            ? prev
            : { width, height },
        );
      };

      const uniforms = useDerivedValue<Uniforms>(
        () => ({
          u_resolution: [size.width + _PAD * 2, size.height + _PAD * 2],
          u_size: [size.width, size.height],
          u_radius: borderRadius,
          u_border: borderWidth,
          u_glow: glow,
          u_time: clock.value / 1000,
          u_speed: _SPEED,
          u_arc: _ARC,
          u_intensity: intensity,
          u_ambient: ambient,
          u_count: palette.count,
          u_colors: palette.flat,
        }),
        [
          size,
          _PAD,
          borderRadius,
          borderWidth,
          glow,
          _SPEED,
          _ARC,
          intensity,
          ambient,
          palette,
        ],
      );

      return (
        <View style={style}>
          <View onLayout={onLayout}>{children}</View>

          {effect && size.width > 0 ? (
            <Canvas
              pointerEvents="none"
              style={[
                styles.canvas,
                { top: -_PAD, left: -_PAD, right: -_PAD, bottom: -_PAD },
              ]}
            >
              <Fill>
                <Shader source={effect} uniforms={uniforms} />
              </Fill>
            </Canvas>
          ) : null}
        </View>
      );
    },
  );

export { BorderBeam };
export default memo(BorderBeam);
export type { IBorderBeam } from "./types";

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
  },
});
