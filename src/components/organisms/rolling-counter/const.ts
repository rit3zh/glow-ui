import { Easing } from "react-native-reanimated";
import type {
  WithSpringConfig,
  WithTimingConfig,
} from "react-native-reanimated";

const SPRING_CONFIG: WithSpringConfig = {
  stiffness: 150,
  damping: 15,
  mass: 0.5,
};

/**
 * Curated roll curves. All are ease-out dominant: the strip leaves fast and
 * decelerates into the slot, which is what reads as "smooth" on a digit roll.
 */
const EASING = {
  /** Silky expo-out. No overshoot, long tail. The default. */
  smooth: Easing.bezier(0.22, 1, 0.28, 1),
  /** Snappier, still no bounce. Good for high-frequency updates. */
  crisp: Easing.bezier(0.33, 1, 0.4, 1),
  /** Slight settle past the slot, then back. Playful, not springy. */
  overshoot: Easing.bezier(0.2, 1.04, 0.36, 1),
  /** Gentle both ends, for large multi-digit jumps. */
  glide: Easing.bezier(0.4, 0, 0.16, 1),
} as const;

const TIMING_CONFIG: WithTimingConfig = {
  duration: 620,
  easing: EASING.smooth,
};

const WIDTH_TIMING_CONFIG: WithTimingConfig = {
  duration: 380,
  easing: EASING.smooth,
};

const STAGGER = 38;
const EDGE_FADE = 0.35;
const MAX_BLUR_IOS = 10;
const MAX_BLUR_ANDROID = 2.2;
const SQUASH_Y = 0.12;
const SQUASH_X = 0.035;

const TILES = 11;

const MASK_COLOR = "#000";

export {
  EASING,
  EDGE_FADE,
  MASK_COLOR,
  MAX_BLUR_ANDROID,
  MAX_BLUR_IOS,
  SPRING_CONFIG,
  SQUASH_X,
  SQUASH_Y,
  STAGGER,
  TILES,
  TIMING_CONFIG,
  WIDTH_TIMING_CONFIG,
};
