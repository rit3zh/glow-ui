import { Cubic } from "./cubic";
import type { RoundedPolygon } from "./polygon";
import type {
  Feature,
  MeasuredCubic,
  MeasuredPolygon,
  Measurer,
  Point,
  ProgressableFeature,
} from "./types";
import { interpolate, positiveModulo, pt, ptDistance, ptSub } from "./utils";
import { ANGLE_EPSILON, DISTANCE_EPSILON } from "./const";

class LengthMeasurer implements Measurer {
  private readonly segments = 3;

  measureCubic(c: Cubic): number {
    return this.closestProgressTo(c, Number.POSITIVE_INFINITY)[1];
  }

  findCubicCutPoint(c: Cubic, m: number): number {
    return this.closestProgressTo(c, m)[0];
  }

  private closestProgressTo(cubic: Cubic, threshold: number): [number, number] {
    let total = 0;
    let remainder = threshold;
    let prev: Point = pt(cubic.anchor0X, cubic.anchor0Y);

    for (let i = 1; i <= this.segments; i++) {
      const progress = i / this.segments;
      const point = cubic.pointOnCurve(progress);
      const segment = ptDistance(ptSub(point, prev));

      if (segment >= remainder) {
        return [
          progress - (1.0 - remainder / segment) / this.segments,
          threshold,
        ];
      }
      remainder -= segment;
      total += segment;
      prev = point;
    }
    return [1.0, total];
  }
}

function cutMeasuredCubicAtProgress(
  mc: MeasuredCubic,
  cutOutlineProgress: number,
  measurer: Measurer,
): [MeasuredCubic, MeasuredCubic] {
  const bounded = Math.max(
    mc.startOutlineProgress,
    Math.min(mc.endOutlineProgress, cutOutlineProgress),
  );
  const outlineProgressSize = mc.endOutlineProgress - mc.startOutlineProgress;
  const progressFromStart = bounded - mc.startOutlineProgress;
  const relativeProgress = progressFromStart / outlineProgressSize;
  const t = measurer.findCubicCutPoint(
    mc.cubic,
    relativeProgress * mc.measuredSize,
  );

  const [c1, c2] = mc.cubic.split(t);
  return [
    {
      cubic: c1,
      startOutlineProgress: mc.startOutlineProgress,
      endOutlineProgress: bounded,
      measuredSize: measurer.measureCubic(c1),
    },
    {
      cubic: c2,
      startOutlineProgress: bounded,
      endOutlineProgress: mc.endOutlineProgress,
      measuredSize: measurer.measureCubic(c2),
    },
  ];
}

function measurePolygon(
  measurer: Measurer,
  polygon: RoundedPolygon,
): MeasuredPolygon {
  const cubics: Cubic[] = [];
  const featureToCubic: [Feature, number][] = [];

  for (const feature of polygon.features) {
    for (let cubicIndex = 0; cubicIndex < feature.cubics.length; cubicIndex++) {
      if (
        feature.type === "corner" &&
        cubicIndex === Math.floor(feature.cubics.length / 2)
      ) {
        featureToCubic.push([feature, cubics.length]);
      }
      cubics.push(feature.cubics[cubicIndex]);
    }
  }

  const measures: number[] = [0];
  let cumulative = 0;
  for (const cubic of cubics) {
    const m = measurer.measureCubic(cubic);
    cumulative += m;
    measures.push(cumulative);
  }
  const totalMeasure = cumulative;

  const outlineProgress = measures.map((m) => m / totalMeasure);

  const features: ProgressableFeature[] = featureToCubic.map(
    ([feature, ix]) => ({
      progress: positiveModulo(
        (outlineProgress[ix] + outlineProgress[ix + 1]) / 2,
        1,
      ),
      feature,
    }),
  );

  const measuredCubics: MeasuredCubic[] = [];
  let startProgress = 0;
  for (let i = 0; i < cubics.length; i++) {
    if (outlineProgress[i + 1] - outlineProgress[i] > DISTANCE_EPSILON) {
      measuredCubics.push({
        cubic: cubics[i],
        startOutlineProgress: startProgress,
        endOutlineProgress: outlineProgress[i + 1],
        measuredSize: measurer.measureCubic(cubics[i]),
      });
      startProgress = outlineProgress[i + 1];
    }
  }
  const lastMeasured = measuredCubics.at(-1);
  if (lastMeasured) {
    lastMeasured.endOutlineProgress = 1;
  }

  return { cubics: measuredCubics, features, measurer };
}

