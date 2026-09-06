import { useMemo } from "react";

import {
  TOAST_COLLAPSE_OFFSET,
  TOAST_COLLAPSE_SCALE_STEP,
} from "../toast.constants";
import type { IToastGeometry, IToastLayout } from "../Toast.types";

function useToastLayout({
  toastId,
  toasts,
  heightMap,
  selfHeight,
  index,
  position,
  expanded,
  expandByDefault,
  gap,
  visibleToasts,
}: IToastLayout): IToastGeometry {
  const isBottom = position === "bottom";
  const dir = isBottom ? -1 : 1;

  // The row measures itself a render before the parent's height map catches up,
  // so prefer the local number — it is what keeps the entrance from re-aiming
  // mid-flight once the measurement lands.
  const measured = selfHeight || heightMap.get(toastId) || 0;

  const heightsBefore = useMemo(() => {
    if (index === 0) return 0;
    let sum = 0;
    for (let i = 0; i < index; i += 1) {
      sum += heightMap.get(toasts[i].id) ?? measured;
    }
    return sum;
  }, [toasts, index, heightMap, measured]);

  const layoutExpanded = expanded || expandByDefault;
  const magnitude = layoutExpanded
    ? heightsBefore + index * gap
    : index * TOAST_COLLAPSE_OFFSET;

  return {
    isBottom,
    dir,
    targetY: dir * magnitude,
    targetScale: layoutExpanded
      ? 1
      : Math.max(0.8, 1 - index * TOAST_COLLAPSE_SCALE_STEP),
    targetOpacity: index < visibleToasts ? 1 : 0,
    enterDistance: (measured || 56) + 16,
    measured: measured > 0,
  };
}

export { useToastLayout };
