import { Skia } from "@shopify/react-native-skia";
import { Easing, type EasingFunction } from "react-native-reanimated";
import {
  DISTANCE_EPSILON,
  M3_LOADING_SEQUENCE,
  POINTS_PER_FRAME,
  STEPS_PER_SEGMENT,
  VIEWBOX,
} from "./const";
import { getShape, type ShapeName } from "./shape-registry";
import { Morph } from "./morph";
import { toPathD } from "./svg-path";
import type { IMorphingEasing, MorphFrames } from "./types";

const TOP_ANGLE = -Math.PI / 2;

const flattenSvgPath = (d: string, count: number): number[] => {
  const path = Skia.Path.MakeFromSVGString(d);
  if (!path) throw new Error("MorphLoader: invalid morph path");
  const iter = Skia.ContourMeasureIter(path, true, 1);
  const measure = iter.next();
  if (!measure) throw new Error("MorphLoader: empty morph path");
  const total = measure.length();
  const out = new Array<number>(count * 2);
  for (let i = 0; i < count; i++) {
    const [pos] = measure.getPosTan((i / count) * total);
    out[i * 2] = pos.x;
    out[i * 2 + 1] = pos.y;
  }
  return out;
};

const reAnchorToTop = (pts: number[], count: number): number[] => {
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < count; i++) {
    cx += pts[i * 2];
    cy += pts[i * 2 + 1];
  }
  cx /= count;
  cy /= count;

  let best = 0;
  let bestDelta = Infinity;
  for (let i = 0; i < count; i++) {
    const angle = Math.atan2(pts[i * 2 + 1] - cy, pts[i * 2] - cx);
    let delta = Math.abs(angle - TOP_ANGLE);
    if (delta > Math.PI) delta = 2 * Math.PI - delta;
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  }
  if (best === 0) return pts;

  const out = new Array<number>(count * 2);
  for (let i = 0; i < count; i++) {
    const j = (best + i) % count;
    out[i * 2] = pts[j * 2];
    out[i * 2 + 1] = pts[j * 2 + 1];
  }
  return out;
};

const cubicBezier = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): EasingFunction => Easing.bezier(x1, y1, x2, y2).factory();

const MotionEasing: IMorphingEasing = {
  emphasized: cubicBezier(0.2, 0, 0, 1),
  emphasizedDecelerate: cubicBezier(0.05, 0.7, 0.1, 1),
  emphasizedAccelerate: cubicBezier(0.3, 0, 0.8, 0.15),
  standard: cubicBezier(0.4, 0, 0.2, 1),
};

const buildMorphFrames = (
  sequence: readonly ShapeName[],
  easingFn: EasingFunction = MotionEasing.emphasized,
): MorphFrames => {
  const n = sequence.length;
  if (n < 2) throw new Error("MorphLoader: needs at least 2 shapes");

  const frameCount = n * STEPS_PER_SEGMENT;
  const flat = new Array<number>(frameCount * POINTS_PER_FRAME * 2);
  let f = 0;

  for (let s = 0; s < n; s++) {
    const morph = new Morph(
      getShape(sequence[s]),
      getShape(sequence[(s + 1) % n]),
    );
    for (let step = 0; step < STEPS_PER_SEGMENT; step++) {
      const t = easingFn(step / STEPS_PER_SEGMENT);
      const d = toPathD(morph.asCubics(t), VIEWBOX);
      const pts = reAnchorToTop(
        flattenSvgPath(d, POINTS_PER_FRAME),
        POINTS_PER_FRAME,
      );
      const base = f * POINTS_PER_FRAME * 2;
      for (let i = 0; i < pts.length; i++) flat[base + i] = pts[i];
      f++;
    }
  }

  return { flat, frameCount };
};

let defaultFramesCache: MorphFrames | null = null;

const getDefaultFrames = (): MorphFrames => {
  if (!defaultFramesCache) {
    defaultFramesCache = buildMorphFrames(M3_LOADING_SEQUENCE);
  }
  return defaultFramesCache;
};

function axisExtremaTs(a: number, b: number, c: number): number[] {
  const zeroIsh = Math.abs(a) < DISTANCE_EPSILON;
  if (zeroIsh) {
    if (b !== 0) {
      const t = (2 * c) / (-2 * b);
      if (t >= 0 && t <= 1) {
        return [t];
      }
    }
    return [];
  }
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return [];
  }
  const sqrtD = Math.sqrt(discriminant);
  const results: number[] = [];
  for (const t of [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)]) {
    if (t >= 0 && t <= 1) {
      results.push(t);
    }
  }
  return results;
}

export {
  buildMorphFrames,
  getDefaultFrames,
  MotionEasing,
  cubicBezier,
  axisExtremaTs,
  type MorphFrames,
};
