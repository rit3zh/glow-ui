import type { WithSpringConfig } from "react-native-reanimated";

const SPRING_CONFIG: WithSpringConfig = {
  damping: 22,
  stiffness: 300,
  mass: 1,
};

const GROW_DURATION = 900;
const MORPH_DURATION = 550;
const STAGGER = 0.3;

const TOOLTIP_SPRING_CONFIG: WithSpringConfig = {
  damping: 18,
  stiffness: 220,
  mass: 0.9,
};

const ROW_STAGGER = 55;
const TOOLTIP_MIN_SCALE = 0.88;
const TOOLTIP_BUMP_SCALE = 0.06;

const SERIES_COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#A855F7"] as const;

const GRID_COLOR = "rgba(0,0,0,0.14)";
const AXIS_COLOR = "rgba(0,0,0,0.14)";
const LABEL_COLOR = "#6E6E73";
const DOT_FILL_COLOR = "#FFFFFF";

const LEVELS = 4;
const START_ANGLE = 0;
const LABEL_INSET = 26;
const RADIUS_INSET = 4;

const DASH = [4, 4] as const;
const THICKNESS = 1;
const SHAPE_THICKNESS = 2;
const FILL_OPACITY = 0.12;
const DOT_RADIUS = 4;
const ACTIVE_DOT_RADIUS = 5.5;

const TICK_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];

const TAU = Math.PI * 2;
const ANGLE_ORIGIN = -Math.PI / 2;

export {
  SPRING_CONFIG,
  TOOLTIP_SPRING_CONFIG,
  ROW_STAGGER,
  TOOLTIP_MIN_SCALE,
  TOOLTIP_BUMP_SCALE,
  GROW_DURATION,
  MORPH_DURATION,
  STAGGER,
  SERIES_COLORS,
  GRID_COLOR,
  AXIS_COLOR,
  LABEL_COLOR,
  DOT_FILL_COLOR,
  LEVELS,
  START_ANGLE,
  LABEL_INSET,
  RADIUS_INSET,
  DASH,
  THICKNESS,
  SHAPE_THICKNESS,
  FILL_OPACITY,
  DOT_RADIUS,
  ACTIVE_DOT_RADIUS,
  TICK_STEPS,
  TAU,
  ANGLE_ORIGIN,
};
