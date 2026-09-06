import { DISTANCE_EPSILON, FLOAT_PI } from "./const";
import { Cubic, featureTransformed } from "./cubic";
import type { CornerRounding, Feature, Point } from "./types";
import {
  directionVector,
  distance,
  distanceSquared,
  interpolatePoint,
  pt,
  ptAdd,
  ptDirection,
  ptDistance,
  ptDiv,
  ptDot,
  ptMul,
  ptRotate90,
  ptSub,
  radialToCartesian,
  square,
} from "./utils";

const unrounded: CornerRounding = { radius: 0, smoothing: 0 };

function cornerRounding(radius: number, smoothing = 0): CornerRounding {
  return { radius, smoothing };
}

class RoundedPolygon {
  readonly features: Feature[];
  readonly center: Point;
  readonly cubics: Cubic[];

  constructor(features: Feature[], center: Point) {
    this.features = features;
    this.center = center;
    this.cubics = buildCubicList(features, center);
  }

  get centerX(): number {
    return this.center.x;
  }
  get centerY(): number {
    return this.center.y;
  }

  transformed(f: (x: number, y: number) => Point): RoundedPolygon {
    const newCenter = f(this.center.x, this.center.y);
    const newFeatures = this.features.map((feat) =>
      featureTransformed(feat, f),
    );
    return new RoundedPolygon(newFeatures, newCenter);
  }

  normalized(): RoundedPolygon {
    const bounds = this.calculateBounds();
    const width = bounds[2] - bounds[0];
    const height = bounds[3] - bounds[1];
    const side = Math.max(width, height);
    const offsetX = (side - width) / 2 - bounds[0];
    const offsetY = (side - height) / 2 - bounds[1];
    return this.transformed((x, y) =>
      pt((x + offsetX) / side, (y + offsetY) / side),
    );
  }

  calculateBounds(approximate = true): [number, number, number, number] {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = -Number.MAX_VALUE;
    let maxY = -Number.MAX_VALUE;
    for (const cubic of this.cubics) {
      const b = cubic.calculateBounds(approximate);
      minX = Math.min(minX, b[0]);
      minY = Math.min(minY, b[1]);
      maxX = Math.max(maxX, b[2]);
      maxY = Math.max(maxY, b[3]);
    }
    return [minX, minY, maxX, maxY];
  }

  calculateMaxBounds(): [number, number, number, number] {
    let maxDistSq = 0;
    for (const cubic of this.cubics) {
      const anchorDist = distanceSquared(
        cubic.anchor0X - this.centerX,
        cubic.anchor0Y - this.centerY,
      );
      const mid = cubic.pointOnCurve(0.5);
      const midDist = distanceSquared(
        mid.x - this.centerX,
        mid.y - this.centerY,
      );
      maxDistSq = Math.max(maxDistSq, Math.max(anchorDist, midDist));
    }
    const d = Math.sqrt(maxDistSq);
    return [
      this.centerX - d,
      this.centerY - d,
      this.centerX + d,
      this.centerY + d,
    ];
  }
}

function resolveFeatureCubics(
  features: Feature[],
  index: number,
  splitStart: Cubic[] | null,
  splitEnd: Cubic[] | null,
): Cubic[] | null {
  if (index === 0 && splitEnd) {
    return splitEnd;
  }
  if (index === features.length) {
    return splitStart;
  }
  return features[index].cubics;
}

function processCubic(
  cubic: Cubic,
  state: { first: Cubic | null; last: Cubic | null; result: Cubic[] },
): void {
  if (cubic.zeroLength()) {
    if (state.last) {
      const newPoints: Float64Array = new Float64Array(state.last.points);
      newPoints[6] = cubic.anchor1X;
      newPoints[7] = cubic.anchor1Y;
      state.last = new Cubic(newPoints);
    }
    return;
  }
  if (state.last) {
    state.result.push(state.last);
  }
  state.last = cubic;
  if (!state.first) {
    state.first = cubic;
  }
}

