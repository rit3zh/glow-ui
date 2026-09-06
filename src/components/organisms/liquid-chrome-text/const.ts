import { PixelRatio } from "react-native";

const DEFAULTS = {
  TEXT: "metal",
  HEIGHT: 260,
  BORDER_RADIUS: 0,
  SKY: "#9EC7D9",
  HIGHLIGHT: "#FAFFFF",
  SHADOW: "#080F14",
  GROUND: "#1A5766",
  BASE: "#80B8C7",
  SPARK: "#D9F7FF",
  FONT_WEIGHT: "600",
  FONT_SIZE_RATIO: 0.56,
  WIDTH_RATIO: 0.82,
  LETTER_SPACING: -0.05,

  BULGE: 1.4,
  NORMAL_STRENGTH: 1,
  HORIZON_SHARPNESS: 0.5,
  ROUGHNESS: 0.4,
  FRESNEL: 1,
  SPARKLE: 1,
  EDGE_SOFTNESS: 1,

  SPEED: 1,
  DRIFT: 1,
  RESOLUTION: Math.min(PixelRatio.get(), 2),
} as const;

const HEIGHT_BLUR_RATIO = 0.012;
const MIN_BLUR_PX = 1.5;
const WIDE_BLUR_SCALE = 1.15;
const TIGHT_BLUR_SCALE = 0.4;
const SLOPE_GAIN = 22;
const SLOPE_REFERENCE_HEIGHT = 400;
const TILT_RANGE = 0.9;
const TILT_FREQ_X = 0.42;
const TILT_FREQ_Y = 0.31;
const COLOR_TRANSITION_MS = 450;
const REVEAL_MS = 420;
const STATIC_TIME = 6.2;

const MAX_FIELD_WIDTH = 1400;
const BASE_FONT_SIZE = 100;

const NAMED_WEIGHTS: Record<string, number> = {
  thin: 100,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
  black: 900,
};

export {
  DEFAULTS,
  HEIGHT_BLUR_RATIO,
  MIN_BLUR_PX,
  WIDE_BLUR_SCALE,
  TIGHT_BLUR_SCALE,
  SLOPE_GAIN,
  SLOPE_REFERENCE_HEIGHT,
  TILT_RANGE,
  TILT_FREQ_X,
  TILT_FREQ_Y,
  COLOR_TRANSITION_MS,
  REVEAL_MS,
  STATIC_TIME,
  MAX_FIELD_WIDTH,
  BASE_FONT_SIZE,
  NAMED_WEIGHTS,
};
