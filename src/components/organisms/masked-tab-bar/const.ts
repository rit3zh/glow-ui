import type { WithSpringConfig } from "react-native-reanimated";

import type { IMaskedTabBarPalette, TMaskedTabBarTheme } from "./types";

const DEFAULT_HEIGHT = 52;
const DEFAULT_PADDING = 5;
const DEFAULT_GAP = 6;
const DEFAULT_ICON_SIZE = 20;
const DEFAULT_FONT_SIZE = 15;
const DEFAULT_TRIGGER_PADDING_X = 14;
const DEFAULT_TRIGGER_GAP = 8;

const PRESS_GROW = 4;

const PILL_SPRING: WithSpringConfig = {
  damping: 30,
  stiffness: 150,
  mass: 0.5,
};

const PRESS_SPRING: WithSpringConfig = {
  damping: 20,
  stiffness: 150,
  mass: 1,
};

const FOLLOW_STIFFNESS = 220;
const FOLLOW_DAMPING = 24;
const MAX_FRAME_SECONDS = 1 / 30;

const LIGHT_PALETTE: IMaskedTabBarPalette = {
  track: "rgba(118,118,128,0.12)",
  pill: "#ffffff",
  inactive: "rgba(60,60,67,0.5)",
  active: "#000000",
};

const DARK_PALETTE: IMaskedTabBarPalette = {
  track: "rgba(118,118,128,0.24)",
  pill: "#ffffff",
  inactive: "rgba(235,235,245,0.55)",
  active: "#000000",
};

const PALETTES: Record<TMaskedTabBarTheme, IMaskedTabBarPalette> = {
  light: LIGHT_PALETTE,
  dark: DARK_PALETTE,
};

export {
  DARK_PALETTE,
  FOLLOW_DAMPING,
  FOLLOW_STIFFNESS,
  MAX_FRAME_SECONDS,
  DEFAULT_FONT_SIZE,
  DEFAULT_GAP,
  DEFAULT_HEIGHT,
  DEFAULT_ICON_SIZE,
  DEFAULT_PADDING,
  DEFAULT_TRIGGER_GAP,
  DEFAULT_TRIGGER_PADDING_X,
  LIGHT_PALETTE,
  PALETTES,
  PILL_SPRING,
  PRESS_GROW,
  PRESS_SPRING,
};
