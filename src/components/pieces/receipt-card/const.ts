import { Platform } from "react-native";

import type { TReceiptPalette } from "./types";

const MONO_FONT = Platform.select<string>({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

/** Every color the receipt paints, overridable one key at a time */
const DEFAULT_PALETTE: TReceiptPalette = {
  paper: "#FFFFFF",
  ink: "#18181B",
  muted: "#71717A",
  rule: "#D4D4D8",
  leader: "#A1A1AA",
  accent: "#18181B",
};

const PAPER_WIDTH = 320;
const PAPER_PADDING = 20;
const TILT_ANGLE = "-1deg";

const TEETH_WIDTH = 20;
const TEETH_HEIGHT = 10;

const BAR_COUNT = 32;
const BARCODE_HEIGHT = 32;
const BARCODE_WIDTH = 160;

export {
  MONO_FONT,
  DEFAULT_PALETTE,
  PAPER_WIDTH,
  PAPER_PADDING,
  TILT_ANGLE,
  TEETH_WIDTH,
  TEETH_HEIGHT,
  BAR_COUNT,
  BARCODE_HEIGHT,
  BARCODE_WIDTH,
};
