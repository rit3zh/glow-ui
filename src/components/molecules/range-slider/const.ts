import type { WithSpringConfig } from "react-native-reanimated";

const SPRING_GLIDE: WithSpringConfig = {
  stiffness: 700,
  damping: 50,
  mass: 0.5,
};

const SPRING_BOUNCY: WithSpringConfig = {
  stiffness: 500,
  damping: 14,
  mass: 0.7,
};

const TRACK_HEIGHT = 40;
const THUMB_WIDTH = 6;
const THUMB_HEIGHT = 20;
const TICK_SIZE = 4;
const TICK_INSET = 18;
const ACTIVE_SCALE_Y = 1.35;

const THEME = {
  track: "rgba(120,120,128,0.22)",
  fill: "rgba(255,255,255,0.16)",
  thumb: "#ffffff",
  tick: "rgba(255,255,255,0.25)",
};

export {
  SPRING_GLIDE,
  SPRING_BOUNCY,
  TRACK_HEIGHT,
  THUMB_WIDTH,
  THUMB_HEIGHT,
  TICK_SIZE,
  TICK_INSET,
  ACTIVE_SCALE_Y,
  THEME,
};
