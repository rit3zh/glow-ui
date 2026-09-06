import type { TVerifiedPalette } from "./types";

const DEFAULT_PALETTE: TVerifiedPalette = {
  surface: "#FFFFFF",
  border: "#E4E4E7",
  name: "#18181B",
  handle: "#A1A1AA",
  check: "#0EA5E9",
  checkMark: "#FFFFFF",
};

const EMERALD_PALETTE: TVerifiedPalette = {
  surface: "#FFFFFF",
  border: "#E4E4E7",
  name: "#18181B",
  handle: "#A1A1AA",
  check: "#10B981",
  checkMark: "#FFFFFF",
};

const INK_PALETTE: TVerifiedPalette = {
  surface: "#131315",
  border: "#27272A",
  name: "#FAFAFA",
  handle: "#71717A",
  check: "#FAFAFA",
  checkMark: "#131315",
};

const BADGE_RADIUS = 999;
const BORDER_WIDTH = 1;
const PADDING_X = 12;
const PADDING_Y = 6;
const GAP = 6;
const CHECK_SIZE = 20;

export {
  DEFAULT_PALETTE,
  EMERALD_PALETTE,
  INK_PALETTE,
  BADGE_RADIUS,
  BORDER_WIDTH,
  PADDING_X,
  PADDING_Y,
  GAP,
  CHECK_SIZE,
};
