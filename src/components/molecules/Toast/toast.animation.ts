import { Easing, withSpring, withTiming } from "react-native-reanimated";

const spring = {
  glide: { damping: 32, stiffness: 170, mass: 1 },
  snappy: { damping: 24, stiffness: 280, mass: 0.8 },
} as const;

const timing = {
  normal: { duration: 300 },
} as const;

const EXIT_MS = 200;

/**
 * The curve iOS uses to settle a swiped row — slow out, long tail.
 *
 * `.factory()` is resolved here, on the JS thread, on purpose:
 * `Easing.bezier()` alone returns a `{ factory }` object, and capturing that
 * object in a worklet leaves `withTiming` calling a non-worklet function on the
 * UI thread — which throws, and a throw inside a gesture handler aborts the
 * app. A plain easing function captures cleanly.
 */
const SWIPE_CURVE = Easing.bezier(0.22, 0.82, 0.18, 1).factory();
const RELEASE_MS = 370;
const COMMIT_MS = 330;
const releaseTiming = { duration: RELEASE_MS, easing: SWIPE_CURVE } as const;
const commitTiming = { duration: COMMIT_MS, easing: SWIPE_CURVE } as const;

const animation = {
  spring: {
    glide: <T extends number>(toValue: T) => withSpring(toValue, spring.glide),
    snappy: <T extends number>(toValue: T) =>
      withSpring(toValue, spring.snappy),
  },
  timing: {
    normal: <T extends number>(toValue: T) =>
      withTiming(toValue, timing.normal),
  },
} as const;

function useAnimation() {
  return animation;
}

export {
  COMMIT_MS,
  commitTiming,
  EXIT_MS,
  RELEASE_MS,
  releaseTiming,
  spring,
  SWIPE_CURVE,
  timing,
  useAnimation,
};
