import type { IGeo, IRect, TAlign, TSide } from "./types";

function buildGeo(
  tW: number,
  tH: number,
  cW: number,
  cH: number,
  side: TSide,
  align: TAlign,
  gap: number,
  panelRadius: number,
): IGeo {
  const py = side === "bottom" ? tH + gap : -(gap + cH);
  const px = align === "start" ? 0 : align === "end" ? tW - cW : (tW - cW) / 2;

  const left = Math.min(0, px);
  const top = Math.min(0, py);
  const layerW = Math.max(tW, px + cW) - left;
  const layerH = Math.max(tH, py + cH) - top;

  const triggerRadius = Math.min(tH / 2, panelRadius);

  return {
    layerW,
    layerH,
    left,
    top,
    trigger: { x: -left, y: -top, w: tW, h: tH, r: triggerRadius },
    panel: { x: px - left, y: py - top, w: cW, h: cH, r: panelRadius },
  };
}

function rectAt(geo: IGeo, p: number): IRect {
  "worklet";
  const t = geo.trigger;
  const pn = geo.panel;
  const l = (a: number, b: number): number => a + (b - a) * p;
  return {
    x: l(t.x, pn.x),
    y: l(t.y, pn.y),
    w: l(t.w, pn.w),
    h: l(t.h, pn.h),
    r: l(t.r, pn.r),
  };
}

export { buildGeo, rectAt };
