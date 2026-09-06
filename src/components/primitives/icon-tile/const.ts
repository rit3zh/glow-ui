import type { TIconTileTone } from "./types";

const DEFAULT_ICON_TILE_SIZE = 56;
const ICON_TILE_RADIUS_RATIO = 0.2296;
const ICON_TILE_GLYPH_RATIO = 0.58;
const DEFAULT_GLOSS_OPACITY = 0.22;

const ICON_TILE_TONES: Record<TIconTileTone, readonly [string, string]> = {
  red: ["#F26C63", "#D6382C"],
  orange: ["#FCA652", "#F0761A"],
  yellow: ["#FFD34E", "#F2AE12"],
  green: ["#7FD98A", "#34A853"],
  teal: ["#5FD6C8", "#17A99A"],
  blue: ["#5EA9F7", "#1268D8"],
  indigo: ["#8E93F2", "#4E51CC"],
  purple: ["#C07BF0", "#8A32C9"],
  pink: ["#F572B0", "#D6217C"],
  gray: ["#A3A3AC", "#6B6B75"],
};

export {
  DEFAULT_ICON_TILE_SIZE,
  ICON_TILE_RADIUS_RATIO,
  ICON_TILE_GLYPH_RATIO,
  DEFAULT_GLOSS_OPACITY,
  ICON_TILE_TONES,
};
