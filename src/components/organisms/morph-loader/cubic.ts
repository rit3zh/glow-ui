import { DISTANCE_EPSILON, RELAXED_DISTANCE_EPSILON } from "./const";
import type { Feature, Point } from "./types";
import {
  collinearIsh,
  directionVector,
  distance,
  interpolate,
  convex as isConvex,
  pt,
  ptRotate90,
} from "./utils";

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

class Cubic {
  readonly points: Float64Array;

  constructor(points: Float64Array);
  constructor(
    ax0: number,
    ay0: number,
    cx0: number,
    cy0: number,
    cx1: number,
    cy1: number,
    ax1: number,
    ay1: number,
  );
  constructor(
    a: Float64Array | number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
    g?: number,
    h?: number,
  ) {
    if (a instanceof Float64Array) {
      this.points = a;
    } else {
      this.points = new Float64Array([
        a,
        b as number,
        c as number,
        d as number,
        e as number,
        f as number,
        g as number,
        h as number,
      ]);
    }
  }

  get anchor0X(): number {
    return this.points[0];
  }
  get anchor0Y(): number {
    return this.points[1];
  }
  get control0X(): number {
    return this.points[2];
  }
  get control0Y(): number {
    return this.points[3];
  }
  get control1X(): number {
    return this.points[4];
  }
  get control1Y(): number {
    return this.points[5];
  }
  get anchor1X(): number {
    return this.points[6];
  }
  get anchor1Y(): number {
    return this.points[7];
  }

  pointOnCurve(t: number): Point {
    const u = 1 - t;
    return pt(
      this.anchor0X * (u * u * u) +
        this.control0X * (3 * t * u * u) +
        this.control1X * (3 * t * t * u) +
        this.anchor1X * (t * t * t),
      this.anchor0Y * (u * u * u) +
        this.control0Y * (3 * t * u * u) +
        this.control1Y * (3 * t * t * u) +
        this.anchor1Y * (t * t * t),
    );
  }

  zeroLength(): boolean {
    return (
      Math.abs(this.anchor0X - this.anchor1X) < DISTANCE_EPSILON &&
      Math.abs(this.anchor0Y - this.anchor1Y) < DISTANCE_EPSILON
    );
  }

  convexTo(next: Cubic): boolean {
    const prevVertex = pt(this.anchor0X, this.anchor0Y);
    const currVertex = pt(this.anchor1X, this.anchor1Y);
    const nextVertex = pt(next.anchor1X, next.anchor1Y);
    return isConvex(prevVertex, currVertex, nextVertex);
  }

  split(t: number): [Cubic, Cubic] {
    const u = 1 - t;
    const poc = this.pointOnCurve(t);
    return [
      new Cubic(
        this.anchor0X,
        this.anchor0Y,
        this.anchor0X * u + this.control0X * t,
        this.anchor0Y * u + this.control0Y * t,
        this.anchor0X * (u * u) +
          this.control0X * (2 * u * t) +
          this.control1X * (t * t),
        this.anchor0Y * (u * u) +
          this.control0Y * (2 * u * t) +
          this.control1Y * (t * t),
        poc.x,
        poc.y,
      ),
      new Cubic(
        poc.x,
        poc.y,
        this.control0X * (u * u) +
          this.control1X * (2 * u * t) +
          this.anchor1X * (t * t),
        this.control0Y * (u * u) +
          this.control1Y * (2 * u * t) +
          this.anchor1Y * (t * t),
        this.control1X * u + this.anchor1X * t,
        this.control1Y * u + this.anchor1Y * t,
        this.anchor1X,
        this.anchor1Y,
      ),
    ];
  }

  reverse(): Cubic {
    return new Cubic(
      this.anchor1X,
      this.anchor1Y,
      this.control1X,
      this.control1Y,
      this.control0X,
      this.control0Y,
      this.anchor0X,
      this.anchor0Y,
    );
  }

  transformed(f: (x: number, y: number) => Point): Cubic {
    const newPoints = new Float64Array(8);
    for (let i = 0; i < 8; i += 2) {
      const r = f(this.points[i], this.points[i + 1]);
      newPoints[i] = r.x;
      newPoints[i + 1] = r.y;
    }
    return new Cubic(newPoints);
  }

  calculateBounds(approximate = true): [number, number, number, number] {
    if (this.zeroLength()) {
      return [this.anchor0X, this.anchor0Y, this.anchor0X, this.anchor0Y];
    }

    let minX = Math.min(this.anchor0X, this.anchor1X);
    let minY = Math.min(this.anchor0Y, this.anchor1Y);
    let maxX = Math.max(this.anchor0X, this.anchor1X);
    let maxY = Math.max(this.anchor0Y, this.anchor1Y);

    if (approximate) {
      return [
        Math.min(minX, Math.min(this.control0X, this.control1X)),
        Math.min(minY, Math.min(this.control0Y, this.control1Y)),
        Math.max(maxX, Math.max(this.control0X, this.control1X)),
        Math.max(maxY, Math.max(this.control0Y, this.control1Y)),
      ];
    }

    const xCoeffs = [
      -this.anchor0X + 3 * this.control0X - 3 * this.control1X + this.anchor1X,
      2 * this.anchor0X - 4 * this.control0X + 2 * this.control1X,
      -this.anchor0X + this.control0X,
    ] as const;

    for (const t of axisExtremaTs(...xCoeffs)) {
      const v = this.pointOnCurve(t).x;
      minX = Math.min(minX, v);
      maxX = Math.max(maxX, v);
    }

    const yCoeffs = [
      -this.anchor0Y + 3 * this.control0Y - 3 * this.control1Y + this.anchor1Y,
      2 * this.anchor0Y - 4 * this.control0Y + 2 * this.control1Y,
      -this.anchor0Y + this.control0Y,
    ] as const;

    for (const t of axisExtremaTs(...yCoeffs)) {
      const v = this.pointOnCurve(t).y;
      minY = Math.min(minY, v);
      maxY = Math.max(maxY, v);
    }

    return [minX, minY, maxX, maxY];
  }

