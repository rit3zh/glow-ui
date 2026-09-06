import type { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";

import type {
  ITabsMetrics,
  ITabsPalette,
  TTabsSize,
  TTabsTheme,
} from "./types";

const TABS_METRICS: Record<TTabsSize, ITabsMetrics> = {
  sm: buildMetrics(30, 7, 14, 16),
  default: buildMetrics(34, 9, 16, 18),
  lg: buildMetrics(38, 11, 16, 18),
};

function buildMetrics(
  height: number,
  paddingHorizontal: number,
  fontSize: number,
  iconSize: number,
): ITabsMetrics {
  return {
    height,
    paddingHorizontal,
    fontSize,
    iconSize,
    gap: 6,
    listPadding: 2,
    underlineSize: 2,
  };
}

const TABS_THEME: Record<TTabsTheme, ITabsPalette> = {
  dark: {
    listBg: "#171716",
    indicator: "#2B2A25",
    underline: "#F6F3EC",
    activeText: "#F6F3EC",
    inactiveText: "rgba(154,149,138,0.72)",
    accent: "rgba(246,243,236,0.06)",
  },
  light: {
    listBg: "#F5F7FA",
    indicator: "#FFFFFF",
    underline: "#111111",
    activeText: "#111111",
    inactiveText: "rgba(109,116,128,0.72)",
    accent: "rgba(17,17,17,0.04)",
  },
};

const TABS_INDICATOR_SPRING: WithSpringConfig = {
  damping: 22,
  stiffness: 210,
  mass: 0.8,
  overshootClamping: false,
};

const TABS_INDICATOR_SIZE_SPRING: WithSpringConfig = {
  damping: 26,
  stiffness: 260,
  mass: 0.7,
  overshootClamping: true,
};

const TABS_LABEL_TIMING: WithTimingConfig = {
  duration: 180,
};

const TABS_PRESS_SCALE = 0.94;

const TABS_PRESS_SPRING: WithSpringConfig = {
  damping: 20,
  stiffness: 420,
  mass: 0.5,
};

const TABS_ITEM_ICON_OPACITY = 0.8;

const TABS_DISABLED_OPACITY = 0.64;

const TABS_INDICATOR_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
} as const;

export {
  TABS_METRICS,
  TABS_THEME,
  TABS_INDICATOR_SPRING,
  TABS_INDICATOR_SIZE_SPRING,
  TABS_LABEL_TIMING,
  TABS_PRESS_SCALE,
  TABS_PRESS_SPRING,
  TABS_ITEM_ICON_OPACITY,
  TABS_DISABLED_OPACITY,
  TABS_INDICATOR_SHADOW,
};
