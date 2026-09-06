import type { WithSpringConfig } from "react-native-reanimated";

const DEFAULT_INITIAL_TOP_HEIGHT = 300;
const DEFAULT_MIN_TOP_HEIGHT = 50;
const DEFAULT_MIN_BOTTOM_HEIGHT = 50;
const DEFAULT_GAP = 28;
const DEFAULT_VELOCITY_THRESHOLD = 500;
const HANDLE_HIT_SLOP = 12;
const SNAP_BIAS = 20;

const DEFAULT_SPRING: WithSpringConfig = {
  damping: 12,
  stiffness: 150,
  mass: 0.5,
};

const THEME = {
  container: "#0e0e10",
  section: "#1c1c1e",
  handle: "rgba(255,255,255,0.35)",
  title: "rgba(235,235,245,0.6)",
};

export {
  DEFAULT_INITIAL_TOP_HEIGHT,
  DEFAULT_MIN_TOP_HEIGHT,
  DEFAULT_MIN_BOTTOM_HEIGHT,
  DEFAULT_GAP,
  DEFAULT_VELOCITY_THRESHOLD,
  HANDLE_HIT_SLOP,
  SNAP_BIAS,
  DEFAULT_SPRING,
  THEME,
};
