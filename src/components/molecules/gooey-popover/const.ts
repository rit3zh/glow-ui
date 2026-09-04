import type { WithSpringConfig } from "react-native-reanimated";

const GOO_OPEN_SPRING: WithSpringConfig = {
  stiffness: 115,
  damping: 18,
  mass: 0.4,
};
const GOO_CLOSE_SPRING: WithSpringConfig = {
  stiffness: 115,
  damping: 18,
  mass: 0.4,
};

const GOO_MATRIX = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 22, -11,
];

const DEFAULT_SIDE = "bottom";
const DEFAULT_ALIGN = "center";
const DEFAULT_SIDE_OFFSET = 14;
const DEFAULT_PANEL_RADIUS = 16;
const DEFAULT_GOO_STRENGTH = 8;
const DEFAULT_COLOR = "#ffffff";
const DEFAULT_PRESS_SCALE = 0.94;

const PRESS_IN_SPRING: WithSpringConfig = {
  stiffness: 400,
  damping: 26,
  mass: 0.5,
};
const PRESS_OUT_SPRING: WithSpringConfig = {
  stiffness: 260,
  damping: 16,
  mass: 0.5,
};

export {
  GOO_OPEN_SPRING,
  GOO_CLOSE_SPRING,
  GOO_MATRIX,
  DEFAULT_SIDE,
  DEFAULT_ALIGN,
  DEFAULT_SIDE_OFFSET,
  DEFAULT_PANEL_RADIUS,
  DEFAULT_GOO_STRENGTH,
  DEFAULT_COLOR,
  DEFAULT_PRESS_SCALE,
  PRESS_IN_SPRING,
  PRESS_OUT_SPRING,
};
