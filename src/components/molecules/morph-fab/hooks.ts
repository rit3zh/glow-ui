import { useCallback, useMemo, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { type SharedValue, useDerivedValue } from "react-native-reanimated";

import { buildGeo, itemProgress, slotAt } from "./geo";
import { LAYER_PADDING } from "./const";
import type { IGeo, IGeoConfig, IRegisteredItem, ISize } from "./types";

const useMeasuredSize = (initial: ISize) => {
  const [size, setSize] = useState<ISize>(initial);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;

    setSize((prev) => {
      if (Math.abs(prev.w - width) < 0.5 && Math.abs(prev.h - height) < 0.5) {
        return prev;
      }

      return { w: width, h: height };
    });
  }, []);

  return { size, onLayout };
};

const useItemRegistry = () => {
  const [items, setItems] = useState<IRegisteredItem[]>([]);

  const registerItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.some((item) => item.id === id)
        ? prev
        : [...prev, { id, w: 0, h: 0 }],
    );
  }, []);

  const unregisterItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = useCallback(
    (id: string, patch: Partial<Omit<IRegisteredItem, "id">>) => {
      setItems((prev) => {
        let changed = false;
        const next = prev.map((item) => {
          if (item.id !== id) return item;

          const merged = { ...item, ...patch };
          const sameSize =
            Math.abs(item.w - merged.w) < 0.5 &&
            Math.abs(item.h - merged.h) < 0.5;

          if (
            sameSize &&
            item.radius === merged.radius &&
            item.color === merged.color
          ) {
            return item;
          }

          changed = true;
          return merged;
        });

        return changed ? next : prev;
      });
    },
    [],
  );

  return { items, registerItem, unregisterItem, updateItem };
};

const useMorphFabGeometry = (
  config: Omit<IGeoConfig, "padding">,
  padding: number = LAYER_PADDING,
) =>
  useMemo(
    () => buildGeo({ ...config, padding }),
    [
      config.triggerSize,
      config.items,
      config.direction,
      config.align,
      config.sideOffset,
      config.spacing,
      config.itemRadius,
      config.triggerRadius,
      padding,
    ],
  );

const useScaledFabRect = (geo: IGeo, scale: SharedValue<number>) => {
  const cx = geo.fab.x + geo.fab.w / 2;
  const cy = geo.fab.y + geo.fab.h / 2;

  return {
    fx: useDerivedValue(() => cx - (geo.fab.w * scale.value) / 2, [geo]),
    fy: useDerivedValue(() => cy - (geo.fab.h * scale.value) / 2, [geo]),
    fw: useDerivedValue(() => geo.fab.w * scale.value, [geo]),
    fh: useDerivedValue(() => geo.fab.h * scale.value, [geo]),
    fr: useDerivedValue(() => geo.fab.r * scale.value, [geo]),
  };
};

const useSlotRect = (
  geo: IGeo,
  index: number,
  count: number,
  progress: SharedValue<number>,
  stagger: number,
) => {
  const rect = useDerivedValue(
    () =>
      slotAt(geo, index, itemProgress(progress.value, index, count, stagger)),
    [geo, index, count, stagger],
  );

  return {
    rect,
    sx: useDerivedValue(() => rect.value.x),
    sy: useDerivedValue(() => rect.value.y),
    sw: useDerivedValue(() => rect.value.w),
    sh: useDerivedValue(() => rect.value.h),
    sr: useDerivedValue(() => rect.value.r),
  };
};

export {
  useMeasuredSize,
  useItemRegistry,
  useMorphFabGeometry,
  useScaledFabRect,
  useSlotRect,
};
