import { Platform } from "react-native";

import type { TTicketPalette } from "./types";

const MONO_FONT = Platform.select<string>({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

/** Every color the ticket paints, overridable one key at a time */
const DEFAULT_PALETTE: TTicketPalette = {
  surface: "#18181B",
  ink: "#FAFAFA",
  muted: "#A1A1AA",
  perforation: "#52525B",
  bars: "#FAFAFA",
};

const TICKET_WIDTH = 360;
const TICKET_RADIUS = 16;
const STUB_WIDTH = 96;
const NOTCH_RADIUS = 9;

const BAR_COUNT = 18;
const BARCODE_HEIGHT = 64;
const BARCODE_WIDTH = 32;

export {
  MONO_FONT,
  DEFAULT_PALETTE,
  TICKET_WIDTH,
  TICKET_RADIUS,
  STUB_WIDTH,
  NOTCH_RADIUS,
  BAR_COUNT,
  BARCODE_HEIGHT,
  BARCODE_WIDTH,
};
