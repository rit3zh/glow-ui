import { ANGLE_ORIGIN, EPSILON, TAU } from "./const";
import type {
  IRadialChartBand,
  IRadialChartPoint,
  IRadialChartRing,
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

function toRings(
  data: readonly IRadialChartPoint[],
  maxValue: number,
): IRadialChartRing[] {
  const rings: IRadialChartRing[] = [];
  for (const point of data) {
    const value = Math.max(point.value, 0);
    const max = Math.max(point.max ?? maxValue, 0);
    rings.push({
      value,
      max,
      fraction: max > 0 ? clamp(value / max, 0, 1) : 0,
    });
  }
  return rings;
}

function maxValueOf(data: readonly IRadialChartPoint[]): number {
  let max = 0;
  for (const point of data) max = Math.max(max, point.value, point.max ?? 0);
  return max;
}

function toBands(
  radius: number,
  barWidth: number,
  gap: number,
  count: number,
): IRadialChartBand[] {
  const pitch = barWidth + gap;
  const bands: IRadialChartBand[] = [];
  for (let i = 0; i < count; i++) {
    const center = radius - i * pitch - barWidth / 2;
    bands.push({ radius: Math.max(center, 0), width: barWidth });
  }
  return bands;
}

function polar(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  "worklet";
  const theta = ANGLE_ORIGIN + angle;
  return {
    x: centerX + radius * Math.cos(theta),
    y: centerY + radius * Math.sin(theta),
  };
}

function ringPath(
  centerX: number,
  centerY: number,
  radius: number,
  start: number,
  end: number,
): string {
  "worklet";
  const sweep = end - start;
  if (radius <= 0 || sweep <= EPSILON) return "M 0 0";

  if (sweep >= TAU - EPSILON) {
    const top = polar(centerX, centerY, radius, start);
    const bottom = polar(centerX, centerY, radius, start + Math.PI);
    return (
      `M ${top.x} ${top.y} ` +
      `A ${radius} ${radius} 0 0 1 ${bottom.x} ${bottom.y} ` +
      `A ${radius} ${radius} 0 0 1 ${top.x} ${top.y}`
    );
  }

  const large = sweep > Math.PI ? 1 : 0;
  const from = polar(centerX, centerY, radius, start);
  const to = polar(centerX, centerY, radius, end);
  return (
    `M ${from.x} ${from.y} ` +
    `A ${radius} ${radius} 0 ${large} 1 ${to.x} ${to.y}`
  );
}

function angleForPoint(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
): number {
  "worklet";
  const angle = Math.atan2(y - centerY, x - centerX) - ANGLE_ORIGIN;
  return ((angle % TAU) + TAU) % TAU;
}

function distanceFromCenter(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
): number {
  "worklet";
  return Math.hypot(x - centerX, y - centerY);
}

function ringIndexForDistance(
  distance: number,
  radius: number,
  barWidth: number,
  gap: number,
  count: number,
): number {
  "worklet";
  const pitch = barWidth + gap;
  if (pitch <= 0 || distance > radius + gap / 2) return -1;

  const index = Math.floor((radius - distance) / pitch);
  if (index < 0 || index >= count) return -1;

  const center = radius - index * pitch - barWidth / 2;
  return Math.abs(distance - center) <= barWidth / 2 + gap / 2 ? index : -1;
}

function isWithinSweep(
  angle: number,
  startAngle: number,
  sweepAngle: number,
): boolean {
  "worklet";
  if (sweepAngle >= TAU - EPSILON) return true;
  const relative = (((angle - startAngle) % TAU) + TAU) % TAU;
  return relative <= sweepAngle;
}

function staggeredProgress(
  progress: number,
  index: number,
  stagger: number,
): number {
  "worklet";
  const delay = Math.min(index * stagger, 0.8);
  return clamp((progress - delay) / Math.max(1 - delay, 0.2), 0, 1);
}

function formatShare(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

function colorAt(colors: readonly string[], index: number): string {
  return colors[index % colors.length] ?? colors[0]!;
}

export {
  lerp,
  clamp,
  toRadians,
  toRings,
  maxValueOf,
  toBands,
  polar,
  ringPath,
  angleForPoint,
  distanceFromCenter,
  ringIndexForDistance,
  isWithinSweep,
  staggeredProgress,
  formatShare,
  colorAt,
};