function buildCubicList(features: Feature[], center: Point): Cubic[] {
  let splitStart: Cubic[] | null = null;
  let splitEnd: Cubic[] | null = null;

  if (features.length > 0 && features[0].cubics.length === 3) {
    const centerCubic = features[0].cubics[1];
    const [start, end] = centerCubic.split(0.5);
    splitStart = [features[0].cubics[0], start];
    splitEnd = [end, features[0].cubics[2]];
  }

  const state = {
    first: null as Cubic | null,
    last: null as Cubic | null,
    result: [] as Cubic[],
  };

  for (let i = 0; i <= features.length; i++) {
    const featureCubics = resolveFeatureCubics(
      features,
      i,
      splitStart,
      splitEnd,
    );
    if (!featureCubics) {
      break;
    }
    for (const cubic of featureCubics) {
      processCubic(cubic, state);
    }
  }

  if (state.last && state.first) {
    state.result.push(
      new Cubic(
        state.last.anchor0X,
        state.last.anchor0Y,
        state.last.control0X,
        state.last.control0Y,
        state.last.control1X,
        state.last.control1Y,
        state.first.anchor0X,
        state.first.anchor0Y,
      ),
    );
  } else {
    state.result.push(Cubic.empty(center.x, center.y));
  }

  return state.result;
}

class RoundedCorner {
  d1: Point;
  d2: Point;
  cornerRadius: number;
  smoothing: number;
  cosAngle: number;
  sinAngle: number;
  expectedRoundCut: number;
  center: Point = pt(0, 0);
  p0: Point;
  p1: Point;
  p2: Point;

  constructor(p0: Point, p1: Point, p2: Point, rounding: CornerRounding) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    const v01 = ptSub(p0, p1);
    const v21 = ptSub(p2, p1);
    const d01 = ptDistance(v01);
    const d21 = ptDistance(v21);

