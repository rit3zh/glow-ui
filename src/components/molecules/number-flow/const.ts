import type { WithSpringConfig } from "react-native-reanimated";

export const NUMBER_FLOW_FONT_SIZE = 32;
export const DIGIT_WIDTH_RATIO = 0.62;
export const SEPARATOR_WIDTH_RATIO = 0.32;
export const DIGIT_HEIGHT_RATIO = 1.8;
export const SLIDE_FRACTION = 0.35;
export const SCALE_MIN = 0;

export const LIVELY_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 220,
  mass: 1,
};

export const GLIDE_SPRING: WithSpringConfig = {
  damping: 26,
  stiffness: 220,
  mass: 1,
  overshootClamping: true,
};
