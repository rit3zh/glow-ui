// @ts-check
import React, { ComponentProps, memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  Canvas,
  Group,
  Path,
  Skia,
  type SkPath,
} from "@shopify/react-native-skia";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import {
  DEFAULT_FLAT,
  MotionEasing,
  POINT_PAIRS,
  buildFlatShapes,
  cubicBezier,
  defaultShapes,
} from "./helper";
import type { IMorphLoader } from "./types";
import { DEG_TO_RAD, SQRT2, VIEWBOX } from "./config";

export const MorphLoader: React.FC<IMorphLoader> &
  React.FunctionComponent<IMorphLoader> = memo<IMorphLoader>(
  ({
    size = 60,
    color = "#6750A4",
    rotationDuration = 5000,
    morphDuration = 700,
    style,
    shapes,
    easing,
  }: IMorphLoader & ComponentProps<typeof MorphLoader>): React.ReactNode &
    React.JSX.Element &
    React.ReactElement => {
    const rotation = useSharedValue<number>(0);
    const morph = useSharedValue<number>(0);

    const flat = useMemo(
      () => (shapes ? buildFlatShapes<string>(shapes) : DEFAULT_FLAT),
      [shapes],
    );
    const shapeCount = (shapes ?? defaultShapes).length;
    const easingFn = easing ?? MotionEasing.emphasized;

    const innerSize = size;
    const canvasSize = innerSize * SQRT2;
    const scale = innerSize / VIEWBOX;
    const offset = (canvasSize - innerSize) / 2;
    const containerPad = (canvasSize - size) / 2;

    const origin = useMemo(
      () => ({ x: canvasSize / 2, y: canvasSize / 2 }),
      [canvasSize],
    );

    const rotPerMs = 360 / rotationDuration;
    const morphPerMs = 1 / morphDuration;

    useFrameCallback((info) => {
      const dt = info.timeSincePreviousFrame ?? 16.6667;
      rotation.value = (rotation.value + dt * rotPerMs) % 360;
      morph.value = (morph.value + dt * morphPerMs) % shapeCount;
    });

    const path = useDerivedValue<SkPath>(() => {
      const v = morph.value;
      const i = Math.floor(v);
      const raw = v - i;
      const t = easingFn(raw);
      const baseA = i * POINT_PAIRS * 2;
      const baseB = ((i + 1) % shapeCount) * POINT_PAIRS * 2;

      const p = Skia.Path.Make();
      for (let k = 0; k < POINT_PAIRS; k++) {
        const ix = k * 2;
        const iy = ix + 1;
        const ax = flat[baseA + ix];
        const ay = flat[baseA + iy];
        const bx = flat[baseB + ix];
        const by = flat[baseB + iy];
        const x = (ax + (bx - ax) * t) * scale + offset;
        const y = (ay + (by - ay) * t) * scale + offset;
        if (k === 0) p.moveTo(x, y);
        else p.lineTo(x, y);
      }
      p.close();
      return p;
    });

    const transform = useDerivedValue(() => [
      { rotate: rotation.value * DEG_TO_RAD },
    ]);

    return (
      <View style={[styles.center, { width: size, height: size }, style]}>
        <Canvas
          style={{
            width: canvasSize,
            height: canvasSize,
            position: "absolute",
            left: -containerPad,
            top: -containerPad,
          }}
        >
          <Group origin={origin} transform={transform}>
            <Path path={path} color={color} />
          </Group>
        </Canvas>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export { MotionEasing, cubicBezier, defaultShapes };
export { SHAPES } from "./config";
export default MorphLoader;
export type { IMorphLoader };
