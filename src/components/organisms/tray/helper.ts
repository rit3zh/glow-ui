/**
 * Where a flick would come to rest if it decelerated naturally.
 *
 * Snapping on raw position ignores intent: a fast flick that has travelled only
 * 20pt should still reach the next detent, and a slow drag of 200pt should not
 * overshoot past one. Projecting the release velocity forward is how iOS
 * decides, and it is what makes a flick and a drag feel like one control.
 */
function projectPosition(
  position: number,
  velocity: number,
  seconds: number,
): number {
  "worklet";
  return position + velocity * seconds;
}

function nearestOffsetIndex(
  offsets: readonly number[],
  position: number,
): number {
  "worklet";
  let best = 0;
  let bestDistance = Number.MAX_VALUE;
  for (let i = 0; i < offsets.length; i += 1) {
    const distance = Math.abs(offsets[i] - position);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return best;
}

function rubberBand(
  distance: number,
  dimension: number,
  factor = 0.55,
): number {
  "worklet";
  return (
    (1 - 1 / ((distance * factor) / Math.max(dimension, 1) + 1)) *
    Math.max(dimension, 1)
  );
}

function resolveDetent(detent: number | string, available: number): number {
  if (typeof detent === "string") {
    const percent = parseFloat(detent);
    return Number.isFinite(percent) ? (available * percent) / 100 : available;
  }
  return detent <= 1 ? available * detent : detent;
}

function toOffsets(heights: readonly number[]): number[] {
  const tallest = Math.max(...heights);
  return heights.map((height) => tallest - height).sort((a, b) => a - b);
}

export {
  nearestOffsetIndex,
  projectPosition,
  resolveDetent,
  rubberBand,
  toOffsets,
};
