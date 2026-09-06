import type { WithSpringConfig, WithTimingConfig } from "react-native-reanimated";
import { Easing } from "react-native-reanimated";

import type {
  IRippleButtonMetrics,
  IRippleButtonPalette,
  TRippleButtonSize,
  TRippleButtonTheme,
  TRippleButtonVariant,
} from "./types";

const RIPPLE_BUTTON_METRICS: Record<TRippleButtonSize, IRippleButtonMetrics> = {
  xs: buildMetrics(24, 8, 10, 4, 12, 12),
  sm: buildMetrics(28, 10, 12, 4, 13, 14),
  md: buildMetrics(32, 12, 12, 6, 14, 16),
  lg: buildMetrics(40, 16, 14, 6, 16, 18),
  "icon-xs": buildMetrics(24, 0, 10, 0, 12, 12, true),
  "icon-sm": buildMetrics(28, 0, 12, 0, 13, 14, true),
  icon: buildMetrics(32, 0, 12, 0, 14, 16, true),
  "icon-lg": buildMetrics(36, 0, 14, 0, 16, 18, true),
};

function buildMetrics(
  height: number,
  paddingHorizontal: number,
  radius: number,
  gap: number,
  fontSize: number,
  iconSize: number,
  iconOnly = false,
): IRippleButtonMetrics {
  return {
    height,
    paddingHorizontal,
    radius,
    gap,
    fontSize,
    iconSize,
    iconOnly,
  };
}

const RIPPLE_BUTTON_THEME: Record<
  TRippleButtonTheme,
  Record<TRippleButtonVariant, IRippleButtonPalette>
> = {
  dark: {
    default: {
      bg: "#F6F3EC",
      bgPressed: "#E7E3DA",
      border: "transparent",
      fg: "#111111",
      ripple: "#111111",
    },
    outline: {
      bg: "rgba(43,42,37,0.3)",
      bgPressed: "rgba(43,42,37,0.55)",
      border: "#2B2A25",
      fg: "#F6F3EC",
      ripple: "#F6F3EC",
    },
    secondary: {
      bg: "#2A2A27",
      bgPressed: "#343430",
      border: "transparent",
      fg: "#F6F3EC",
      ripple: "#F6F3EC",
    },
    ghost: {
      bg: "transparent",
      bgPressed: "rgba(246,243,236,0.08)",
      border: "transparent",
      fg: "#F6F3EC",
      ripple: "#F6F3EC",
    },
    destructive: {
      bg: "rgba(248,113,113,0.16)",
      bgPressed: "rgba(248,113,113,0.26)",
      border: "transparent",
      fg: "#F87171",
      ripple: "#F87171",
    },
    link: {
      bg: "transparent",
      bgPressed: "transparent",
      border: "transparent",
      fg: "#F6F3EC",
      ripple: "transparent",
    },
  },
  light: {
    default: {
      bg: "#111111",
      bgPressed: "#242424",
      border: "transparent",
      fg: "#FFFFFF",
      ripple: "#FFFFFF",
    },
    outline: {
      bg: "#FFFFFF",
      bgPressed: "#F3F5F8",
      border: "#E3E7EC",
      fg: "#111111",
      ripple: "#111111",
    },
    secondary: {
      bg: "#ECEFF3",
      bgPressed: "#E1E5EB",
      border: "transparent",
      fg: "#111111",
      ripple: "#111111",
    },
    ghost: {
      bg: "transparent",
      bgPressed: "rgba(17,17,17,0.06)",
      border: "transparent",
      fg: "#111111",
      ripple: "#111111",
    },
    destructive: {
      bg: "rgba(220,38,38,0.1)",
      bgPressed: "rgba(220,38,38,0.18)",
      border: "transparent",
      fg: "#DC2626",
      ripple: "#DC2626",
    },
    link: {
      bg: "transparent",
      bgPressed: "transparent",
      border: "transparent",
      fg: "#111111",
      ripple: "transparent",
    },
  },
};

const RIPPLE_BUTTON_PRESS_SPRING: WithSpringConfig = {
  damping: 38,
  stiffness: 640,
  mass: 0.85,
};

const RIPPLE_BUTTON_PRESS_SCALE = 0.96;

const RIPPLE_BUTTON_RIPPLE_TIMING: WithTimingConfig = {
  duration: 620,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
};

const RIPPLE_BUTTON_RIPPLE_OPACITY = 0.28;

const RIPPLE_BUTTON_RIPPLE_START_SCALE = 0.35;

const RIPPLE_BUTTON_MAX_RIPPLES = 3;

const RIPPLE_BUTTON_SPINNER_DURATION = 900;

const RIPPLE_BUTTON_DISABLED_OPACITY = 0.5;

export {
  RIPPLE_BUTTON_METRICS,
  RIPPLE_BUTTON_THEME,
  RIPPLE_BUTTON_PRESS_SPRING,
  RIPPLE_BUTTON_PRESS_SCALE,
  RIPPLE_BUTTON_RIPPLE_TIMING,
  RIPPLE_BUTTON_RIPPLE_OPACITY,
  RIPPLE_BUTTON_RIPPLE_START_SCALE,
  RIPPLE_BUTTON_MAX_RIPPLES,
  RIPPLE_BUTTON_SPINNER_DURATION,
  RIPPLE_BUTTON_DISABLED_OPACITY,
};
