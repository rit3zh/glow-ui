import {
  Easing,
  WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";

import type { IUnfoldMenuPalette, TUnfoldMenuTheme } from "./types";

const DEFAULT_PANEL_WIDTH_RATIO = 0.86;
const MAX_PANEL_WIDTH = 420;
const DEFAULT_SCREEN_MARGIN = 12;
const DEFAULT_COLUMNS = 3;
const DEFAULT_RADIUS = 16;
const DEFAULT_ICON_SIZE = 20;

const MORPH_EASING = Easing.inOut(Easing.cubic);
const CLOSE_EASING = Easing.inOut(Easing.quad);

const MORPH_DURATION = 450;
const MORPH_CLOSE_DURATION = 450;

const MORPH_TIMING: WithSpringConfig = {
  mass: 0.5,
  damping: 14,
  stiffness: 145,
};

const MORPH_CLOSE_TIMING: WithSpringConfig = {
  mass: 0.5,
  damping: 14,
  stiffness: 146,
};

const HANDOFF_DELAY = 460;
const HANDOFF_DURATION = 300;
const HANDOFF_EASING = Easing.inOut(Easing.quad);

const HANDOFF_CLOSE_DURATION = 340;
const MORPH_LABEL_SCALE_TO = 0.88;
const MORPH_TITLE_SCALE_FROM = 0.88;
const MORPH_PUSH_DISTANCE = 14;

const PRESS_TIMING: WithTimingConfig = {
  duration: 120,
  easing: Easing.out(Easing.quad),
};

const PRESS_SCALE = 0.97;

const REVEAL_DELAY = 260;
const REVEAL_DURATION = 220;
const REVEAL_EASING = Easing.out(Easing.cubic);
const CLOSE_DURATION = 280;
const STAGGER_SPAN = 0.45;
const ITEM_WINDOW = 0.55;
const ITEM_SCALE_FROM = 0.85;

const TRIGGER_ICON_FADE_END = 0.2;
const CONTENT_FADE_START = 0.3;
const CONTENT_FADE_END = 0.75;
const MORPH_LABEL_FADE_END = 0.6;
const MORPH_TITLE_FADE_START = 0.4;

const LIGHT_PALETTE: IUnfoldMenuPalette = {
  surface: "#ffffff",
  border: "#e3e7ec",
  text: "#111111",
  mutedText: "#6d7480",
};

const DARK_PALETTE: IUnfoldMenuPalette = {
  surface: "#171716",
  border: "#2b2a25",
  text: "#f6f3ec",
  mutedText: "#9a958a",
};

const PALETTES: Record<TUnfoldMenuTheme, IUnfoldMenuPalette> = {
  light: LIGHT_PALETTE,
  dark: DARK_PALETTE,
};

export {
  CLOSE_DURATION,
  CLOSE_EASING,
  CONTENT_FADE_END,
  CONTENT_FADE_START,
  DARK_PALETTE,
  DEFAULT_COLUMNS,
  DEFAULT_ICON_SIZE,
  DEFAULT_PANEL_WIDTH_RATIO,
  DEFAULT_SCREEN_MARGIN,
  MAX_PANEL_WIDTH,
  DEFAULT_RADIUS,
  ITEM_SCALE_FROM,
  ITEM_WINDOW,
  LIGHT_PALETTE,
  HANDOFF_CLOSE_DURATION,
  HANDOFF_DELAY,
  HANDOFF_DURATION,
  HANDOFF_EASING,
  MORPH_CLOSE_TIMING,
  MORPH_DURATION,
  MORPH_EASING,
  MORPH_CLOSE_DURATION,
  MORPH_LABEL_FADE_END,
  MORPH_LABEL_SCALE_TO,
  MORPH_PUSH_DISTANCE,
  MORPH_TIMING,
  MORPH_TITLE_FADE_START,
  MORPH_TITLE_SCALE_FROM,
  PALETTES,
  PRESS_SCALE,
  PRESS_TIMING,
  REVEAL_DELAY,
  REVEAL_DURATION,
  REVEAL_EASING,
  STAGGER_SPAN,
  TRIGGER_ICON_FADE_END,
};