function cutAndShift(
  mp: MeasuredPolygon,
  cuttingPoint: number,
): MeasuredPolygon {
  if (cuttingPoint < DISTANCE_EPSILON) {
    return mp;
  }

  const cubics = mp.cubics;
  let targetIndex = cubics.findIndex(
    (c) =>
      cuttingPoint >= c.startOutlineProgress &&
      cuttingPoint <= c.endOutlineProgress,
  );
  if (targetIndex === -1) {
    targetIndex = cubics.length - 1;
  }

  const [b1, b2] = cutMeasuredCubicAtProgress(
    cubics[targetIndex],
    cuttingPoint,
    mp.measurer,
  );

  const retCubics: Cubic[] = [b2.cubic];
  for (let i = 1; i < cubics.length; i++) {
    retCubics.push(cubics[(i + targetIndex) % cubics.length].cubic);
  }
  retCubics.push(b1.cubic);

  const retOutlineProgress: number[] = [];
  for (let index = 0; index < cubics.length + 2; index++) {
    if (index === 0) {
      retOutlineProgress.push(0);
    } else if (index === cubics.length + 1) {
      retOutlineProgress.push(1);
    } else {
      const cubicIndex = (targetIndex + index - 1) % cubics.length;
      retOutlineProgress.push(
        positiveModulo(cubics[cubicIndex].endOutlineProgress - cuttingPoint, 1),
      );
    }
  }

  const newFeatures: ProgressableFeature[] = mp.features.map((f) => ({
    progress: positiveModulo(f.progress - cuttingPoint, 1),
    feature: f.feature,
  }));

  const measuredCubics: MeasuredCubic[] = [];
  let startProgress = 0;
  for (let i = 0; i < retCubics.length; i++) {
    if (retOutlineProgress[i + 1] - retOutlineProgress[i] > DISTANCE_EPSILON) {
      measuredCubics.push({
        cubic: retCubics[i],
        startOutlineProgress: startProgress,
        endOutlineProgress: retOutlineProgress[i + 1],
        measuredSize: mp.measurer.measureCubic(retCubics[i]),
      });
      startProgress = retOutlineProgress[i + 1];
    }
  }
  const lastCut = measuredCubics.at(-1);
  if (lastCut) {
    lastCut.endOutlineProgress = 1;
  }

  return {
    cubics: measuredCubics,
    features: newFeatures,
    measurer: mp.measurer,
  };
}

function progressInRange(progress: number, from: number, to: number): boolean {
  if (to >= from) {
    return progress >= from && progress <= to;
  }
  return progress >= from || progress <= to;
}

function progressDistance(p1: number, p2: number): number {
  const d = Math.abs(p1 - p2);
  return Math.min(d, 1 - d);
}

function linearMap(xValues: number[], yValues: number[], x: number): number {
  let segStartIndex = 0;
  for (let i = 0; i < xValues.length; i++) {
    if (progressInRange(x, xValues[i], xValues[(i + 1) % xValues.length])) {
      segStartIndex = i;
      break;
    }
  }
  const segEndIndex = (segStartIndex + 1) % xValues.length;
  const segSizeX = positiveModulo(
    xValues[segEndIndex] - xValues[segStartIndex],
    1,
  );
  const segSizeY = positiveModulo(
    yValues[segEndIndex] - yValues[segStartIndex],
    1,
  );
  const posInSeg =
    segSizeX < 0.001
      ? 0.5
      : positiveModulo(x - xValues[segStartIndex], 1) / segSizeX;
  return positiveModulo(yValues[segStartIndex] + segSizeY * posInSeg, 1);
}

