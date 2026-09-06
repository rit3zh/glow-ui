import type { WithSpringConfig } from "react-native-reanimated";

const COLLAPSED_WIDTH = 170;
const EXPANDED_WIDTH = 330;
const COLLAPSED_HEIGHT = 50;
const EXPANDED_HEIGHT = 350;
const COLLAPSED_RADIUS = 99;
const EXPANDED_RADIUS = 30;

const PRESS_SPRING: WithSpringConfig = {
  damping: 12,
  stiffness: 250,
  mass: 0.5,
};

const EXPAND_SPRING: WithSpringConfig = {
  damping: 13,
  stiffness: 120,
  mass: 0.5,
  overshootClamping: false,
};

export {
  COLLAPSED_HEIGHT,
  EXPANDED_HEIGHT,
  COLLAPSED_WIDTH,
  EXPANDED_WIDTH,
  COLLAPSED_RADIUS,
  EXPANDED_RADIUS,
  PRESS_SPRING,
  EXPAND_SPRING,
};
