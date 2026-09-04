import { ANGLE_ORIGIN, TAU, TICK_STEPS } from "./const";
import type {
  IRadarChartDomain,
  IRadarChartSeries,
  IRadarChartVertex,
} from "./types";

function lerp(from: number, to: number, progress: number): number {
  "worklet";
  return from + (to - from) * progress;
}

function clamp(value: number, low: number, high: number): number {
  "worklet";
  return Math.min(Math.max(value, low), high);
}

function toRadians(degrees: number): number {
  "worklet";
  return (degrees * Math.PI) / 180;
}

function niceStep(rawStep: number): number {
  if (rawStep <= 0) return 1;
  const exponent = Math.floor(Math.log10(rawStep));
  const magnitude = Math.pow(10, exponent);
  const fraction = rawStep / magnitude;
  for (const step of TICK_STEPS) {
    if (fraction <= step + 1e-9) return step * magnitude;
  }
  return 10 * magnitude;
}

function toDomain(
  data: readonly IRadarChartSeries[],
  levels: number,
  maxValue?: number,
): IRadarChartDomain {
  const rings = Math.max(1, Math.floor(levels));
  let highest = 0;
  for (const series of data) {
    for (const value of series.values) if (value > highest) highest = value;
  }

  const step =
    maxValue != null ? maxValue / rings : niceStep(highest / rings) || 1;
  const max = maxValue != null ? maxValue : step * rings;

  const ticks: number[] = [];
  for (let i = 1; i <= rings; i++)
    ticks.push(Math.round(step * i * 1e10) / 1e10);
  return { min: 0, max: max || 1, ticks };
}

function toAngles(count: number, startAngle: number): number[] {
  if (count < 1) return [];
  const step = TAU / count;
  const angles: number[] = [];
  for (let i = 0; i < count; i++) angles.push(startAngle + step * i);
  return angles;
}

function polar(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
): IRadarChartVertex {
  "worklet";
  const theta = ANGLE_ORIGIN + angle;
  return {
    x: centerX + radius * Math.cos(theta),
    y: centerY + radius * Math.sin(theta),
  };
}

function valueToRadius(
  value: number,
  domainMin: number,
  domainMax: number,
  radius: number,
): number {
  "worklet";
  const span = domainMax - domainMin || 1;
  return clamp(((value - domainMin) / span) * radius, 0, radius);
}

function polygonPath(vertices: readonly IRadarChartVertex[]): string {
  "worklet";
  if (vertices.length < 2) return "M 0 0";

  let path = `M ${vertices[0]!.x} ${vertices[0]!.y}`;
  for (let i = 1; i < vertices.length; i++) {
    path += ` L ${vertices[i]!.x} ${vertices[i]!.y}`;
  }
  return `${path} Z`;
}

function buildRingPath(
  centerX: number,
  centerY: number,
  radius: number,
  angles: readonly number[],
): string {
  if (angles.length < 2 || radius <= 0) return "";

  const vertices: IRadarChartVertex[] = [];
  for (const angle of angles) {
    vertices.push(polar(centerX, centerY, radius, angle));
  }
  return polygonPath(vertices);
}

function buildGridPath(
  domain: IRadarChartDomain,
  centerX: number,
  centerY: number,
  radius: number,
  angles: readonly number[],
): string {
  if (angles.length < 2 || radius <= 0) return "";

  const span = domain.max - domain.min || 1;
  let path = "";
  for (const tick of domain.ticks) {
    const ringRadius = ((tick - domain.min) / span) * radius;
    path += `${buildRingPath(centerX, centerY, ringRadius, angles)} `;
  }
  return path.trim();
}

function buildAxesPath(
  centerX: number,
  centerY: number,
  radius: number,
  angles: readonly number[],
): string {
  if (angles.length === 0 || radius <= 0) return "";

  let path = "";
  for (const angle of angles) {
    const outer = polar(centerX, centerY, radius, angle);
    path += `M ${centerX} ${centerY} L ${outer.x} ${outer.y} `;
  }
  return path.trim();
}

function indexForPoint(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  count: number,
  startAngle: number,
): number {
  "worklet";
  if (count < 1) return -1;

  const raw = Math.atan2(y - centerY, x - centerX) - ANGLE_ORIGIN - startAngle;
  const angle = ((raw % TAU) + TAU) % TAU;
  return Math.round(angle / (TAU / count)) % count;
}

function staggerProgress(
  progress: number,
  index: number,
  count: number,
  spread: number,
): number {
  "worklet";
  if (count < 2 || spread <= 0) return clamp(progress, 0, 1);

  const window = 1 / (1 + (count - 1) * spread);
  const start = index * spread * window;
  return clamp((progress - start) / window, 0, 1);
}

function colorAt(colors: readonly string[], index: number): string {
  return colors[index % colors.length] ?? colors[0]!;
}

export {
  lerp,
  clamp,
  toRadians,
  niceStep,
  toDomain,
  toAngles,
  polar,
  valueToRadius,
  polygonPath,
  buildRingPath,
  buildGridPath,
  buildAxesPath,
  indexForPoint,
  staggerProgress,
  colorAt,
};
