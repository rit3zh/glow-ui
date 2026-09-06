import React, { memo, useMemo, useState } from "react";
import {
  type ScaledSize,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type TextStyle,
} from "react-native";
import {
  Canvas,
  Fill,
  Shader,
  Skia,
  useClock,
  type Uniforms,
} from "@shopify/react-native-skia";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { GRADIENT_WAVE_SHADER } from "./conf";
import {
  DEFAULT_BAND_COUNT,
  DEFAULT_BAND_GAP,
  DEFAULT_BASE_COLOR,
  DEFAULT_COLORS,
  DEFAULT_SPEED,
  _CYCLE_SECONDS,
} from "./const";
import { buildStops } from "./utils";
import type { IGradientWaveText } from "./types";

const EFFECT = Skia.RuntimeEffect.Make(GRADIENT_WAVE_SHADER);

const GradientWaveText: React.FC<IGradientWaveText> &
  React.FunctionComponent<IGradientWaveText> = memo<IGradientWaveText>(
  ({
    children,
    colors = DEFAULT_COLORS,
    baseColor = DEFAULT_BASE_COLOR,
    radial = true,
    bandGap = DEFAULT_BAND_GAP,
    bandCount = DEFAULT_BAND_COUNT,
    speed = DEFAULT_SPEED,
    paused = false,
    textStyle,
    style,
  }: IGradientWaveText):
    | (React.JSX.Element & React.ReactNode & React.ReactElement)
    | null => {
    const [size, setSize] = useState<Pick<ScaledSize, "height" | "width">>({
      width: 0,
      height: 0,
    });
    const clock = useClock();
    const elapsed = useSharedValue(0);
    const lastClock = useSharedValue(0);

    const flatTextStyle = useMemo<TextStyle>(
      () => StyleSheet.flatten([styles.text, textStyle]) as TextStyle,
      [textStyle],
    );

    const stops = useMemo(
      () => buildStops(colors, baseColor, bandGap, bandCount),
      [colors, baseColor, bandGap, bandCount],
    );

    const windowTop = (bandCount + 2) * bandGap;
    const giStart = -windowTop;
    const giRange = 100 + windowTop * 2;

    const onLayout = (e: LayoutChangeEvent) => {
      const { width, height } = e.nativeEvent.layout;
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    };

    const uniforms = useDerivedValue<Uniforms>(() => {
      const now = clock.value;
      const dt = lastClock.value === 0 ? 0 : now - lastClock.value;
      lastClock.value = now;
      if (!paused) {
        elapsed.value += dt;
      }

      const phase = (elapsed.value / 1000) * (speed / _CYCLE_SECONDS);
      const frac = phase - Math.floor(phase);
      const gi = giStart + frac * giRange;
      return {
        u_resolution: [size.width, size.height],
        u_gi: gi,
        u_radial: radial ? 1 : 0,
        u_count: stops.count,
        u_pos: stops.positions,
        u_cols: stops.colors,
      };
    }, [size, paused, speed, radial, stops, giStart, giRange]);

    return (
      <View style={[styles.container, style]}>
        <Text
          style={[flatTextStyle, styles.hidden]}
          onLayout={onLayout}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {children}
        </Text>

        {EFFECT && size.width > 0 ? (
          <MaskedView
            style={[
              StyleSheet.absoluteFill,
              { width: size.width, height: size.height },
            ]}
            maskElement={<Text style={flatTextStyle}>{children}</Text>}
          >
            <Canvas style={{ width: size.width, height: size.height }}>
              <Fill>
                <Shader source={EFFECT} uniforms={uniforms} />
              </Fill>
            </Canvas>
          </MaskedView>
        ) : null}
      </View>
    );
  },
);

export { GradientWaveText };
export default memo(GradientWaveText);
export type { IGradientWaveText } from "./types";

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "700",
  },
  hidden: {
    opacity: 0,
  },
});
