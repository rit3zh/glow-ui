import { Easing } from "react-native-reanimated";
import type { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";

import type {
  IToggleMetrics,
  ITogglePalette,
  TToggleSize,
  TToggleTheme,
} from "./types";

const TOGGLE_METRICS: Record<TToggleSize, IToggleMetrics> = {
  sm: buildMetrics(28, 10, 14, 13, 14),
  md: buildMetrics(32, 10, 11, 14, 16),
  lg: buildMetrics(36, 10, 11, 14, 18),
};

function buildMetrics(
  height: number,
  paddingHorizontal: number,
  radius: number,
  fontSize: number,
  iconSize: number,
): IToggleMetrics {
  return {
    height,
    minWidth: height,
    paddingHorizontal,
    radius,
    gap: 4,
    fontSize,
    iconSize,
  };
}

const TOGGLE_THEME: Record<TToggleTheme, ITogglePalette> = {
  dark: {
    fill: "#171716",
    border: "#2B2A25",
    labelOn: "#F6F3EC",
    labelOff: "#9A958A",
    sheen: "rgba(246,243,236,0.26)",
  },
  light: {
    fill: "#F5F7FA",
    border: "#E3E7EC",
    labelOn: "#111111",
    labelOff: "#6D7480",
    sheen: "rgba(17,17,17,0.18)",
  },
};

const TOGGLE_ICON_REST = 0.93;

const TOGGLE_FLUID_FILL: WithSpringConfig = {
  stiffness: 210,
  damping: 28,
  mass: 1.08,
};

const TOGGLE_FLUID_ICON: WithSpringConfig = {
  stiffness: 340,
  damping: 32,
  mass: 0.92,
};

const TOGGLE_FLUID_TAP: WithSpringConfig = {
  stiffness: 520,
  damping: 34,
  mass: 0.72,
};

const TOGGLE_FLUID_SNAP: WithSpringConfig = {
  duration: 450,
  dampingRatio: 0.68,
};

const TOGGLE_SHEEN_SWEEP: WithTimingConfig = {
  duration: 580,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

const TOGGLE_SHEEN_FADE: WithTimingConfig = {
  duration: 580,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};

const TOGGLE_SHEEN_FROM = -0.4;

const TOGGLE_SHEEN_TO = 1.4;

const TOGGLE_SHEEN_OPACITY = 0.85;

const TOGGLE_SHEEN_WIDTH_RATIO = 0.42;

const TOGGLE_SHEEN_SKEW = "-18deg";

const TOGGLE_SHEEN_OVERFLOW_RATIO = 0.2;

const TOGGLE_TAP_SCALE_X = 0.86;

const TOGGLE_TAP_SCALE_Y = 1.08;

const TOGGLE_CHANGE_SCALE_X = 1.1;

const TOGGLE_CHANGE_SCALE_Y = 0.91;

const TOGGLE_DISABLED_OPACITY = 0.5;

export {
  TOGGLE_METRICS,
  TOGGLE_THEME,
  TOGGLE_ICON_REST,
  TOGGLE_FLUID_FILL,
  TOGGLE_FLUID_ICON,
  TOGGLE_FLUID_TAP,
  TOGGLE_FLUID_SNAP,
  TOGGLE_SHEEN_SWEEP,
  TOGGLE_SHEEN_FADE,
  TOGGLE_SHEEN_FROM,
  TOGGLE_SHEEN_TO,
  TOGGLE_SHEEN_OPACITY,
  TOGGLE_SHEEN_WIDTH_RATIO,
  TOGGLE_SHEEN_SKEW,
  TOGGLE_SHEEN_OVERFLOW_RATIO,
  TOGGLE_TAP_SCALE_X,
  TOGGLE_TAP_SCALE_Y,
  TOGGLE_CHANGE_SCALE_X,
  TOGGLE_CHANGE_SCALE_Y,
  TOGGLE_DISABLED_OPACITY,
};
