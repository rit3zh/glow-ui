import type { WithSpringConfig } from "react-native-reanimated";

const SPRING_CONFIG: WithSpringConfig = {
  damping: 22,
  stiffness: 320,
  mass: 1,
};

const GROW_DURATION = 900;
const MORPH_DURATION = 550;
const STAGGER = 0.35;

const BAR_COLOR = "#1479FF";
const GRID_COLOR = "rgba(0,0,0,0.08)";
const HIGHLIGHT_COLOR = "rgba(0,0,0,0.045)";
const AXIS_COLOR = "#8A8A8E";

const BAR_RATIO = 0.42;
const TICK_COUNT = 5;

const LEFT_INSET = 34;
const BOTTOM_INSET = 28;
const TOP_INSET = 8;

const TICK_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];

export {
  SPRING_CONFIG,
  GROW_DURATION,
  MORPH_DURATION,
  STAGGER,
  BAR_COLOR,
  GRID_COLOR,
  HIGHLIGHT_COLOR,
  AXIS_COLOR,
  BAR_RATIO,
  TICK_COUNT,
  LEFT_INSET,
  BOTTOM_INSET,
  TOP_INSET,
  TICK_STEPS,
};
