import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  type LayoutChangeEvent,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  ACTIVE_SCALE_Y,
  SPRING_BOUNCY,
  SPRING_GLIDE,
  THEME,
  THUMB_HEIGHT,
  THUMB_WIDTH,
  TICK_INSET,
  TICK_SIZE,
  TRACK_HEIGHT,
} from "./const";
import type { IRangeSlider } from "./types";
import { scheduleOnRN } from "react-native-worklets";

const clamp = (v: number, lo: number, hi: number): number => {
  "worklet";
  return Math.min(hi, Math.max(lo, v));
};

const RangeSlider: React.FC<IRangeSlider> &
  React.FunctionComponent<IRangeSlider> = memo<IRangeSlider>(
  ({
    value,
    defaultValue = 0,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    showTicks = true,
    disabled = false,
    trackColor = THEME.track,
    fillColor = THEME.fill,
    thumbColor = THEME.thumb,
    tickColor = THEME.tick,
    style,
    accessibilityLabel,
  }: IRangeSlider): React.JSX.Element &
    React.ReactElement &
    React.ReactNode => {
    const controlled = value !== undefined;
    const [internal, setInternal] = useState<number>(defaultValue);
    const [trackWidth, setTrackWidth] = useState(0);

    const current = clamp(controlled ? value : internal, min, max);
    const fraction = max > min ? (current - min) / (max - min) : 0;

    const pos = useSharedValue<number>(fraction);
    const scaleY = useSharedValue<number>(1);
    const trackW = useSharedValue<number>(0);
    const lastValue = useSharedValue<number>(current);

    useEffect(() => {
      lastValue.value = current;
      pos.value = withSpring(fraction, SPRING_GLIDE);
    }, [fraction, current, pos, lastValue]);

    const commit = useCallback(
      (next: number) => {
        const snapped = clamp(
          Math.round((next - min) / step) * step + min,
          min,
          max,
        );
        if (!controlled) setInternal(snapped);
        onValueChange?.(snapped);
      },
      [controlled, onValueChange, min, max, step],
    );

    const updateFromX = useCallback(
      (x: number) => {
        "worklet";
        const w = trackW.value;
        if (w <= 0) return;
        const ratio = clamp(x / w, 0, 1);
        const raw = min + ratio * (max - min);
        const snapped = clamp(
          Math.round((raw - min) / step) * step + min,
          min,
          max,
        );
        if (snapped !== lastValue.value) {
          lastValue.value = snapped;
          scheduleOnRN(commit, snapped);
        }
      },
      [min, max, step, commit, trackW, lastValue],
    );

    const gesture = useMemo(
      () =>
        Gesture.Pan()
          .enabled(!disabled)
          .minDistance(0)
          .onBegin((e) => {
            scaleY.value = withSpring(ACTIVE_SCALE_Y, SPRING_BOUNCY);
            updateFromX(e.x);
          })
          .onUpdate((e) => {
            updateFromX(e.x);
          })
          .onFinalize(() => {
            scaleY.value = withSpring(1, SPRING_BOUNCY);
          }),
      [disabled, updateFromX, scaleY],
    );

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        trackW.value = w;
        setTrackWidth(w);
      },
      [trackW],
    );

    const thumbStyle = useAnimatedStyle<Pick<ViewStyle, "transform" | "left">>(
      () => ({
        left: pos.value * Math.max(0, trackW.value - THUMB_WIDTH),
        transform: [{ scaleY: scaleY.value }],
      }),
    );

    const fillStyle = useAnimatedStyle<Pick<ViewStyle, "width">>(() => ({
      width:
        pos.value * Math.max(0, trackW.value - THUMB_WIDTH) + THUMB_WIDTH / 2,
    }));

    const ticks = useMemo(() => {
      if (!showTicks || trackWidth <= 0) return [];
      const steps = Math.floor((max - min) / step);
      if (steps <= 0 || steps > 50) return [];
      const usable = trackWidth - TICK_INSET * 2;
      return Array.from({ length: steps + 1 }, (_, i) => ({
        key: i,
        left: TICK_INSET + (i / steps) * usable - TICK_SIZE / 2,
      }));
    }, [showTicks, trackWidth, min, max, step]);

    return (
      <GestureDetector gesture={gesture}>
        <View
          onLayout={onLayout}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ min, max, now: current }}
          accessibilityState={{ disabled }}
          style={[
            styles.track,
            { backgroundColor: trackColor },
            disabled && styles.disabled,
            style,
          ]}
        >
          <Animated.View
            style={[styles.fill, { backgroundColor: fillColor }, fillStyle]}
          />

          {ticks.map((t) => (
            <View
              key={t.key}
              pointerEvents="none"
              style={[
                styles.tick,
                {
                  left: t.left,
                  backgroundColor: tickColor,
                },
              ]}
            />
          ))}

          <Animated.View
            style={[styles.thumb, { backgroundColor: thumbColor }, thumbStyle]}
          />
        </View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  track: {
    height: TRACK_HEIGHT,
    width: "100%",
    borderRadius: 10,

    overflow: "hidden",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  tick: {
    position: "absolute",
    top: TRACK_HEIGHT / 2 - TICK_SIZE / 2,
    width: TICK_SIZE,
    height: TICK_SIZE,
    borderRadius: TICK_SIZE / 2,
  },
  thumb: {
    position: "absolute",
    top: (TRACK_HEIGHT - THUMB_HEIGHT) / 2,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 3,
  },
});

export { RangeSlider };
export default RangeSlider;
export type { IRangeSlider } from "./types";
