import { useMemo } from "react";
import * as Haptics from "expo-haptics";
import { Gesture, type PanGesture } from "react-native-gesture-handler";
import { withDelay, withSpring, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  commitTiming,
  COMMIT_MS,
  EXIT_MS,
  releaseTiming,
  spring as springPresets,
} from "../toast.animation";
import {
  TOAST_ACTION_FLING_VELOCITY,
  TOAST_ACTION_MIN_OPEN,
  TOAST_ACTION_REVEAL_WIDTH,
  TOAST_SWIPE_ACTIVATE,
  TOAST_SWIPE_AXIS_LOCK,
  TOAST_SWIPE_FAIL,
  TOAST_SWIPE_THRESHOLD,
  TOAST_SWIPE_VELOCITY,
} from "../toast.constants";
import { getCommitWidth, shapeCounterSwipe, shapeSwipe } from "../toast.math";
import type { IToastSwipe } from "../Toast.types";

// Haptics are a nicety — a platform without them must never break the gesture.
function impact(style: Haptics.ImpactFeedbackStyle) {
  try {
    void Haptics.impactAsync(style).catch(() => {});
  } catch {
    // no haptic engine
  }
}

function notifyArm() {
  impact(Haptics.ImpactFeedbackStyle.Soft);
}

function notifyCommit() {
  impact(Haptics.ImpactFeedbackStyle.Medium);
}

