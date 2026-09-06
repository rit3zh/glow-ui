import { Platform } from "react-native";

import type { TBarcodePalette } from "./types";

const MONO_FONT = Platform.select<string>({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

/** Every color the badge paints, overridable one key at a time */
const DEFAULT_PALETTE: TBarcodePalette = {
  bars: "#18181B",
  label: "#18181B",
};

const BAR_COUNT = 28;
const BAR_GAP = 1;
const BARS_HEIGHT = 24;

export { MONO_FONT, DEFAULT_PALETTE, BAR_COUNT, BAR_GAP, BARS_HEIGHT };