class DoubleMapper {
  private readonly sourceValues: number[];
  private readonly targetValues: number[];

  constructor(mappings: [number, number][]) {
    this.sourceValues = mappings.map((m) => m[0]);
    this.targetValues = mappings.map((m) => m[1]);
  }

  map(x: number): number {
    return linearMap(this.sourceValues, this.targetValues, x);
  }

  mapBack(x: number): number {
    return linearMap(this.targetValues, this.sourceValues, x);
  }

  static Identity = new DoubleMapper([
    [0, 0],
    [0.5, 0.5],
  ]);
}

function featureRepresentativePoint(f: Feature): Point {
  const first = f.cubics[0];
  const last = f.cubics.at(-1) ?? first;
  return pt(
    (first.anchor0X + last.anchor1X) / 2,
    (first.anchor0Y + last.anchor1Y) / 2,
  );
}

function featureDistSquared(f1: Feature, f2: Feature): number {
  if (f1.type === "corner" && f2.type === "corner" && f1.convex !== f2.convex) {
    return Number.MAX_VALUE;
  }
  const p1 = featureRepresentativePoint(f1);
  const p2 = featureRepresentativePoint(f2);
  const d = ptSub(p1, p2);
  return d.x * d.x + d.y * d.y;
}

function buildCandidateList(
  features1: ProgressableFeature[],
  features2: ProgressableFeature[],
): { distance: number; f1: ProgressableFeature; f2: ProgressableFeature }[] {
  const result: {
    distance: number;
    f1: ProgressableFeature;
    f2: ProgressableFeature;
  }[] = [];
  for (const f1 of features1) {
    for (const f2 of features2) {
      const d = featureDistSquared(f1.feature, f2.feature);
      if (d !== Number.MAX_VALUE) {
        result.push({ distance: d, f1, f2 });
      }
    }
  }
  result.sort((a, b) => a.distance - b.distance);
  return result;
}

function canInsertMapping(
  mapping: [number, number][],
  insertionIndex: number,
  p1: number,
  p2: number,
): boolean {
  const n = mapping.length;
  if (n === 0) {
    return true;
  }
  const [before1, before2] = mapping[(insertionIndex + n - 1) % n];
  const [after1, after2] = mapping[insertionIndex % n];

  if (
    progressDistance(p1, before1) < DISTANCE_EPSILON ||
    progressDistance(p1, after1) < DISTANCE_EPSILON ||
    progressDistance(p2, before2) < DISTANCE_EPSILON ||
    progressDistance(p2, after2) < DISTANCE_EPSILON
  ) {
    return false;
  }

  return n <= 1 || progressInRange(p2, before2, after2);
}

function doMapping(
  features1: ProgressableFeature[],
  features2: ProgressableFeature[],
): [number, number][] {
  const candidates = buildCandidateList(features1, features2);

  if (candidates.length === 0) {
    return [
      [0, 0],
      [0.5, 0.5],
    ];
  }

  if (candidates.length === 1) {
    const dv = candidates[0];
    return [
      [dv.f1.progress, dv.f2.progress],
      [(dv.f1.progress + 0.5) % 1, (dv.f2.progress + 0.5) % 1],
    ];
  }

  const mapping: [number, number][] = [];
  const usedF1 = new Set<ProgressableFeature>();
  const usedF2 = new Set<ProgressableFeature>();

  for (const dv of candidates) {
    if (usedF1.has(dv.f1) || usedF2.has(dv.f2)) {
      continue;
    }

    let insertionIndex = 0;
    for (let i = 0; i < mapping.length; i++) {
      if (mapping[i][0] < dv.f1.progress) {
        insertionIndex = i + 1;
      }
    }

    if (
      !canInsertMapping(mapping, insertionIndex, dv.f1.progress, dv.f2.progress)
    ) {
      continue;
    }

    mapping.splice(insertionIndex, 0, [dv.f1.progress, dv.f2.progress]);
    usedF1.add(dv.f1);
    usedF2.add(dv.f2);
  }

  return mapping;
}

