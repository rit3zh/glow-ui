import { useEffect, useRef } from "react";
import type { ViewStyle } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { useAnimation } from "../toast.animation";
import type { IToastMotion } from "../Toast.types";

/** How long to wait for a measurement before entering on the fallback height. */
const MEASURE_GRACE_MS = 100;

function useToastMotion({ toast, layout, actionMode }: IToastMotion) {
  const { dir, targetY, targetScale, targetOpacity, enterDistance, measured } =
    layout;
  const { timing, spring } = useAnimation();

  const presence = useSharedValue<number>(0);
  const ty = useSharedValue<number>(targetY);
  const sc = useSharedValue<number>(targetScale);
  const op = useSharedValue<number>(targetOpacity);
  const dragX = useSharedValue<number>(0);
  const dragY = useSharedValue<number>(0);
  const lockedAxis = useSharedValue<number>(0);
  const swipeOrigin = useSharedValue<number>(0);
  const armed = useSharedValue<number>(0);
  const contentFade = useSharedValue<number>(1);
  // Lives on the UI thread so a late measurement updates the travel distance
  // without rebuilding the animated style.
  const enterTravel = useSharedValue<number>(enterDistance);

  useEffect(() => {
    enterTravel.value = enterDistance;
  }, [enterDistance, enterTravel]);

  /**
   * The entrance waits for the row's own height.
   *
   * Starting on mount meant sliding in from the 56px fallback and then re-aiming
   * the moment `onLayout` landed — a visible hitch, and the worse the busier the
   * JS thread, which is exactly when toasts are being spammed. The grace timer
   * covers the case where no measurement ever arrives.
   */
  const entered = useRef<boolean>(false);
  useEffect(() => {
    if (entered.current || !measured) return;
    entered.current = true;
    presence.value = spring.glide(1);
  }, [measured, presence, spring]);

  useEffect(() => {
    if (entered.current) return;
    const id = setTimeout(() => {
      if (entered.current) return;
      entered.current = true;
      presence.value = spring.glide(1);
    }, MEASURE_GRACE_MS);
    return () => clearTimeout(id);
  }, [presence, spring]);

  const firstContent = useRef<boolean>(true);
  useEffect(() => {
    if (firstContent.current) {
      firstContent.current = false;
      return;
    }
    contentFade.value = 0;
    contentFade.value = timing.normal<number>(1);
  }, [
    toast.type,
    toast.title,
    toast.description,
    toast.icon,
    contentFade,
    timing,
  ]);

  useEffect(() => {
    ty.value = spring.glide(targetY);
    sc.value = spring.glide(targetScale);
    op.value = timing.normal(targetOpacity);
  }, [targetY, targetScale, targetOpacity, ty, sc, op, spring, timing]);

  const wrapperStyle = useAnimatedStyle<
    Pick<ViewStyle, "opacity" | "transform">
  >(() => {
    const enter = 1 - presence.value;
    const enterY = -dir * enterTravel.value * enter;
    const travel = actionMode
      ? Math.abs(dragY.value)
      : Math.abs(dragX.value) + Math.abs(dragY.value);
    const swipeFade = 1 - Math.min(1, travel / 200);

    return {
      opacity: op.value * presence.value * swipeFade,
      transform: [
        { translateY: ty.value + enterY + dragY.value },
        { translateX: actionMode ? 0 : dragX.value },
        { scale: sc.value * (0.94 + 0.06 * presence.value) },
      ],
    };
  });

  const surfaceStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [{ translateX: actionMode ? dragX.value : 0 }],
  }));

  const contentFadeStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: contentFade.value,
  }));

  return {
    presence,
    dragX,
    dragY,
    lockedAxis,
    swipeOrigin,
    armed,
    wrapperStyle,
    surfaceStyle,
    contentFadeStyle,
  };
}

export { useToastMotion };
