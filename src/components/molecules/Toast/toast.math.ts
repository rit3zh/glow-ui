/**
 * Swipe geometry.
 *
 * Everything below `getCommitWidth` runs on the UI thread inside the pan
 * gesture, so the worklets deliberately inline their tuning numbers instead of
 * reading module constants — a worklet that reaches for a binding it did not
 * capture throws, and a throw inside a gesture handler takes the whole app
 * down rather than surfacing as a red box.
 */

/** Resistance applied between the resting width and a full swipe. */
const FULL_SWIPE_RESISTANCE = 0.82;
/** Rubber-band coefficient for pulling past the ends. */
const RUBBER_COEF = 0.55;
/** Commit lands this far past the resting width… */
const COMMIT_OFFSET = 44;
/** …never closer than this to it… */
const COMMIT_OVERSHOOT = 24;
/** …and never further than this fraction of the row. */
const COMMIT_RATIO = 0.65;

/**
 * Asymptotic overscroll: `overflow` px of pull yields at most `dim` px of
 * travel, easing off the whole way.
 */
function rubberBand(overflow: number, dim: number) {
  "worklet";
  if (!(overflow > 0) || !(dim > 0)) return 0;
  return (1 - 1 / ((overflow * 0.55) / dim + 1)) * dim;
}

/**
 * Maps raw finger travel onto how far the toast actually moves.
 *
 * Up to `limit` (the resting reveal width) it tracks 1:1. Past that it eases
 * toward the full row — never faster than the finger — and once the row is
 * fully open it rubber-bands so there is always something pushing back.
 */
function shapeSwipe(raw: number, limit: number, rowWidth: number) {
  "worklet";
  if (!raw) return 0;

  const sign = raw < 0 ? -1 : 1;
  const abs = raw < 0 ? -raw : raw;
  const width = rowWidth > 0 ? rowWidth : 1;

  if (!(limit > 0)) return sign * rubberBand(abs, width);
  if (abs <= limit) return raw;

  if (abs <= width) {
    const remaining = Math.max(width - limit, 1);
    const progress = Math.min(1, (abs - limit) / remaining);
    // 0.82 === FULL_SWIPE_RESISTANCE, inlined for the UI thread.
    const eased = progress * (0.82 + (1 - 0.82) * progress);
    return sign * (limit + remaining * eased);
  }

  return sign * (width + rubberBand(abs - width, width * 0.25));
}

/** Resistance applied when dragging away from the action side. */
function shapeCounterSwipe(raw: number, rowWidth: number) {
  "worklet";
  if (!raw) return 0;
  const sign = raw < 0 ? -1 : 1;
  const abs = raw < 0 ? -raw : raw;
  const dim = rowWidth > 0 ? rowWidth * 0.2 : 1;
  return sign * rubberBand(abs, dim);
}

/** Signed reveal width for a side, clamped to the row. Never returns NaN. */
function getRevealed(dragX: number, side: "left" | "right", rowWidth: number) {
  "worklet";
  const raw = side === "left" ? -dragX : dragX;
  if (!(raw > 0)) return 0;
  const max = rowWidth > 0 ? rowWidth : 0;
  return raw < max ? raw : max;
}

/**
 * Travel at which the action takes over the row and the swipe commits.
 * Sits a fixed distance past the resting width, but never past `ratio` of the
 * row — so it lands in the same place on a phone and on a tablet.
 *
 * Resolved on the JS thread; the gesture only ever compares against the
 * resulting number.
 */
function getCommitWidth(
  rowWidth: number,
  revealWidth: number,
  ratio = COMMIT_RATIO,
  offset = COMMIT_OFFSET,
) {
  const width = rowWidth > 0 ? rowWidth : 0;
  return Math.max(
    revealWidth + COMMIT_OVERSHOOT,
    Math.min(width * ratio, revealWidth + offset),
  );
}

export {
  COMMIT_OFFSET,
  COMMIT_OVERSHOOT,
  COMMIT_RATIO,
  FULL_SWIPE_RESISTANCE,
  getCommitWidth,
  getRevealed,
  RUBBER_COEF,
  rubberBand,
  shapeCounterSwipe,
  shapeSwipe,
};