    if (d01 > 0 && d21 > 0) {
      this.d1 = ptDiv(v01, d01);
      this.d2 = ptDiv(v21, d21);
      this.cornerRadius = rounding.radius;
      this.smoothing = rounding.smoothing;
      this.cosAngle = ptDot(this.d1, this.d2);
      this.sinAngle = Math.sqrt(1 - square(this.cosAngle));
      this.expectedRoundCut =
        this.sinAngle > 1e-3
          ? (this.cornerRadius * (this.cosAngle + 1)) / this.sinAngle
          : 0;
    } else {
      this.d1 = pt(0, 0);
      this.d2 = pt(0, 0);
      this.cornerRadius = 0;
      this.smoothing = 0;
      this.cosAngle = 0;
      this.sinAngle = 0;
      this.expectedRoundCut = 0;
    }
  }

  get expectedCut(): number {
    return (1 + this.smoothing) * this.expectedRoundCut;
  }

  private calculateActualSmoothingValue(allowedCut: number): number {
    if (allowedCut > this.expectedCut) {
      return this.smoothing;
    }
    if (allowedCut > this.expectedRoundCut) {
      return (
        (this.smoothing * (allowedCut - this.expectedRoundCut)) /
        (this.expectedCut - this.expectedRoundCut)
      );
    }
    return 0;
  }

  private lineIntersection(
    p0: Point,
    d0: Point,
    p1: Point,
    d1: Point,
  ): Point | null {
    const rotatedD1 = ptRotate90(d1);
    const den = ptDot(d0, rotatedD1);
    if (Math.abs(den) < DISTANCE_EPSILON) {
      return null;
    }
    const diff = ptSub(p1, p0);
    const num = ptDot(diff, rotatedD1);
    if (Math.abs(den) < DISTANCE_EPSILON * Math.abs(num)) {
      return null;
    }
    const k = num / den;
    return ptAdd(p0, ptMul(d0, k));
  }

  private computeFlankingCurve(
    actualRoundCut: number,
    actualSmoothingValues: number,
    corner: Point,
    sideStart: Point,
    circleSegmentIntersection: Point,
    otherCircleSegmentIntersection: Point,
    circleCenter: Point,
    actualR: number,
  ): Cubic {
    const sideDirection = ptDirection(ptSub(sideStart, corner));
    const curveStart = ptAdd(
      corner,
      ptMul(sideDirection, actualRoundCut * (1 + actualSmoothingValues)),
    );
    const p = interpolatePoint(
      circleSegmentIntersection,
      ptDiv(
        ptAdd(circleSegmentIntersection, otherCircleSegmentIntersection),
        2,
      ),
      actualSmoothingValues,
    );
    const curveEnd = ptAdd(
      circleCenter,
      ptMul(
        directionVector(p.x - circleCenter.x, p.y - circleCenter.y),
        actualR,
      ),
    );
    const circleTangent = ptRotate90(ptSub(curveEnd, circleCenter));
    const anchorEnd =
      this.lineIntersection(
        sideStart,
        sideDirection,
        curveEnd,
        circleTangent,
      ) ?? circleSegmentIntersection;
    const anchorStart = ptDiv(ptAdd(curveStart, ptMul(anchorEnd, 2)), 3);
    return new Cubic(
      curveStart.x,
      curveStart.y,
      anchorStart.x,
      anchorStart.y,
      anchorEnd.x,
      anchorEnd.y,
      curveEnd.x,
      curveEnd.y,
    );
  }

  getCubics(allowedCut0: number, allowedCut1: number = allowedCut0): Cubic[] {
    const allowedCut = Math.min(allowedCut0, allowedCut1);
    if (
      this.expectedRoundCut < DISTANCE_EPSILON ||
      allowedCut < DISTANCE_EPSILON ||
      this.cornerRadius < DISTANCE_EPSILON
    ) {
      this.center = this.p1;
      return [Cubic.straightLine(this.p1.x, this.p1.y, this.p1.x, this.p1.y)];
    }

    const actualRoundCut = Math.min(allowedCut, this.expectedRoundCut);
    const actualSmoothing0 = this.calculateActualSmoothingValue(allowedCut0);
    const actualSmoothing1 = this.calculateActualSmoothingValue(allowedCut1);
    const actualR =
      this.cornerRadius * (actualRoundCut / this.expectedRoundCut);
    const centerDistance = Math.sqrt(square(actualR) + square(actualRoundCut));
    const halfDir = ptDiv(ptAdd(this.d1, this.d2), 2);
    const halfDirNorm = ptDirection(halfDir);
    this.center = ptAdd(this.p1, ptMul(halfDirNorm, centerDistance));
    const circleIntersection0 = ptAdd(this.p1, ptMul(this.d1, actualRoundCut));
    const circleIntersection2 = ptAdd(this.p1, ptMul(this.d2, actualRoundCut));

    const flanking0 = this.computeFlankingCurve(
      actualRoundCut,
      actualSmoothing0,
      this.p1,
      this.p0,
      circleIntersection0,
      circleIntersection2,
      this.center,
      actualR,
    );
    const flanking2 = this.computeFlankingCurve(
      actualRoundCut,
      actualSmoothing1,
      this.p1,
      this.p2,
      circleIntersection2,
      circleIntersection0,
      this.center,
      actualR,
    ).reverse();

    return [
      flanking0,
      Cubic.circularArc(
        this.center.x,
        this.center.y,
        flanking0.anchor1X,
        flanking0.anchor1Y,
        flanking2.anchor0X,
        flanking2.anchor0Y,
      ),
      flanking2,
    ];
  }
}

function calculateCenter(vertices: number[]): Point {
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < vertices.length; i += 2) {
    cx += vertices[i];
    cy += vertices[i + 1];
  }
  const n = vertices.length / 2;
  return pt(cx / n, cy / n);
}

