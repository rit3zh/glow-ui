import type { WithSpringConfig } from "react-native-reanimated";

const CHIP_HEIGHT = 50;
const CHIP_PADDING = 15;
const ICON_SIZE = 24;
const ICON_LABEL_GAP = 8;
const GROUP_GAP = 8;
const LABEL_TRAVEL = 12;
const PRESS_SCALE = 0.94;

const DEFAULT_SPRING: WithSpringConfig = {
  damping: 13,
  stiffness: 180,
  mass: 0.5,
  overshootClamping: false,
};

const PRESS_SPRING: WithSpringConfig = {
  damping: 20,
  stiffness: 400,
  mass: 0.4,
};

const THEME = {
  active: "#ffffff",
  inactive: "#1a1a1a",
  label: "#ffffff",
};

export {
  CHIP_HEIGHT,
  CHIP_PADDING,
  ICON_SIZE,
  ICON_LABEL_GAP,
  GROUP_GAP,
  LABEL_TRAVEL,
  PRESS_SCALE,
  DEFAULT_SPRING,
  PRESS_SPRING,
  THEME,
};
