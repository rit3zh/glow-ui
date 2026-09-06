import { type SharedValue, useDerivedValue } from "react-native-reanimated";
import type { IGeo, ITriggerSize, TAlign, TSide } from "./types";
import { buildGeo, rectAt } from "./geo";
import { useCallback, useMemo, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

const useAnimatedRect = (geo: IGeo, progress: SharedValue<number>) => {
  const rect = useDerivedValue(() => rectAt(geo, progress.value), [geo]);

  return {
    rect,
    rx: useDerivedValue(() => rect.value.x),
    ry: useDerivedValue(() => rect.value.y),
    rw: useDerivedValue(() => rect.value.w),
    rh: useDerivedValue(() => rect.value.h),
    rr: useDerivedValue(() => rect.value.r),
  };
};

const useScaledTriggerRect = (geo: IGeo, scale: SharedValue<number>) => {
  const cx = geo.trigger.x + geo.trigger.w / 2;
  const cy = geo.trigger.y + geo.trigger.h / 2;

  return {
    tx: useDerivedValue(() => cx - (geo.trigger.w * scale.value) / 2, [geo]),
    ty: useDerivedValue(() => cy - (geo.trigger.h * scale.value) / 2, [geo]),
    tw: useDerivedValue(() => geo.trigger.w * scale.value, [geo]),
    th: useDerivedValue(() => geo.trigger.h * scale.value, [geo]),
    tr: useDerivedValue(() => geo.trigger.r * scale.value, [geo]),
  };
};

const usePopoverGeometry = (
  triggerSize: ITriggerSize,
  contentSize: ITriggerSize,
  side: TSide,
  align: TAlign,
  gap: number,
  panelRadius: number,
) => {
  return useMemo(
    () =>
      buildGeo(
        triggerSize.w,
        triggerSize.h,
        contentSize.w,
        contentSize.h,
        side,
        align,
        gap,
        panelRadius,
      ),
    [triggerSize, contentSize, side, align, gap, panelRadius],
  );
};

const useMeasuredSize = (initials: ITriggerSize) => {
  const [size, setSize] = useState<ITriggerSize>(initials!);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;

    setSize((prev) => {
      if (Math.abs(prev.w - width) < 0.5 && Math.abs(prev.h - height) < 0.5) {
        return prev;
      }

      return {
        w: width,
        h: height,
      };
    });
  }, []);

  return {
    size,
    onLayout,
  };
};

export {
  useAnimatedRect,
  usePopoverGeometry,
  useMeasuredSize,
  useScaledTriggerRect,
};
