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
  runOnUI,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  COVERAGE,
  HOLD_MS,
  LETTER_ADVANCE,
  LETTER_SIZE,
  LIFT,
  MAX_LETTERS,
  POINTER_EASE,
  REACH,
  REPEL,
  REVEAL_MS,
  SEED,
  SWARM_CHARSET,
  SWARM_PALETTE,
  SWAY,
  SWAY_SPEED,
  TRACKING,
  TRAVEL_MS,
  WARMUP_FRAMES,
} from "./const";
import {
  buildCloud,
  buildLetterAtlas,
  seededRandom,
  sizeTypeface,
} from "./helpers";
import { SWARM_FORMS } from "./forms";
import type { ILetterSwarm, ISwarmCloud, TSwarmForm } from "./types";

const LetterSwarm: React.FC<ILetterSwarm> = ({
  forms,
  active,
  cycle = false,
  hold = HOLD_MS,
  travel = TRAVEL_MS,
  tapToMorph = true,
  charset = SWARM_CHARSET,
  palette = SWARM_PALETTE,
  typeface,
  family,
  letterSize = LETTER_SIZE,
  weight = "600",
  coverage = COVERAGE,
  tracking = TRACKING,
  maxLetters = MAX_LETTERS,
  sway = SWAY,
  lift = LIFT,
  interactive = true,
  reach = REACH,
  repel = REPEL,
  paused = false,
  seed = SEED,
  onActiveChange,
  style,
}: ILetterSwarm): React.ReactElement => {
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [cloud, setCloud] = useState<ISwarmCloud | null>(null);
  const [own, setOwn] = useState(0);

  const choices = forms.length;
  const driven = active !== undefined;
  const showing =
    choices === 0
      ? 0
      : (((driven ? active! : own) % choices) + choices) % choices;

  const journey = useSharedValue(1);
  const arriving = useSharedValue(showing);
  const curve = useSharedValue(0);
  const beat = useSharedValue(0);
  const reveal = useSharedValue(0);
  const grip = useSharedValue(0);
  const pointerX = useSharedValue(0);
  const pointerY = useSharedValue(0);
  const easedX = useSharedValue(0);
  const easedY = useSharedValue(0);

  const cloudValue = useSharedValue<ISwarmCloud | null>(null);
  const revision = useSharedValue(0);
  const warmup = useRef<number | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setBox((previous) =>
      Math.round(previous.width) === Math.round(width) &&
      Math.round(previous.height) === Math.round(height)
        ? previous
        : { width, height },
    );
  }, []);

  const loaded = useFont(typeface, letterSize);
  const paletteKey = palette.join("|");

  const font = useMemo(
    () => sizeTypeface(loaded, family, letterSize, weight),
    [loaded, family, letterSize, weight],
  );

  const atlas = useMemo(
    () => (font ? buildLetterAtlas(charset, palette, font) : null),
    [font, charset, paletteKey],
  );

  const shortest = Math.min(box.width, box.height);
  const span = shortest * coverage;
  const stride = span > 0 ? (letterSize * LETTER_ADVANCE * tracking) / span : 0;

  const formsKey = useMemo(
    () =>
      forms
        .map((form: TSwarmForm) =>
          typeof form === "string"
            ? form
            : String(
                Array.isArray(form.outline)
                  ? form.outline.join("~")
                  : form.outline,
              ),
        )
        .join("|"),
    [forms],
  );

  useEffect(() => {
    if (!atlas || stride <= 0) return;

    const next = buildCloud(
      forms,
      stride,
      maxLetters,
      atlas.rects.length,
      seededRandom(seed),
    );

    cloudValue.value = next;
    revision.value += 1;
    journey.value = 1;
    curve.value = 0;
    setCloud(next);
  }, [formsKey, stride, maxLetters, atlas, seed]);

  useEffect(() => {
    if (!cloud) return;

    let pending = WARMUP_FRAMES;

    const tick = () => {
      pending -= 1;

      if (pending > 0) {
        warmup.current = requestAnimationFrame(tick);
        return;
      }

      warmup.current = null;
      reveal.value = withTiming(1, { duration: REVEAL_MS });
    };

    warmup.current = requestAnimationFrame(tick);

    return () => {
      if (warmup.current !== null) cancelAnimationFrame(warmup.current);
      warmup.current = null;
    };
  }, [cloud]);

  useEffect(() => {
    if (arriving.value === showing) return;

    runOnUI((next: number, duration: number) => {
      "worklet";

      const data = cloudValue.value;
      const flight = journey.value;

      if (data) {
        data.startX.set(data.nowX);
        data.startY.set(data.nowY);
      }

      const clamped = flight < 0 ? 0 : flight > 1 ? 1 : flight;

      curve.value = 4 * clamped * (1 - clamped);
      arriving.value = next;
      journey.value = 0;
      journey.value = withTiming(1, { duration, easing: Easing.linear });
    })(showing, travel);
  }, [showing, travel]);

  const advance = useCallback(
    (by: number) => {
      if (choices <= 1) return;

      const next = (showing + by + choices) % choices;

      if (!driven) setOwn(next);

      onActiveChange?.(next);
    },
    [choices, driven, onActiveChange, showing],
  );

  useEffect(() => {
    if (!cycle || paused || choices <= 1) return;

    const timer = setInterval(() => advance(1), Math.max(travel, hold));

    return () => clearInterval(timer);
  }, [cycle, paused, choices, hold, travel, advance]);

  const frame = useFrameCallback(({ timeSinceFirstFrame }) => {
    "worklet";

    if (grip.value > 0) {
      easedX.value += (pointerX.value - easedX.value) * POINTER_EASE;
      easedY.value += (pointerY.value - easedY.value) * POINTER_EASE;
    }

    if (sway <= 0 && grip.value <= 0) return;

    beat.value = timeSinceFirstFrame;
  }, !paused);

  useEffect(() => {
    frame.setActive(!paused);
  }, [paused]);

  const letters = cloud?.letters ?? 0;

  const sprites = useMemo<SkRect[]>(() => {
    if (!cloud || !atlas) return [];

    return Array.from(
      { length: cloud.letters },
      (_, at) =>
        atlas.rects[Math.min(atlas.rects.length - 1, cloud.tile[at]!)]!,
    );
  }, [cloud, atlas]);

  const placements = useMemo(
    () =>
      makeMutable(
        Array.from({ length: letters }, () => Skia.RSXform(0, 0, 0, 0)),
      ),
    [letters],
  );

  const tile = atlas?.tile ?? 1;
  const midX = box.width / 2;
  const midY = box.height / 2;

  useAnimatedReaction(
    () => ({
      t: journey.value,
      to: arriving.value,
      clock: beat.value,
      held: grip.value,
      rev: revision.value,
    }),
    ({ t, to, clock, held }) => {
      "worklet";

      const data = cloudValue.value;
      const buffer = placements.value as SkRSXform[];

      if (!data || buffer.length === 0 || span <= 0) return;

      const total = Math.min(buffer.length, data.letters);
      const last = data.forms - 1;
      const b = (to < 0 ? 0 : to > last ? last : to) * data.letters;

      const gentle = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const carried = 1 - Math.pow(1 - t, 3);
      const eased = gentle + (carried - gentle) * curve.value;

      const midair = 4 * eased * (1 - eased);
      const time = clock * SWAY_SPEED;
      const wobble = shortest * 0.0035 * sway;

      const rise = (midair * shortest * 0.05 * lift) / span;
      const reachSq = reach * reach;
      const pushing = held > 0;
      const px = easedX.value;
      const py = easedY.value;

      for (let i = 0; i < total; i++) {
        const fromX = data.startX[i]!;
        const fromY = data.startY[i]!;

        let placedX = fromX + (data.x[b + i]! - fromX) * eased;
        let placedY = fromY + (data.y[b + i]! - fromY) * eased;

        if (rise > 0) placedY -= Math.sin(data.phase[i]!) * rise;

        data.nowX[i] = placedX;
        data.nowY[i] = placedY;

        let x = midX + placedX * span;
        let y = midY + placedY * span;

        if (sway > 0) {
          const rate = data.drift[i]!;
          const offset = data.phase[i]!;

          x += Math.sin(time * rate + offset) * wobble;
          y += Math.cos(time * rate * 0.9 + offset) * wobble;
        }

        let size = 1;

        if (pushing) {
          const dx = x - px;
          const dy = y - py;
          const gap = dx * dx + dy * dy;

          if (gap > 0.0001 && gap < reachSq) {
            const distance = Math.sqrt(gap);
            const falloff = 1 - distance / reach;
            const shove = (falloff * falloff * held * repel * reach) / distance;

            x += dx * shove;
            y += dy * shove;
            size = 1 - 0.28 * falloff * held;
          }
        }

        const half = (tile * size) / 2;

        buffer[i]!.set(size, 0, x - half, y - half);
      }

      notifyChange(placements);
    },
    [placements, span, shortest, midX, midY, tile, sway, lift, reach, repel],
  );

  const opacity = useDerivedValue(() => reveal.value, []);

  const gesture = useMemo(() => {
    const drag = Gesture.Pan()
      .enabled(interactive)
      .minDistance(0)
      .onBegin((event) => {
        pointerX.value = event.x;
        pointerY.value = event.y;
        easedX.value = event.x;
        easedY.value = event.y;
        grip.value = withTiming(1, { duration: 160 });
      })
      .onChange((event) => {
        pointerX.value = event.x;
        pointerY.value = event.y;
      })
      .onFinalize(() => {
        grip.value = withTiming(0, { duration: 360 });
      });

    const tap = Gesture.Tap()
      .enabled(tapToMorph && choices > 1)
      .onEnd((_event, landed) => {
        if (landed) advance(1);
      })
      .runOnJS(true);

    return Gesture.Simultaneous(drag, tap);
  }, [interactive, tapToMorph, choices, advance]);

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      <GestureDetector gesture={gesture}>
        <Canvas style={StyleSheet.absoluteFill}>
          {atlas && letters > 0 ? (
            <Atlas
              image={atlas.image}
              sprites={sprites}
              transforms={placements}
              opacity={opacity}
            />
          ) : null}
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export { LetterSwarm, SWARM_FORMS };
export default memo(LetterSwarm);
export type {
  ILetterSwarm,
  ISwarmForm,
  TSwarmForm,
  TSwarmPreset,
} from "./types";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 240,
  },
});
