import type {
  TLineChartCurve,
  ILineChartFrame,
  ILineChartPoint,
  ILineChartVector,
} from "./types";

function lerp(from: number, to: number, progress: number): number {
  "worklet";
  return from + (to - from) * progress;
}

function toPixelPoints(
  data: readonly ILineChartPoint[],
  width: number,
  height: number,
  horizontalPadding: number,
  verticalPadding: number,
  minY?: number,
  maxY?: number,
): ILineChartVector[] {
  if (data.length === 0) return [];

  let lowX = data[0]!.x;
  let highX = data[0]!.x;
  let lowY = data[0]!.y;
  let highY = data[0]!.y;

  for (const point of data) {
    if (point.x < lowX) lowX = point.x;
    if (point.x > highX) highX = point.x;
    if (point.y < lowY) lowY = point.y;
    if (point.y > highY) highY = point.y;
  }

  if (minY != null) lowY = minY;
  if (maxY != null) highY = maxY;

  const drawingWidth = Math.max(width - horizontalPadding * 2, 0);
  const drawingHeight = Math.max(height - verticalPadding * 2, 0);
  const spanX = highX - lowX || 1;
  const spanY = highY - lowY || 1;

  return data.map((point) => ({
    x: horizontalPadding + ((point.x - lowX) / spanX) * drawingWidth,
    y: verticalPadding + (1 - (point.y - lowY) / spanY) * drawingHeight,
  }));
}

function monotoneTangents(points: ILineChartVector[]): number[] {
  "worklet";
  const count = points.length;
  const tangents: number[] = [];
  if (count < 2) {
    for (let i = 0; i < count; i++) tangents.push(0);
    return tangents;
  }

  const slopes: number[] = [];
  for (let i = 0; i < count - 1; i++) {
    const run = points[i + 1]!.x - points[i]!.x;
    slopes.push(run === 0 ? 0 : (points[i + 1]!.y - points[i]!.y) / run);
  }

  tangents.push(slopes[0]!);
  for (let i = 1; i < count - 1; i++) {
    const previous = slopes[i - 1]!;
    const next = slopes[i]!;
    tangents.push(previous * next <= 0 ? 0 : (previous + next) / 2);
  }
  tangents.push(slopes[count - 2]!);

  for (let i = 0; i < count - 1; i++) {
    const slope = slopes[i]!;
    if (slope === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      continue;
    }
    const a = tangents[i]! / slope;
    const b = tangents[i + 1]! / slope;
    const magnitude = a * a + b * b;
    if (magnitude > 9) {
      const scale = 3 / Math.sqrt(magnitude);
      tangents[i] = scale * a * slope;
      tangents[i + 1] = scale * b * slope;
    }
  }

  return tangents;
}

function tangentsFor(
  points: ILineChartVector[],
  curve: TLineChartCurve,
): number[] {
  "worklet";
  return curve === "natural" ? monotoneTangents(points) : [];
}

function buildLinePath(
  points: ILineChartVector[],
  tangents: number[],
  curve: TLineChartCurve,
): string {
  "worklet";
  if (points.length < 2) return "M 0 0";

  let path = `M ${points[0]!.x} ${points[0]!.y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i]!;
    const to = points[i + 1]!;

    if (curve === "step") {
      path += ` L ${to.x} ${from.y} L ${to.x} ${to.y}`;
      continue;
    }
    if (curve === "linear") {
      path += ` L ${to.x} ${to.y}`;
      continue;
    }

    const run = (to.x - from.x) / 3;
    const c1x = from.x + run;
    const c1y = from.y + tangents[i]! * run;
    const c2x = to.x - run;
    const c2y = to.y - tangents[i + 1]! * run;
    path += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${to.x} ${to.y}`;
  }

  return path;
}

