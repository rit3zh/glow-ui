import type { WithSpringConfig } from "react-native-reanimated";

const SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  stiffness: 260,
  mass: 1,
};

const GROW_DURATION = 900;
const MORPH_DURATION = 550;

const SLICE_COLORS = [
  "#4DA3FF",
  "#1479FF",
  "#0A5FE0",
  "#0B49B8",
  "#0E3596",
  "#122A78",
] as const;

const LABEL_COLOR = "#8A8A8E";
const VALUE_COLOR = "#1C1C1E";

const START_ANGLE = 0;
const PAD_ANGLE = 0;
const INNER_RADIUS = 0;
const ACTIVE_OFFSET = 10;
const BOTTOM_INSET = 0;
const RADIUS_INSET = 4;

const TAU = Math.PI * 2;
const ANGLE_ORIGIN = -Math.PI / 2;
const EPSILON = 1e-4;

export {
  SPRING_CONFIG,
  GROW_DURATION,
  MORPH_DURATION,
  SLICE_COLORS,
  LABEL_COLOR,
  VALUE_COLOR,
  START_ANGLE,
  PAD_ANGLE,
  INNER_RADIUS,
  ACTIVE_OFFSET,
  BOTTOM_INSET,
  RADIUS_INSET,
  TAU,
  ANGLE_ORIGIN,
  EPSILON,
};
