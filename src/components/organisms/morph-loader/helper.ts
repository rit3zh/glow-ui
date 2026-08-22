import { Skia } from "@shopify/react-native-skia";
import { Easing, type EasingFunction } from "react-native-reanimated";

import { DEFAULT_SHAPE_KEYS, SHAPES } from "./config";

const POINT_PAIRS = 80;
const NORM_BOX = 100;

const parseTokens = <T extends string>(raw: T): number[] => {
  const out: number[] = [];
  const parts = raw.trim().split(/[\s,]+/);
  for (let i = 0; i < parts.length; i++) {
    const n = +parts[i];
    if (!Number.isNaN(n)) out.push(n);
  }
  return out;
};

const normalizeToBox = <T extends number[]>(pts: T): T => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pts.length; i += 2) {
    const x = pts[i];
    const y = pts[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const w = maxX - minX;
  const h = maxY - minY;
  const span = Math.max(w, h) || 1;
  const scale = NORM_BOX / span;
  const ox = (NORM_BOX - w * scale) / 2;
  const oy = (NORM_BOX - h * scale) / 2;
  const out = new Array<number>(pts.length);
  for (let i = 0; i < pts.length; i += 2) {
    out[i] = (pts[i] - minX) * scale + ox;
    out[i + 1] = (pts[i + 1] - minY) * scale + oy;
  }
  return out as T;
};

const resampleAlongPerimeter = <T extends number[]>(
  pts: T,
  count: number,
): T => {
  const src = pts.length / 2;
  const out = new Array<number>(count * 2);
  for (let i = 0; i < count; i++) {
    const t = (i * src) / count;
    const i0 = Math.floor(t) % src;
    const i1 = (i0 + 1) % src;
    const f = t - Math.floor(t);
    out[i * 2] = pts[i0 * 2] * (1 - f) + pts[i1 * 2] * f;
    out[i * 2 + 1] = pts[i0 * 2 + 1] * (1 - f) + pts[i1 * 2 + 1] * f;
  }
  return out as T satisfies number[];
};

const flattenSvgPath = (d: string, samples: number): number[] => {
  const path = Skia.Path.MakeFromSVGString(d);
  if (!path) throw new Error("MorphLoader: invalid SVG path string");
  const iter = Skia.ContourMeasureIter(path, true, 1);
  const measure = iter.next();
  if (!measure) throw new Error("MorphLoader: empty SVG path");
  const total = measure.length();
  const out = new Array<number>(samples * 2);
  for (let i = 0; i < samples; i++) {
    const dist = (i / samples) * total;
    const [pos] = measure.getPosTan(dist);
    out[i * 2] = pos.x;
    out[i * 2 + 1] = pos.y;
  }
  return out;
};

const isSvgPath = <T extends string>(s: T): boolean =>
  /^[Mm][\s\-+\d.,]/.test(s.trim());

const prepareShape = <T extends string>(raw: T): number[] => {
  const trimmed = raw.trim();
  if (isSvgPath(trimmed)) {
    return normalizeToBox(flattenSvgPath(trimmed, POINT_PAIRS));
  }
  const tokens = parseTokens<string>(trimmed);
  if (tokens.length < 4) {
    throw new Error("MorphLoader: shape must contain at least 2 points");
  }
  return resampleAlongPerimeter(normalizeToBox(tokens), POINT_PAIRS);
};

const buildFlatShapes = <T extends string>(shapes: readonly T[]): number[] => {
  const count = shapes.length;
  const flat = new Array<number>(count * POINT_PAIRS * 2);
  for (let s = 0; s < count; s++) {
    const pts = prepareShape(shapes[s]);
    const base = s * POINT_PAIRS * 2;
    for (let i = 0; i < pts.length; i++) flat[base + i] = pts[i];
  }
  return flat;
};

const defaultShapes: readonly string[] = Object.freeze(
  DEFAULT_SHAPE_KEYS.map((key) => SHAPES[key]),
);
const DEFAULT_FLAT: number[] = buildFlatShapes<string>(defaultShapes);

const cubicBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): EasingFunction => Easing.bezier(x1, y1, x2, y2).factory();

const MotionEasing: {
  readonly emphasized: EasingFunction;
  readonly emphasizedDecelerate: EasingFunction;
  readonly emphasizedAccelerate: EasingFunction;
  readonly standard: EasingFunction;
} = {
  emphasized: cubicBezier(0.2, 0, 0, 1),
  emphasizedDecelerate: cubicBezier(0.05, 0.7, 0.1, 1),
  emphasizedAccelerate: cubicBezier(0.3, 0, 0.8, 0.15),
  standard: cubicBezier(0.4, 0, 0.2, 1),
};

export {
  POINT_PAIRS,
  buildFlatShapes,
  defaultShapes,
  DEFAULT_FLAT,
  MotionEasing,
  cubicBezier,
};
