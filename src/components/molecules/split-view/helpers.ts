import { SNAP_BIAS } from "./const";

function clamp(value: number, min: number, max: number): number {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

/**
 * Pick the snap target for a settled drag. A fast fling jumps to the next point
 * in the fling direction; a slow release lands on the nearest point.
 */
function resolveSnapTarget(
  current: number,
  velocity: number,
  snapPoints: readonly number[],
  threshold: number,
): number {
  "worklet";
  if (Math.abs(velocity) > threshold) {
    if (velocity > 0) {
      for (let i = 0; i < snapPoints.length; i++) {
        if (snapPoints[i] > current + SNAP_BIAS) return snapPoints[i];
      }
      return snapPoints[snapPoints.length - 1];
    }
    for (let i = snapPoints.length - 1; i >= 0; i--) {
      if (snapPoints[i] < current - SNAP_BIAS) return snapPoints[i];
    }
    return snapPoints[0];
  }

  let best = snapPoints[0];
  let bestDistance = Math.abs(snapPoints[0] - current);
  for (let i = 1; i < snapPoints.length; i++) {
    const distance = Math.abs(snapPoints[i] - current);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = snapPoints[i];
    }
  }
  return best;
}

export { clamp, resolveSnapTarget };
