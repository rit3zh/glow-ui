import type { WithSpringConfig } from "react-native-reanimated";

import type {
  ISwitchMetrics,
  ISwitchPalette,
  TSwitchSize,
  TSwitchTheme,
} from "./types";

const SWITCH_METRICS: Record<TSwitchSize, ISwitchMetrics> = {
  sm: buildMetrics(38, 22, 2),
  md: buildMetrics(51, 31, 2),
  lg: buildMetrics(62, 38, 3),
};

function buildMetrics(
  trackWidth: number,
  trackHeight: number,
  padding: number,
): ISwitchMetrics {
  const thumbSize = trackHeight - padding * 2;
  return {
    trackWidth,
    trackHeight,
    thumbSize,
    padding,
    travel: trackWidth - thumbSize - padding * 2,
  };
}

const SWITCH_THEME: Record<TSwitchTheme, ISwitchPalette> = {
  dark: {
    trackOff: "#3A3A3C",
    trackOn: "#34C759",
    border: "rgba(255,255,255,0.06)",
    thumb: "#FFFFFF",
    label: "#FAFAFA",
    description: "#A1A1AA",
  },
  light: {
    trackOff: "#E4E4E7",
    trackOn: "#34C759",
    border: "rgba(0,0,0,0.06)",
    thumb: "#FFFFFF",
    label: "#18181B",
    description: "#71717A",
  },
};

const SWITCH_SPRING: WithSpringConfig = {
  damping: 20,
  stiffness: 260,
  mass: 0.6,
};

const SWITCH_PRESS_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 420,
  mass: 0.5,
};

const SWITCH_PRESS_STRETCH = 1.25;

const SWITCH_DISABLED_OPACITY = 0.45;

export {
  SWITCH_METRICS,
  SWITCH_THEME,
  SWITCH_SPRING,
  SWITCH_PRESS_SPRING,
  SWITCH_PRESS_STRETCH,
  SWITCH_DISABLED_OPACITY,
};
