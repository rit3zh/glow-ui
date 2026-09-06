import { TICK_STEPS } from "./const";
import type { IBarChartDomain, IBarChartPoint, IBarChartSlot } from "./types";

function lerp(from: number, to: number, progress: number): number {
  "worklet";
  return from + (to - from) * progress;
}

function clamp(value: number, low: number, high: number): number {
  "worklet";
  return Math.min(Math.max(value, low), high);
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
  data: readonly IBarChartPoint[],
  tickCount: number,
  maxY?: number,
): IBarChartDomain {
  const ticks = Math.max(2, Math.floor(tickCount));
  let highest = 0;
  for (const point of data) if (point.value > highest) highest = point.value;
  if (maxY != null) highest = maxY;

  const step =
    maxY != null ? maxY / (ticks - 1) : niceStep(highest / (ticks - 1));
  const max = maxY != null ? maxY : step * (ticks - 1);

  const values: number[] = [];
  for (let i = 0; i < ticks; i++)
    values.push(Math.round(step * i * 1e10) / 1e10);
  return { min: 0, max: max || 1, ticks: values };
}

function tickDecimals(step: number): number {
  if (!Number.isFinite(step) || step <= 0 || step >= 1) return 0;
  const text = step.toPrecision(12).replace(/0+$/, "");
  const dot = text.indexOf(".");
  return dot < 0 ? 0 : Math.min(text.length - dot - 1, 6);
}

function formatTick(value: number, step: number): string {
  return value.toFixed(tickDecimals(step));
}

function toSlots(
  count: number,
  plotLeft: number,
  plotWidth: number,
  barRatio: number,
): IBarChartSlot[] {
  if (count < 1 || plotWidth <= 0) return [];

  const slotWidth = plotWidth / count;
  const barWidth = Math.max(slotWidth * clamp(barRatio, 0.05, 1), 1);
  const slots: IBarChartSlot[] = [];
  for (let i = 0; i < count; i++) {
    const center = plotLeft + slotWidth * i + slotWidth / 2;
    slots.push({ x: center - barWidth / 2, width: barWidth, center });
  }
  return slots;
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

function roundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  "worklet";
  const r = Math.min(radius, width / 2, height / 2);
  const right = x + width;
  const bottom = y + height;
  return (
    `M ${x + r} ${y} L ${right - r} ${y} A ${r} ${r} 0 0 1 ${right} ${y + r} ` +
    `L ${right} ${bottom - r} A ${r} ${r} 0 0 1 ${right - r} ${bottom} ` +
    `L ${x + r} ${bottom} A ${r} ${r} 0 0 1 ${x} ${bottom - r} ` +
    `L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`
  );
}

function buildGridPath(
  domain: IBarChartDomain,
  plotLeft: number,
  plotRight: number,
  plotBottom: number,
  plotHeight: number,
): string {
  if (domain.ticks.length === 0 || plotRight <= plotLeft) return "";

  const span = domain.max - domain.min || 1;
  let path = "";
  for (const tick of domain.ticks) {
    const y = plotBottom - ((tick - domain.min) / span) * plotHeight;
    path += `M ${plotLeft} ${y} L ${plotRight} ${y} `;
  }
  return path.trim();
}

function valueToHeight(
  value: number,
  domainMin: number,
  domainMax: number,
  plotHeight: number,
): number {
  "worklet";
  const span = domainMax - domainMin || 1;
  return clamp(((value - domainMin) / span) * plotHeight, 0, plotHeight);
}

function indexForX(slots: IBarChartSlot[], x: number): number {
  "worklet";
  if (slots.length === 0) return -1;

  let nearest = 0;
  let shortest = Math.abs(slots[0]!.center - x);
  for (let i = 1; i < slots.length; i++) {
    const distance = Math.abs(slots[i]!.center - x);
    if (distance < shortest) {
      shortest = distance;
      nearest = i;
    }
  }
  return nearest;
}

export {
  lerp,
  clamp,
  niceStep,
  toDomain,
  tickDecimals,
  formatTick,
  toSlots,
  staggerProgress,
  roundedRect,
  buildGridPath,
  valueToHeight,
  indexForX,
};