function buildAreaPath(
  points: ILineChartVector[],
  tangents: number[],
  curve: TLineChartCurve,
  baselineY: number,
): string {
  "worklet";
  if (points.length < 2) return "M 0 0";
  const line = buildLinePath(points, tangents, curve);

  const first = points[0]!;
  const last = points[points.length - 1]!;
  return `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}

function yForX(
  points: ILineChartVector[],
  tangents: number[],
  curve: TLineChartCurve,
  x: number,
): number {
  "worklet";
  if (points.length === 0) return 0;
  if (points.length === 1) return points[0]!.y;

  if (x <= points[0]!.x) return points[0]!.y;
  const last = points[points.length - 1]!;
  if (x >= last.x) return last.y;

  let index = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (x >= points[i]!.x && x <= points[i + 1]!.x) {
      index = i;
      break;
    }
  }

  const from = points[index]!;
  const to = points[index + 1]!;
  const run = to.x - from.x;
  if (run === 0) return to.y;

  if (curve === "step") return from.y;

  const t = (x - from.x) / run;
  if (curve === "linear") return lerp(from.y, to.y, t);

  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return (
    h00 * from.y +
    h10 * run * (tangents[index] ?? 0) +
    h01 * to.y +
    h11 * run * (tangents[index + 1] ?? 0)
  );
}

function slopeForX(
  points: ILineChartVector[],
  tangents: number[],
  curve: TLineChartCurve,
  x: number,
): number {
  "worklet";
  if (points.length < 2 || curve === "step") return 0;

  let index = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (x >= points[i]!.x && x <= points[i + 1]!.x) {
      index = i;
      break;
    }
    if (i === points.length - 2) index = i;
  }

  const from = points[index]!;
  const to = points[index + 1]!;
  const run = to.x - from.x;
  if (run === 0) return 0;
  if (curve === "linear") return (to.y - from.y) / run;

  const t = Math.min(Math.max((x - from.x) / run, 0), 1);
  const m0 = tangents[index] ?? 0;
  const m1 = tangents[index + 1] ?? 0;
  return (
    ((6 * t * t - 6 * t) * (from.y - to.y)) / run +
    (3 * t * t - 4 * t + 1) * m0 +
    (3 * t * t - 2 * t) * m1
  );
}

const MAX_MORPH_SAMPLES = 160;

function morphGrid(
  from: ILineChartVector[],
  to: ILineChartVector[],
  curve: TLineChartCurve,
): number[] {
  if (curve === "step" || to.length < 2) return to.map((point) => point.x);

  const segments = to.length - 1;
  const wanted = Math.min(
    MAX_MORPH_SAMPLES,
    Math.max(to.length, from.length * 4),
  );
  const factor = Math.min(8, Math.max(1, Math.round(wanted / segments)));
  if (factor <= 1) return to.map((point) => point.x);

  const xs: number[] = [];
  for (let i = 0; i < segments; i++) {
    const start = to[i]!.x;
    const step = (to[i + 1]!.x - start) / factor;
    for (let k = 0; k < factor; k++) xs.push(start + step * k);
  }
  xs.push(to[segments]!.x);
  return xs;
}

function sampleAt(
  points: ILineChartVector[],
  tangents: number[],
  curve: TLineChartCurve,
  xs: number[],
): ILineChartVector[] {
  return xs.map((x) => ({ x, y: yForX(points, tangents, curve, x) }));
}

function sliceCurve(
  points: ILineChartVector[],
  tangents: number[],
  curve: TLineChartCurve,
  progress: number,
): ILineChartFrame {
  "worklet";
  if (progress >= 1 || points.length < 2) return { points, tangents };

  const first = points[0]!;
  const last = points[points.length - 1]!;
  const cutoff = first.x + (last.x - first.x) * progress;
  if (cutoff <= first.x) return { points: [], tangents: [] };

  const kept: ILineChartVector[] = [];
  const keptTangents: number[] = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i]!.x > cutoff) break;
    kept.push(points[i]!);
    keptTangents.push(tangents[i] ?? 0);
  }

  const tail = kept[kept.length - 1];
  if (tail == null || tail.x < cutoff) {
    kept.push({ x: cutoff, y: yForX(points, tangents, curve, cutoff) });
    keptTangents.push(slopeForX(points, tangents, curve, cutoff));
  }

  return { points: kept, tangents: keptTangents };
}

function blendFrame(
  fromPoints: ILineChartVector[],
  fromTangents: number[],
  toPoints: ILineChartVector[],
  toTangents: number[],
  progress: number,
  curve: TLineChartCurve,
): ILineChartFrame {
  "worklet";
  if (progress >= 1 || fromPoints.length !== toPoints.length) {
    return { points: toPoints, tangents: toTangents };
  }

  const points: ILineChartVector[] = [];
  const tangents: number[] = [];
  for (let i = 0; i < toPoints.length; i++) {
    points.push({
      x: toPoints[i]!.x,
      y: lerp(fromPoints[i]!.y, toPoints[i]!.y, progress),
    });
    if (curve === "natural") {
      tangents.push(lerp(fromTangents[i] ?? 0, toTangents[i] ?? 0, progress));
    }
  }
  return { points, tangents };
}

function indexForX(points: ILineChartVector[], x: number): number {
  "worklet";
  if (points.length === 0) return -1;

  let nearest = 0;
  let shortest = Math.abs(points[0]!.x - x);
  for (let i = 1; i < points.length; i++) {
    const distance = Math.abs(points[i]!.x - x);
    if (distance < shortest) {
      shortest = distance;
      nearest = i;
    }
  }
  return nearest;
}

function buildGridPath(
  count: number,
  width: number,
  height: number,
  verticalPadding: number,
): string {
  "worklet";
  if (count < 1 || width <= 0) return "";

  const usableHeight = Math.max(height - verticalPadding * 2, 0);
  let path = "";
  for (let i = 0; i < count; i++) {
    const y =
      verticalPadding +
      (count === 1 ? usableHeight / 2 : (usableHeight * i) / (count - 1));
    path += `M 0 ${y} L ${width} ${y} `;
  }
  return path.trim();
}

export {
  lerp,
  toPixelPoints,
  monotoneTangents,
  tangentsFor,
  buildLinePath,
  buildAreaPath,
  yForX,
  slopeForX,
  morphGrid,
  sampleAt,
  sliceCurve,
  blendFrame,
  indexForX,
  buildGridPath,
};