function featureMapper(
  features1: ProgressableFeature[],
  features2: ProgressableFeature[],
): DoubleMapper {
  const filtered1 = features1.filter((f) => f.feature.type === "corner");
  const filtered2 = features2.filter((f) => f.feature.type === "corner");
  const mapping = doMapping(filtered1, filtered2);
  return new DoubleMapper(mapping);
}

class Morph {
  private readonly morphMatch: [Cubic, Cubic][];

  constructor(start: RoundedPolygon, end: RoundedPolygon) {
    this.morphMatch = matchPolygons(start, end);
  }

  asCubics(progress: number): Cubic[] {
    const result: Cubic[] = [];
    let firstCubic: Cubic | null = null;
    let lastCubic: Cubic | null = null;

    for (const [a, b] of this.morphMatch) {
      const points = new Float64Array(8);
      for (let j = 0; j < 8; j++) {
        points[j] = interpolate(a.points[j], b.points[j], progress);
      }
      const cubic = new Cubic(points);
      if (!firstCubic) {
        firstCubic = cubic;
      }
      if (lastCubic) {
        result.push(lastCubic);
      }
      lastCubic = cubic;
    }

    if (lastCubic && firstCubic) {
      result.push(
        new Cubic(
          lastCubic.anchor0X,
          lastCubic.anchor0Y,
          lastCubic.control0X,
          lastCubic.control0Y,
          lastCubic.control1X,
          lastCubic.control1Y,
          firstCubic.anchor0X,
          firstCubic.anchor0Y,
        ),
      );
    }

    return result;
  }
}

function matchPolygons(
  p1: RoundedPolygon,
  p2: RoundedPolygon,
): [Cubic, Cubic][] {
  const measurer = new LengthMeasurer();
  const measuredPolygon1 = measurePolygon(measurer, p1);
  const measuredPolygon2 = measurePolygon(measurer, p2);

  const doubleMapper = featureMapper(
    measuredPolygon1.features,
    measuredPolygon2.features,
  );

  const polygon2CutPoint = doubleMapper.map(0);

  const bs1 = measuredPolygon1;
  const bs2 = cutAndShift(measuredPolygon2, polygon2CutPoint);

  const ret: [Cubic, Cubic][] = [];
  let i1 = 0;
  let i2 = 0;
  let b1: MeasuredCubic | null = bs1.cubics[i1++] ?? null;
  let b2: MeasuredCubic | null = bs2.cubics[i2++] ?? null;

  while (b1 !== null && b2 !== null) {
    const b1a = i1 === bs1.cubics.length ? 1 : b1.endOutlineProgress;
    const b2a =
      i2 === bs2.cubics.length
        ? 1
        : doubleMapper.mapBack(
            positiveModulo(b2.endOutlineProgress + polygon2CutPoint, 1),
          );

    const minb = Math.min(b1a, b2a);

    let seg1: MeasuredCubic;
    let newb1: MeasuredCubic | null;
    if (b1a > minb + ANGLE_EPSILON) {
      const [s, n] = cutMeasuredCubicAtProgress(b1, minb, measurer);
      seg1 = s;
      newb1 = n;
    } else {
      seg1 = b1;
      newb1 = bs1.cubics[i1++] ?? null;
    }

    let seg2: MeasuredCubic;
    let newb2: MeasuredCubic | null;
    if (b2a > minb + ANGLE_EPSILON) {
      const [s, n] = cutMeasuredCubicAtProgress(
        b2,
        positiveModulo(doubleMapper.map(minb) - polygon2CutPoint, 1),
        measurer,
      );
      seg2 = s;
      newb2 = n;
    } else {
      seg2 = b2;
      newb2 = bs2.cubics[i2++] ?? null;
    }

    ret.push([seg1.cubic, seg2.cubic]);
    b1 = newb1;
    b2 = newb2;
  }

  return ret;
}

export { Morph };
