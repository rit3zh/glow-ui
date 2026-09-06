import type { IGeo, IGeoConfig, IRect, TAlign, TDirection } from "./types";

const EMPTY_RECT: IRect = { x: 0, y: 0, w: 0, h: 0, r: 0 };

const EMPTY_GEO: IGeo = {
  layerW: 0,
  layerH: 0,
  left: 0,
  top: 0,
  fab: EMPTY_RECT,
  slots: [],
};

function isVertical(direction: TDirection): boolean {
  return direction === "up" || direction === "down";
}

function crossOffset(align: TAlign, fabSpan: number, itemSpan: number): number {
  if (align === "start") return 0;
  if (align === "end") return fabSpan - itemSpan;
  return (fabSpan - itemSpan) / 2;
}

function clampRadius(radius: number, w: number, h: number): number {
  return Math.max(0, Math.min(radius, Math.min(w, h) / 2));
}

function buildGeo(config: IGeoConfig): IGeo {
  const {
    triggerSize,
    items,
    direction,
    align,
    sideOffset,
    spacing,
    itemRadius,
    triggerRadius,
    padding,
  } = config;

  const tW = triggerSize.w;
  const tH = triggerSize.h;
  if (tW <= 0 || tH <= 0) return EMPTY_GEO;

  const vertical = isVertical(direction);
  const slots: IRect[] = [];

  let run = sideOffset;
  for (const item of items) {
    const r = clampRadius(item.radius ?? itemRadius, item.w, item.h);
    let x = 0;
    let y = 0;

    if (direction === "up") {
      x = crossOffset(align, tW, item.w);
      y = -(run + item.h);
    } else if (direction === "down") {
      x = crossOffset(align, tW, item.w);
      y = tH + run;
    } else if (direction === "left") {
      x = -(run + item.w);
      y = crossOffset(align, tH, item.h);
    } else {
      x = tW + run;
      y = crossOffset(align, tH, item.h);
    }

    slots.push({ x, y, w: item.w, h: item.h, r });
    run += (vertical ? item.h : item.w) + spacing;
  }

  let minX = 0;
  let minY = 0;
  let maxX = tW;
  let maxY = tH;

  for (const slot of slots) {
    minX = Math.min(minX, slot.x);
    minY = Math.min(minY, slot.y);
    maxX = Math.max(maxX, slot.x + slot.w);
    maxY = Math.max(maxY, slot.y + slot.h);
  }

  return {
    left: minX - padding,
    top: minY - padding,
    layerW: maxX - minX + padding * 2,
    layerH: maxY - minY + padding * 2,
    fab: {
      x: 0,
      y: 0,
      w: tW,
      h: tH,
      r: clampRadius(triggerRadius, tW, tH),
    },
    slots,
  };
}

/**
 * Maps the root progress onto a single item so the blobs peel off the fab
 * one after another instead of all at once.
 */
function itemProgress(
  p: number,
  index: number,
  count: number,
  stagger: number,
): number {
  "worklet";
  const span = Math.max(0.0001, 1 - stagger * Math.max(0, count - 1));
  const t = (p - index * stagger) / span;
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

function slotAt(geo: IGeo, index: number, p: number): IRect {
  "worklet";
  const fab = geo.fab;
  const slot = geo.slots[index];
  if (!slot) return fab;

  const l = (a: number, b: number): number => a + (b - a) * p;
  return {
    x: l(fab.x, slot.x),
    y: l(fab.y, slot.y),
    w: l(fab.w, slot.w),
    h: l(fab.h, slot.h),
    r: l(fab.r, slot.r),
  };
}

export {
  EMPTY_GEO,
  EMPTY_RECT,
  buildGeo,
  clampRadius,
  itemProgress,
  slotAt,
  isVertical,
};