function verticesFromNumVerts(
  numVertices: number,
  radius: number,
  centerX: number,
  centerY: number,
): number[] {
  const result: number[] = [];
  for (let i = 0; i < numVertices; i++) {
    const v = radialToCartesian(
      radius,
      (FLOAT_PI / numVertices) * 2 * i,
      pt(centerX, centerY),
    );
    result.push(v.x, v.y);
  }
  return result;
}

function createPolygonFromVertices(
  vertices: number[],
  rounding: CornerRounding = unrounded,
  perVertexRounding: CornerRounding[] | null = null,
  centerX: number = Number.MIN_VALUE,
  centerY: number = Number.MIN_VALUE,
): RoundedPolygon {
  const n = vertices.length / 2;
  const roundedCorners: RoundedCorner[] = [];

  for (let i = 0; i < n; i++) {
    const vtxRounding = perVertexRounding?.[i] ?? rounding;
    const prevIndex = ((i + n - 1) % n) * 2;
    const nextIndex = ((i + 1) % n) * 2;
    roundedCorners.push(
      new RoundedCorner(
        pt(vertices[prevIndex], vertices[prevIndex + 1]),
        pt(vertices[i * 2], vertices[i * 2 + 1]),
        pt(vertices[nextIndex], vertices[nextIndex + 1]),
        vtxRounding,
      ),
    );
  }

  const cutAdjusts: [number, number][] = [];
  for (let ix = 0; ix < n; ix++) {
    const expectedRoundCut =
      roundedCorners[ix].expectedRoundCut +
      roundedCorners[(ix + 1) % n].expectedRoundCut;
    const expectedCut =
      roundedCorners[ix].expectedCut + roundedCorners[(ix + 1) % n].expectedCut;
    const vtxX = vertices[ix * 2];
    const vtxY = vertices[ix * 2 + 1];
    const nextVtxX = vertices[((ix + 1) % n) * 2];
    const nextVtxY = vertices[((ix + 1) % n) * 2 + 1];
    const sideSize = distance(vtxX - nextVtxX, vtxY - nextVtxY);

    if (expectedRoundCut > sideSize) {
      cutAdjusts.push([sideSize / expectedRoundCut, 0]);
    } else if (expectedCut > sideSize) {
      cutAdjusts.push([
        1,
        (sideSize - expectedRoundCut) / (expectedCut - expectedRoundCut),
      ]);
    } else {
      cutAdjusts.push([1, 1]);
    }
  }

  const corners: Cubic[][] = [];
  for (let i = 0; i < n; i++) {
    const allowedCuts: number[] = [];
    for (let delta = 0; delta <= 1; delta++) {
      const [roundCutRatio, cutRatio] = cutAdjusts[(i + n - 1 + delta) % n];
      allowedCuts.push(
        roundedCorners[i].expectedRoundCut * roundCutRatio +
          (roundedCorners[i].expectedCut - roundedCorners[i].expectedRoundCut) *
            cutRatio,
      );
    }
    corners.push(roundedCorners[i].getCubics(allowedCuts[0], allowedCuts[1]));
  }

  const tempFeatures: Feature[] = [];
  for (let i = 0; i < n; i++) {
    const prevVtxIndex = (i + n - 1) % n;
    const nextVtxIndex = (i + 1) % n;
    const currVertex = pt(vertices[i * 2], vertices[i * 2 + 1]);
    const prevVertex = pt(
      vertices[prevVtxIndex * 2],
      vertices[prevVtxIndex * 2 + 1],
    );
    const nextVertex = pt(
      vertices[nextVtxIndex * 2],
      vertices[nextVtxIndex * 2 + 1],
    );
    const isConvex = convexFn(prevVertex, currVertex, nextVertex);
    tempFeatures.push({ type: "corner", cubics: corners[i], convex: isConvex });
    tempFeatures.push({
      type: "edge",
      cubics: [
        Cubic.straightLine(
          corners[i][corners[i].length - 1].anchor1X,
          corners[i][corners[i].length - 1].anchor1Y,
          corners[(i + 1) % n][0].anchor0X,
          corners[(i + 1) % n][0].anchor0Y,
        ),
      ],
    });
  }

  const center =
    centerX === Number.MIN_VALUE || centerY === Number.MIN_VALUE
      ? calculateCenter(vertices)
      : pt(centerX, centerY);

  return new RoundedPolygon(tempFeatures, center);
}

