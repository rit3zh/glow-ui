import type { WithSpringConfig } from "react-native-reanimated";

import type {
  IActionRailMetrics,
  IActionRailPalette,
  TActionRailSize,
  TActionRailTheme,
} from "./types";

const SHELL_SPRING: WithSpringConfig = {
  damping: 13,
  stiffness: 150,
  mass: 0.5,
};

const PRESS_SPRING: WithSpringConfig = {
  damping: 22,
  stiffness: 420,
  mass: 0.6,
};
const PRESS_SCALE = 0.95;

const GLYPH_SPRING: WithSpringConfig = {
  damping: 16,
  stiffness: 220,
  mass: 0.6,
};
const GLYPH_MIN_SCALE = 0.55;

const ENTER_DURATION = 220;
const EXIT_DURATION = 140;
const ICON_SWAP_DURATION = 180;

const SIZES: Record<TActionRailSize, IActionRailMetrics> = {
  sm: {
    trackPadding: 4,
    gap: 4,
    actionHeight: 32,
    actionPaddingX: 12,
    actionGap: 6,
    toggleSize: 32,
    iconSize: 14,
    fontSize: 12,
  },
  md: {
    trackPadding: 6,
    gap: 6,
    actionHeight: 36,
    actionPaddingX: 14,
    actionGap: 8,
    toggleSize: 36,
    iconSize: 16,
    fontSize: 14,
  },
};

const LIGHT_PALETTE: IActionRailPalette = {
  track: "#ffffff",
  border: "#e3e7ec",
  action: "#f5f7fa",
  actionText: "#111111",
  toggle: "#111111",
  toggleText: "#ffffff",
};

const DARK_PALETTE: IActionRailPalette = {
  track: "#171716",
  border: "#2b2a25",
  action: "#232320",
  actionText: "#f6f3ec",
  toggle: "#f6f3ec",
  toggleText: "#111111",
};

const PALETTES: Record<TActionRailTheme, IActionRailPalette> = {
  light: LIGHT_PALETTE,
  dark: DARK_PALETTE,
};

export {
  DARK_PALETTE,
  ENTER_DURATION,
  EXIT_DURATION,
  GLYPH_MIN_SCALE,
  GLYPH_SPRING,
  ICON_SWAP_DURATION,
  LIGHT_PALETTE,
  PALETTES,
  PRESS_SCALE,
  PRESS_SPRING,
  SHELL_SPRING,
  SIZES,
};
