import { Platform } from "react-native";

import type { TCouponPalette } from "./types";

const MONO_FONT = Platform.select<string>({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

const DEFAULT_PALETTE: TCouponPalette = {
  surface: "#FFFFFF",
  border: "#E4E4E7",
  code: "#18181B",
  icon: "#A1A1AA",
  accent: "#FFE4E6",
  accentLabel: "#BE123C",
};

const EMERALD_PALETTE: TCouponPalette = {
  surface: "#FFFFFF",
  border: "#E4E4E7",
  code: "#18181B",
  icon: "#A1A1AA",
  accent: "#D1FAE5",
  accentLabel: "#047857",
};

const INK_PALETTE: TCouponPalette = {
  surface: "#131315",
  border: "#3F3F46",
  code: "#FAFAFA",
  icon: "#71717A",
  accent: "#FAFAFA",
  accentLabel: "#18181B",
};

const COUPON_RADIUS = 10;
const BORDER_WIDTH = 2;
const SECTION_PADDING_X = 12;
const SECTION_PADDING_Y = 8;
const ICON_SIZE = 16;

export {
  MONO_FONT,
  DEFAULT_PALETTE,
  EMERALD_PALETTE,
  INK_PALETTE,
  COUPON_RADIUS,
  BORDER_WIDTH,
  SECTION_PADDING_X,
  SECTION_PADDING_Y,
  ICON_SIZE,
};
