import { HORIZON, MAX_SWEEP, MIN_RADIUS, MIN_SWEEP } from "./const";

function itemOffset(
  index: number,
  itemHeight: number,
  scrollY: number,
): number {
  "worklet";
  return index * itemHeight - scrollY;
}

function radiusForSweep(halfHeight: number, sweep: number): number {
  "worklet";
  const bounded = Math.min(Math.max(sweep, MIN_SWEEP), MAX_SWEEP);
  const angle = (bounded * Math.PI) / 180;
  return Math.max(halfHeight / Math.sin(angle), MIN_RADIUS);
}

function projectOnArc(
  offset: number,
  radius: number,
  direction: number,
): {
  translateX: number;
  translateY: number;
  rotate: number;
  y: number;
  visible: boolean;
} {
  "worklet";
  const r = Math.max(radius, MIN_RADIUS);
  const angle = offset / r;
  const turned = Math.max(-HORIZON, Math.min(HORIZON, angle));
  const y = r * Math.sin(turned);

  return {
    translateX: r * (1 - Math.cos(turned)) * direction,
    translateY: y - offset,
    rotate: (-turned * 180 * direction) / Math.PI,
    y,
    visible: Math.abs(angle) < HORIZON,
  };
}

function indexAt(scrollY: number, itemHeight: number, count: number): number {
  "worklet";
  if (count <= 0) return 0;
  return Math.max(0, Math.min(count - 1, Math.round(scrollY / itemHeight)));
}

function offsetForIndex(index: number, itemHeight: number): number {
  "worklet";
  return index * itemHeight;
}

export { indexAt, itemOffset, offsetForIndex, projectOnArc, radiusForSweep };