function convexFn(prev: Point, curr: Point, next: Point): boolean {
  const v1 = ptSub(curr, prev);
  const v2 = ptSub(next, curr);
  return v1.x * v2.y - v1.y * v2.x > 0;
}

function createPolygon(
  numVertices: number,
  radius = 1,
  centerX = 0,
  centerY = 0,
  rounding: CornerRounding = unrounded,
  perVertexRounding: CornerRounding[] | null = null,
): RoundedPolygon {
  const vertices = verticesFromNumVerts(numVertices, radius, centerX, centerY);
  return createPolygonFromVertices(
    vertices,
    rounding,
    perVertexRounding,
    centerX,
    centerY,
  );
}

function createCircle(
  numVertices = 8,
  radius = 1,
  centerX = 0,
  centerY = 0,
): RoundedPolygon {
  const theta = FLOAT_PI / numVertices;
  const polygonRadius = radius / Math.cos(theta);
  return createPolygon(
    numVertices,
    polygonRadius,
    centerX,
    centerY,
    cornerRounding(radius),
  );
}

function createRectangle(
  width = 2,
  height = 2,
  rounding: CornerRounding = unrounded,
  perVertexRounding: CornerRounding[] | null = null,
  centerX = 0,
  centerY = 0,
): RoundedPolygon {
  const left = centerX - width / 2;
  const top = centerY - height / 2;
  const right = centerX + width / 2;
  const bottom = centerY + height / 2;
  return createPolygonFromVertices(
    [right, bottom, left, bottom, left, top, right, top],
    rounding,
    perVertexRounding,
    centerX,
    centerY,
  );
}

function starVerticesFromNumVerts(
  numVerticesPerRadius: number,
  radius: number,
  innerRadius: number,
  centerX: number,
  centerY: number,
): number[] {
  const result: number[] = [];
  for (let i = 0; i < numVerticesPerRadius; i++) {
    let v = radialToCartesian(
      radius,
      (FLOAT_PI / numVerticesPerRadius) * 2 * i,
    );
    result.push(v.x + centerX, v.y + centerY);
    v = radialToCartesian(
      innerRadius,
      (FLOAT_PI / numVerticesPerRadius) * (2 * i + 1),
    );
    result.push(v.x + centerX, v.y + centerY);
  }
  return result;
}

function createStar(
  numVerticesPerRadius: number,
  radius = 1,
  innerRadius = 0.5,
  rounding: CornerRounding = unrounded,
  innerRounding: CornerRounding | null = null,
  perVertexRounding: CornerRounding[] | null = null,
  centerX = 0,
  centerY = 0,
): RoundedPolygon {
  let pvRounding = perVertexRounding;
  if (!pvRounding && innerRounding) {
    pvRounding = [];
    for (let i = 0; i < numVerticesPerRadius; i++) {
      pvRounding.push(rounding, innerRounding);
    }
  }
  const vertices = starVerticesFromNumVerts(
    numVerticesPerRadius,
    radius,
    innerRadius,
    centerX,
    centerY,
  );
  return createPolygonFromVertices(
    vertices,
    rounding,
    pvRounding,
    centerX,
    centerY,
  );
}

export {
  unrounded,
  cornerRounding,
  RoundedPolygon,
  createPolygonFromVertices,
  createPolygon,
  createCircle,
  createRectangle,
  createStar,
};