function useToastSwipe({
  enabled,
  swipeDirection,
  action,
  isBottom,
  rowWidth,
  screenW,
  screenH,
  haptics,
  dragX,
  dragY,
  lockedAxis,
  swipeOrigin,
  armed,
  presence,
  commitBySwipe,
  dismissBySwipe,
  onOpenChange,
  onInteractingChange,
}: IToastSwipe) {
  return useMemo<PanGesture>(() => {
    const hasAction = action != null;
    const side = action?.direction ?? "left";
    const revealWidth = action?.revealWidth ?? TOAST_ACTION_REVEAL_WIDTH;
    const commitWidth = getCommitWidth(
      rowWidth,
      revealWidth,
      action?.commitThreshold,
      action?.commitOffset,
    );

    const allowX =
      hasAction || swipeDirection === "horizontal" || swipeDirection === "any";
    const allowY = swipeDirection === "vertical" || swipeDirection === "any";
    const active = enabled && swipeDirection !== "none" && (allowX || allowY);

    let pan = Gesture.Pan().enabled(active);

    pan = allowX
      ? pan.activeOffsetX([-TOAST_SWIPE_ACTIVATE, TOAST_SWIPE_ACTIVATE])
      : pan.failOffsetX([-TOAST_SWIPE_FAIL, TOAST_SWIPE_FAIL]);
    pan = allowY
      ? pan.activeOffsetY([-TOAST_SWIPE_ACTIVATE, TOAST_SWIPE_ACTIVATE])
      : pan.failOffsetY([-TOAST_SWIPE_FAIL, TOAST_SWIPE_FAIL]);

    return pan
      .onBegin(() => {
        "worklet";
        swipeOrigin.value = dragX.value;
        armed.value = Math.abs(dragX.value) >= commitWidth ? 1 : 0;
        scheduleOnRN(onInteractingChange, true);
      })
      .onUpdate((e) => {
        "worklet";
        if (lockedAxis.value === 0) {
          const ax = Math.abs(e.translationX);
          const ay = Math.abs(e.translationY);
          if (ax > TOAST_SWIPE_AXIS_LOCK || ay > TOAST_SWIPE_AXIS_LOCK) {
            lockedAxis.value = ax >= ay ? 1 : 2;
          }
        }

        if (lockedAxis.value === 1 && allowX) {
          const raw = swipeOrigin.value + e.translationX;

          if (!hasAction) {
            dragX.value = raw;
            return;
          }

          const opening =
            side === "both" ||
            (side === "left" && raw < 0) ||
            (side === "right" && raw > 0);

          const shaped = opening
            ? shapeSwipe(raw, revealWidth, rowWidth)
            : shapeCounterSwipe(raw, rowWidth);

          dragX.value = shaped;

          const past = Math.abs(shaped) >= commitWidth ? 1 : 0;
          if (past !== armed.value) {
            armed.value = past;
            if (past === 1 && haptics) scheduleOnRN(notifyArm);
          }
        } else if (lockedAxis.value === 2 && allowY) {
          const towardEdge = isBottom ? e.translationY > 0 : e.translationY < 0;
          dragY.value = towardEdge ? e.translationY : e.translationY * 0.2;
        }
      })
      .onEnd((e) => {
        "worklet";
        const axis = lockedAxis.value;
        const flickX = Math.abs(e.velocityX) >= TOAST_SWIPE_VELOCITY * 1000;

        if (axis === 1 && allowX && hasAction) {
          const travel = Math.abs(dragX.value);
          const openSign =
            side === "left"
              ? -1
              : side === "right"
                ? 1
                : Math.sign(dragX.value) || -1;
          const towardOpen = Math.sign(dragX.value) === openSign;
          const velocityOpen = Math.sign(e.velocityX) === openSign;
          const fling =
            velocityOpen &&
            Math.abs(e.velocityX) >= TOAST_ACTION_FLING_VELOCITY;

          if (
            towardOpen &&
            (travel >= commitWidth || (fling && travel >= revealWidth))
          ) {
            armed.value = 0;
            dragX.value = withTiming(openSign * rowWidth, commitTiming);
            presence.value = withDelay(
              COMMIT_MS,
              withTiming(0, { duration: EXIT_MS }),
            );
            if (haptics) scheduleOnRN(notifyCommit);
            scheduleOnRN(commitBySwipe);
            return;
          }

          const shouldOpen =
            towardOpen &&
            (travel >= revealWidth * 0.5 ||
              (travel >= TOAST_ACTION_MIN_OPEN && velocityOpen && flickX));

          dragX.value = withTiming(
            shouldOpen ? openSign * revealWidth : 0,
            releaseTiming,
          );
          scheduleOnRN(onOpenChange, shouldOpen);
          return;
        }

        if (axis === 1 && allowX) {
          if (Math.abs(dragX.value) >= TOAST_SWIPE_THRESHOLD || flickX) {
            const dirX = Math.sign(dragX.value || e.velocityX) || 1;
            dragX.value = withTiming(dirX * screenW, { duration: EXIT_MS });
            presence.value = withTiming(0, { duration: EXIT_MS });
            scheduleOnRN(dismissBySwipe);
            return;
          }
        } else if (axis === 2 && allowY) {
          const towardEdge = isBottom ? dragY.value > 0 : dragY.value < 0;
          const past =
            towardEdge &&
            (Math.abs(dragY.value) >= TOAST_SWIPE_THRESHOLD ||
              Math.abs(e.velocityY) >= TOAST_SWIPE_VELOCITY * 1000);

          if (past) {
            dragY.value = withTiming(Math.sign(dragY.value) * screenH * 0.6, {
              duration: EXIT_MS,
            });
            presence.value = withTiming(0, { duration: EXIT_MS });
            scheduleOnRN(dismissBySwipe);
            return;
          }
        }

        dragX.value = withSpring(0, springPresets.snappy);
        dragY.value = withSpring(0, springPresets.snappy);
      })
      .onFinalize(() => {
        "worklet";
        lockedAxis.value = 0;
        armed.value = 0;
        scheduleOnRN(onInteractingChange, false);
      });
  }, [
    enabled,
    swipeDirection,
    action,
    isBottom,
    rowWidth,
    screenW,
    screenH,
    haptics,
    dragX,
    dragY,
    lockedAxis,
    swipeOrigin,
    armed,
    presence,
    commitBySwipe,
    dismissBySwipe,
    onOpenChange,
    onInteractingChange,
  ]);
}

export { useToastSwipe };
