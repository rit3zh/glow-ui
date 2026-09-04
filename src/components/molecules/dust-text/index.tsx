import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import {
  Atlas,
  Canvas,
  notifyChange,
  Skia,
  useFont,
  type SkRect,
  type SkRSXform,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  makeMutable,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  ATLAS_CELL,
  DEFAULT_COLORS,
  DEFAULT_DENSITY,
  DEFAULT_DRIFT,
  DEFAULT_DURATION,
  DEFAULT_FONT_SIZE,
  DEFAULT_MAX_PARTICLES,
  DEFAULT_PARTICLE_SIZE,
  DEFAULT_STAGGER,
  DEFAULT_TOUCH_FORCE,
  DEFAULT_TOUCH_RADIUS,
  DRIFT_SPEED,
  SPAWN_SCALE,
  START_DELAY_FRAMES,
  TOUCH_LERP,
} from "./const";
import { buildAtlas, deriveFont, sampleField } from "./helpers";
import type { IDustField, IDustText } from "./types";

const DustText: React.FC<IDustText> = ({
  children,
  colors = DEFAULT_COLORS,
  visible = true,
  duration = DEFAULT_DURATION,
  stagger = DEFAULT_STAGGER,
  particleSize = DEFAULT_PARTICLE_SIZE,
  density = DEFAULT_DENSITY,
  maxParticles = DEFAULT_MAX_PARTICLES,
  shape = "circle",
  drift = DEFAULT_DRIFT,
  interactive = true,
  touchRadius = DEFAULT_TOUCH_RADIUS,
  touchForce = DEFAULT_TOUCH_FORCE,
  fontSource,
  fontFamily,
  fontSize = DEFAULT_FONT_SIZE,
  fontWeight = "700",
  autoFit = true,
  paused = false,
  style,
}: IDustText): React.ReactElement => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [field, setField] = useState<IDustField | null>(null);

  const progress = useSharedValue(0);
  const clock = useSharedValue(0);
  const influence = useSharedValue(0);
  const rawX = useSharedValue(0);
  const rawY = useSharedValue(0);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);

  const fieldValue = useSharedValue<IDustField | null>(null);
  const revision = useSharedValue(0);
  const startFrame = useRef<number | null>(null);
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  const colorsKey = colors.join("|");
  const atlas = useMemo(() => buildAtlas(colors, shape), [colorsKey, shape]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setSize((prev) =>
      Math.round(prev.width) === Math.round(width) &&
      Math.round(prev.height) === Math.round(height)
        ? prev
        : { width, height },
    );
  }, []);

  const customFont = useFont(fontSource, fontSize);

  useEffect(() => {
    if (fontSource && !customFont) return;

    const font = deriveFont(customFont, fontFamily, fontSize, fontWeight);

    if (!font) return;

    const next = sampleField(
      children,
      font,
      size.width,
      size.height,
      density,
      maxParticles,
      autoFit,
    );

    progress.value = 0;
    fieldValue.value = next;
    revision.value += 1;
    setField(next);
  }, [
    children,
    size.width,
    size.height,
    density,
    maxParticles,
    autoFit,
    customFont,
    fontFamily,
    fontSize,
    fontWeight,
  ]);

  useEffect(() => {
    if (!field) return;

    let pending = START_DELAY_FRAMES;

    const step = () => {
      pending -= 1;

      if (pending > 0) {
        startFrame.current = requestAnimationFrame(step);
        return;
      }

      startFrame.current = null;
      progress.value = withTiming(visibleRef.current ? 1 : 0, {
        duration,
        easing: Easing.linear,
      });
    };

    startFrame.current = requestAnimationFrame(step);

    return () => {
      if (startFrame.current !== null) cancelAnimationFrame(startFrame.current);
      startFrame.current = null;
    };
  }, [field]);

  useEffect(() => {
    if (!field || startFrame.current !== null) return;

    progress.value = withTiming(visible ? 1 : 0, {
      duration,
      easing: Easing.linear,
    });
  }, [visible, duration]);

  const frame = useFrameCallback(({ timeSinceFirstFrame }) => {
    "worklet";

    if (influence.value > 0) {
      touchX.value += (rawX.value - touchX.value) * TOUCH_LERP;
      touchY.value += (rawY.value - touchY.value) * TOUCH_LERP;
    }

    if (drift <= 0 && influence.value <= 0) return;

    const p = progress.value;

    if (influence.value <= 0 && p > 0 && p < 1) return;

    clock.value = timeSinceFirstFrame;
  }, !paused);

  useEffect(() => {
    frame.setActive(!paused);
  }, [paused]);

  const count = field?.count ?? 0;

  const sprites = useMemo<SkRect[]>(() => {
    if (!field || !atlas) return [];

    return Array.from(
      { length: field.count },
      (_, index) =>
        atlas.rects[
          Math.min(
            atlas.rects.length - 1,
            Math.floor(field.seed[index]! * atlas.rects.length),
          )
        ]!,
    );
  }, [field, atlas]);

  const transforms = useMemo(
    () =>
      makeMutable(
        Array.from({ length: count }, () => Skia.RSXform(0, 0, 0, 0)),
      ),
    [count],
  );

  useAnimatedReaction(
    () => ({
      p: progress.value,
      c: clock.value,
      inf: influence.value,
      rev: revision.value,
    }),
    ({ p, c, inf }) => {
      "worklet";

      const data = fieldValue.value;
      const buffer = transforms.value as SkRSXform[];

      if (!data || buffer.length === 0) return;

      const { ox, oy, sx, sy, seed, phase } = data;
      const total = Math.min(buffer.length, data.count);

      const mx = touchX.value;
      const my = touchY.value;
      const time = c * DRIFT_SPEED;
      const radiusSq = touchRadius * touchRadius;
      const shimmer = drift > 0;
      const pushing = inf > 0;
      const spread = 1 + stagger;

      for (let i = 0; i < total; i++) {
        const raw = stagger > 0 ? p * spread - seed[i]! * stagger : p;
        const local = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        const t = local * local * local * (local * (local * 6 - 15) + 10);
        const spawnX = sx[i]!;
        const spawnY = sy[i]!;

        let x = spawnX + (ox[i]! - spawnX) * t;
        let y = spawnY + (oy[i]! - spawnY) * t;

        if (shimmer && t > 0.001) {
          const amount = drift * t * t * t;

          x += Math.sin(time + phase[i]!) * amount;
          y += Math.cos(time * 0.9 + phase[i]! * 1.7) * amount;
        }

        if (pushing) {
          const dx = x - mx;
          const dy = y - my;
          const distSq = dx * dx + dy * dy;

          if (distSq > 0.0001 && distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const push = ((touchRadius - dist) * inf * touchForce) / dist;

            x += dx * push;
            y += dy * push;
          }
        }

        const grow = t * (2 - t);
        const scale =
          (particleSize * (SPAWN_SCALE + (1 - SPAWN_SCALE) * grow)) /
          ATLAS_CELL;
        const half = (ATLAS_CELL * scale) / 2;

        buffer[i]!.set(scale, 0, x - half, y - half);
      }

      notifyChange(transforms);
    },
    [transforms, stagger, drift, particleSize, touchRadius, touchForce],
  );

  const opacity = useDerivedValue(() => {
    const p = progress.value;

    return p >= 1 ? 1 : 1 - (1 - p) * (1 - p);
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(interactive)
        .minDistance(0)
        .onBegin((event) => {
          rawX.value = event.x;
          rawY.value = event.y;
          touchX.value = event.x;
          touchY.value = event.y;
          influence.value = withTiming(1, { duration: 160 });
        })
        .onChange((event) => {
          rawX.value = event.x;
          rawY.value = event.y;
        })
        .onFinalize(() => {
          influence.value = withTiming(0, { duration: 360 });
        }),
    [interactive],
  );

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <Canvas style={StyleSheet.absoluteFill}>
          {atlas && count > 0 ? (
            <Atlas
              image={atlas.image}
              sprites={sprites}
              transforms={transforms}
              opacity={opacity}
            />
          ) : null}
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export { DustText };
export default memo(DustText);
export type { IDustText } from "./types";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 160,
  },
});
