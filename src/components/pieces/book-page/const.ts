import { Platform } from "react-native";

import type { TBookPalette } from "./types";

const SERIF_FONT = Platform.select<string>({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

const MONO_FONT = Platform.select<string>({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

const DEFAULT_PALETTE: TBookPalette = {
  cover: "#18181B",
  coverText: "#FFFFFF",
  spine: "rgba(0, 0, 0, 0.25)",
  page: "#FFFFFF",
  pageEdge: "#E4E4E7",
  rule: "rgba(255, 255, 255, 0.2)",
};

const PAPER_PALETTE: TBookPalette = {
  cover: "#FFFBEB",
  coverText: "#18181B",
  spine: "rgba(0, 0, 0, 0.12)",
  page: "#FFFFFF",
  pageEdge: "#E4E4E7",
  rule: "rgba(0, 0, 0, 0.2)",
};

const BOOK_WIDTH = 240;
const ASPECT_RATIO = 3 / 4;

const PAGE_BLEED = 6;
const PAGE_INSET = 4;
const SPINE_INSET = 12;
const SPINE_WIDTH = 10;

const COVER_RADIUS = 6;
const SPINE_RADIUS = 2;

const PAGE_LINE = 3;
const PAGE_GAP = 1;

export {
  SERIF_FONT,
  MONO_FONT,
  DEFAULT_PALETTE,
  PAPER_PALETTE,
  BOOK_WIDTH,
  ASPECT_RATIO,
  PAGE_BLEED,
  PAGE_INSET,
  SPINE_INSET,
  SPINE_WIDTH,
  COVER_RADIUS,
  SPINE_RADIUS,
  PAGE_LINE,
  PAGE_GAP,
};
