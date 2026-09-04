import type { WithSpringConfig } from "react-native-reanimated";

const SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  stiffness: 260,
  mass: 1,
};

const GROW_DURATION = 900;
const MORPH_DURATION = 550;
const STAGGER = 0.08;

const BAR_COLORS = [
  "#7C8394",
  "#8F7BE8",
  "#E0A343",
  "#3FBF93",
  "#4B90F0",
] as const;

const TRACK_COLOR = "#F2F2F4";
const LABEL_COLOR = "#8A8A8E";
const VALUE_COLOR = "#1C1C1E";

const BAR_WIDTH = 11;
const RING_GAP = 7;

const START_ANGLE = 0;
const CIRCLE_SWEEP = 360;
const SEMICIRCLE_START = -90;
const SEMICIRCLE_SWEEP = 180;

const BOTTOM_INSET = 0;
const RADIUS_INSET = 2;

const TAU = Math.PI * 2;
const ANGLE_ORIGIN = -Math.PI / 2;
const EPSILON = 1e-4;

export {
  SPRING_CONFIG,
  GROW_DURATION,
  MORPH_DURATION,
  STAGGER,
  BAR_COLORS,
  TRACK_COLOR,
  LABEL_COLOR,
  VALUE_COLOR,
  BAR_WIDTH,
  RING_GAP,
  START_ANGLE,
  CIRCLE_SWEEP,
  SEMICIRCLE_START,
  SEMICIRCLE_SWEEP,
  BOTTOM_INSET,
  RADIUS_INSET,
  TAU,
  ANGLE_ORIGIN,
  EPSILON,
};
