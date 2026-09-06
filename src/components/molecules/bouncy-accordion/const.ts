import type {
  WithSpringConfig,
  WithTimingConfig,
} from "react-native-reanimated";

// Springs ported from the reference bounce/duration pairs. Framer's `bounce`
// maps to reanimated's `dampingRatio` as roughly `1 - bounce`.

/** Group radius + separation gap. Keeps connected rows moving together. */
const ROW_SPRING: WithSpringConfig = { duration: 550, dampingRatio: 0.62 };
// Content height is a layout prop, so overshoot there reads as a "blank flash"
// rather than a bounce — keep these nearly critically damped and let the
// chevron / group-gap springs carry the bounciness.
/** Content expanding open. */
const CONTENT_OPEN_SPRING: WithSpringConfig = { duration: 520, dampingRatio: 0.9 };
/** Content collapsing — settles cleanly to 0 with no undershoot. */
const CONTENT_CLOSE_SPRING: WithSpringConfig = { duration: 440, dampingRatio: 1 };
/** Chevron flip. */
const CHEVRON_SPRING: WithSpringConfig = { duration: 420, dampingRatio: 0.72 };
/** Description fade — quick linear-ish reveal. */
const DESCRIPTION_TIMING: WithTimingConfig = { duration: 180 };

const DEFAULT_GAP = 12;
const DEFAULT_RADIUS = 28;

const THEME = {
  card: "#ffffff",
  foreground: "#1d1d1f",
  mutedForeground: "#6b7280",
} as const;

export {
  ROW_SPRING,
  CONTENT_OPEN_SPRING,
  CONTENT_CLOSE_SPRING,
  CHEVRON_SPRING,
  DESCRIPTION_TIMING,
  DEFAULT_GAP,
  DEFAULT_RADIUS,
  THEME,
};
