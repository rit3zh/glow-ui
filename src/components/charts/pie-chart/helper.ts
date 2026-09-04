import { ANGLE_ORIGIN, EPSILON, TAU } from "./const";
import type { IPieChartPoint, IPieChartSlice } from "./types";

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

function toSlices(data: readonly IPieChartPoint[]): IPieChartSlice[] {
  let total = 0;
  for (const point of data) total += Math.max(point.value, 0);

  const slices: IPieChartSlice[] = [];
  for (const point of data) {
    const value = Math.max(point.value, 0);
    slices.push({ value, fraction: total > 0 ? value / total : 0 });
  }
  return slices;
}

function sumValues(data: readonly IPieChartPoint[]): number {
  let total = 0;
  for (const point of data) total += Math.max(point.value, 0);
  return total;
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

function arcPath(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  start: number,
  end: number,
): string {
  "worklet";
  const sweep = end - start;
  if (outerRadius <= 0 || sweep <= EPSILON) return "M 0 0";

  const inner = clamp(innerRadius, 0, outerRadius);

  if (sweep >= TAU - EPSILON) {
    const outerTop = polar(centerX, centerY, outerRadius, 0);
    const outerBottom = polar(centerX, centerY, outerRadius, Math.PI);
    let path =
      `M ${outerTop.x} ${outerTop.y} ` +
      `A ${outerRadius} ${outerRadius} 0 1 1 ${outerBottom.x} ${outerBottom.y} ` +
      `A ${outerRadius} ${outerRadius} 0 1 1 ${outerTop.x} ${outerTop.y} Z`;
    if (inner > 0) {
      const innerTop = polar(centerX, centerY, inner, 0);
      const innerBottom = polar(centerX, centerY, inner, Math.PI);
      path +=
        ` M ${innerTop.x} ${innerTop.y} ` +
        `A ${inner} ${inner} 0 1 0 ${innerBottom.x} ${innerBottom.y} ` +
        `A ${inner} ${inner} 0 1 0 ${innerTop.x} ${innerTop.y} Z`;
    }
    return path;
  }

  const large = sweep > Math.PI ? 1 : 0;
  const outerStart = polar(centerX, centerY, outerRadius, start);
  const outerEnd = polar(centerX, centerY, outerRadius, end);

  if (inner <= 0) {
    return (
      `M ${centerX} ${centerY} L ${outerStart.x} ${outerStart.y} ` +
      `A ${outerRadius} ${outerRadius} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y} Z`
    );
  }

  const innerEnd = polar(centerX, centerY, inner, end);
  const innerStart = polar(centerX, centerY, inner, start);
  return (
    `M ${outerStart.x} ${outerStart.y} ` +
    `A ${outerRadius} ${outerRadius} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y} ` +
    `L ${innerEnd.x} ${innerEnd.y} ` +
    `A ${inner} ${inner} 0 ${large} 0 ${innerStart.x} ${innerStart.y} Z`
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

function indexForAngle(spans: number[], angle: number): number {
  "worklet";
  for (let i = 0; i < spans.length - 1; i++) {
    if (angle >= spans[i]! && angle < spans[i + 1]!) return i;
  }
  return spans.length > 1 ? spans.length - 2 : -1;
}

function arcCentroid(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  mid: number,
): { x: number; y: number } {
  "worklet";
  return polar(centerX, centerY, (outerRadius + innerRadius) / 2, mid);
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
  toSlices,
  sumValues,
  polar,
  arcPath,
  angleForPoint,
  distanceFromCenter,
  indexForAngle,
  arcCentroid,
  formatShare,
  colorAt,
};