  static straightLine(x0: number, y0: number, x1: number, y1: number): Cubic {
    return new Cubic(
      x0,
      y0,
      interpolate(x0, x1, 1 / 3),
      interpolate(y0, y1, 1 / 3),
      interpolate(x0, x1, 2 / 3),
      interpolate(y0, y1, 2 / 3),
      x1,
      y1,
    );
  }

  static circularArc(
    centerX: number,
    centerY: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ): Cubic {
    const p0d = directionVector(x0 - centerX, y0 - centerY);
    const p1d = directionVector(x1 - centerX, y1 - centerY);
    const rotatedP0 = ptRotate90(p0d);
    const rotatedP1 = ptRotate90(p1d);
    const clockwise =
      rotatedP0.x * (x1 - centerX) + rotatedP0.y * (y1 - centerY) >= 0;
    const cosa = p0d.x * p1d.x + p0d.y * p1d.y;
    if (cosa > 0.999) {
      return Cubic.straightLine(x0, y0, x1, y1);
    }
    const k =
      ((distance(x0 - centerX, y0 - centerY) *
        4 *
        (Math.sqrt(2 * (1 - cosa)) - Math.sqrt(1 - cosa * cosa))) /
        (3 * (1 - cosa))) *
      (clockwise ? 1 : -1);
    return new Cubic(
      x0,
      y0,
      x0 + rotatedP0.x * k,
      y0 + rotatedP0.y * k,
      x1 - rotatedP1.x * k,
      y1 - rotatedP1.y * k,
      x1,
      y1,
    );
  }

  static empty(x0: number, y0: number): Cubic {
    return new Cubic(x0, y0, x0, y0, x0, y0, x0, y0);
  }
}

function straightIsh(c: Cubic): boolean {
  return (
    !c.zeroLength() &&
    collinearIsh(
      c.anchor0X,
      c.anchor0Y,
      c.anchor1X,
      c.anchor1Y,
      c.control0X,
      c.control0Y,
      RELAXED_DISTANCE_EPSILON,
    ) &&
    collinearIsh(
      c.anchor0X,
      c.anchor0Y,
      c.anchor1X,
      c.anchor1Y,
      c.control1X,
      c.control1Y,
      RELAXED_DISTANCE_EPSILON,
    )
  );
}

function smoothesIntoIsh(c: Cubic, next: Cubic): boolean {
  return collinearIsh(
    c.control1X,
    c.control1Y,
    next.control0X,
    next.control0Y,
    c.anchor1X,
    c.anchor1Y,
    RELAXED_DISTANCE_EPSILON,
  );
}

function alignsIshWith(c: Cubic, next: Cubic): boolean {
  return (
    (straightIsh(c) && straightIsh(next) && smoothesIntoIsh(c, next)) ||
    c.zeroLength() ||
    next.zeroLength()
  );
}

function extendCubic(a: Cubic, b: Cubic): Cubic {
  if (a.zeroLength()) {
    return new Cubic(
      a.anchor0X,
      a.anchor0Y,
      b.control0X,
      b.control0Y,
      b.control1X,
      b.control1Y,
      b.anchor1X,
      b.anchor1Y,
    );
  }
  return new Cubic(
    a.anchor0X,
    a.anchor0Y,
    a.control0X,
    a.control0Y,
    a.control1X,
    a.control1Y,
    b.anchor1X,
    b.anchor1Y,
  );
}

function cubicAsFeature(c: Cubic, next: Cubic): Feature {
  if (straightIsh(c)) {
    return { type: "edge", cubics: [c] };
  }
  return { type: "corner", cubics: [c], convex: c.convexTo(next) };
}

function detectFeatures(cubics: Cubic[]): Feature[] {
  if (cubics.length === 0) {
    return [];
  }
  const result: Feature[] = [];
  let current = cubics[0];

  for (let i = 0; i < cubics.length; i++) {
    const next = cubics[(i + 1) % cubics.length];
    if (i < cubics.length - 1 && alignsIshWith(current, next)) {
      current = extendCubic(current, next);
      continue;
    }
    result.push(cubicAsFeature(current, next));
    if (!smoothesIntoIsh(current, next)) {
      result.push(
        cubicAsFeature(Cubic.empty(current.anchor1X, current.anchor1Y), next),
      );
    }
    current = next;
  }
  return result;
}

function featureTransformed(
  f: Feature,
  transform: (x: number, y: number) => Point,
): Feature {
  const newCubics = f.cubics.map((c) => c.transformed(transform));
  if (f.type === "edge") {
    return { type: "edge", cubics: newCubics };
  }
  return { type: "corner", cubics: newCubics, convex: f.convex };
}

function featureReversed(f: Feature): Feature {
  const reversedCubics = [...f.cubics].reverse().map((c) => c.reverse());
  if (f.type === "edge") {
    return { type: "edge", cubics: reversedCubics };
  }
  return { type: "corner", cubics: reversedCubics, convex: !f.convex };
}

export {
  Cubic,
  straightIsh,
  smoothesIntoIsh,
  alignsIshWith,
  cubicAsFeature,
  detectFeatures,
  featureTransformed,
  featureReversed,
};
