/**
 * Shared motion vocabulary for the landing page.
 *
 * The curve and the enter/exit geometry are lifted from numeric-text
 * (MIT, shizukushq — see THIRD-PARTY.md),
 * which replicates SwiftUI's `.numericText` content transition: a short,
 * slightly-overshooting spring where glyphs rise, scale up, unblur and settle.
 * Reusing one curve everywhere is what makes the page feel like a single
 * native surface rather than a pile of animated sections.
 */

/** `linear()` approximation of the numeric-text spring (overshoots ~1.5%). */
export const EASE_NUMERIC =
  "linear(0,.1052,.3155,.532,.7112,.8414,.9265,.9765,1.0023,1.013,1.0151,1.0133,1.01,1.0068,1.0041,1.0022,1.001,1)";

/** Same feel, expressed as a cubic-bezier for Framer Motion tweens. */
export const EASE_OUT = [0.19, 1, 0.22, 1] as const;

/** Base duration in seconds, matching numeric-text's 550ms. */
export const DURATION = 0.55;

/** Per-character transform geometry from numeric-text's CONFIG. */
export const CHAR = {
  y: 0.35, // em
  scale: 0.6,
  blur: 0.1, // em
  rotate: 2, // deg
  /** Fraction of the duration the whole stagger is spread across. */
  stagger: 0.3,
} as const;

/** Spring used for layout-driven motion (nav highlight, dropdown viewport). */
export const SPRING = {
  type: "spring",
  stiffness: 350,
  damping: 32,
  bounce: 0,
} as const;

/** Softer spring for larger surfaces that shouldn't feel snappy. */
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 220,
  damping: 34,
  bounce: 0,
} as const;

/** Standard tween for entrances and reveals. */
export const TWEEN = {
  duration: DURATION,
  ease: EASE_OUT,
} as const;

/** Distributes the stagger budget across `count` items, numeric-text style. */
export function staggerStep(count: number, duration = DURATION) {
  return (duration * CHAR.stagger) / Math.max(count, 1);
}
