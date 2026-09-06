import type { IListPalette, TListTheme } from "./types";

const LIST_ROW_HEIGHT = 46;
const LIST_ROW_PADDING_X = 16;
const LIST_CORNER_RADIUS = 22;
const LIST_SECTION_GAP = 28;
const LIST_ICON_WIDTH = 24;
const LIST_ICON_GAP = 10;
const LIST_SEPARATOR_INSET = LIST_ROW_PADDING_X;
const LIST_SEPARATOR_INSET_ICON =
  LIST_ROW_PADDING_X + LIST_ICON_WIDTH + LIST_ICON_GAP;

const LIST_THEME: Record<TListTheme, IListPalette> = {
  dark: {
    cardBg: "#16161a",
    cardBorder: "rgba(255, 255, 255, 0.02)",
    separator: "rgba(255,255,255,0.09)",
    header: "rgba(235,235,245,0.5)",
    footer: "rgba(235,235,245,0.4)",
    text: "#FAFAFA",
    secondaryText: "rgba(235,235,245,0.5)",
    chevron: "rgba(235,235,245,0.35)",
    destructive: "#FF6B6B",
    highlight: "rgba(255,255,255,0.07)",
  },
  light: {
    cardBg: "#FFFFFF",
    cardBorder: "rgba(60,60,67,0.08)",
    separator: "rgba(60,60,67,0.15)",
    header: "rgba(60,60,67,0.6)",
    footer: "rgba(60,60,67,0.5)",
    text: "#000000",
    secondaryText: "rgba(60,60,67,0.6)",
    chevron: "rgba(60,60,67,0.3)",
    destructive: "#DC2626",
    highlight: "rgba(0,0,0,0.04)",
  },
};

export {
  LIST_ROW_HEIGHT,
  LIST_ROW_PADDING_X,
  LIST_CORNER_RADIUS,
  LIST_SECTION_GAP,
  LIST_ICON_WIDTH,
  LIST_ICON_GAP,
  LIST_SEPARATOR_INSET,
  LIST_SEPARATOR_INSET_ICON,
  LIST_THEME,
};
