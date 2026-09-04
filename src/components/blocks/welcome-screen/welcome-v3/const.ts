import { Platform } from "react-native";
import type { IWelcomeAction, IWelcomeCard } from "./types";

export const DEFAULT_WORDMARK = "trim";
export const DEFAULT_TITLE_LINES = ["Your own", "Personal Stylist"];

export const DEFAULT_ACTIONS: IWelcomeAction[] = [
  {
    key: "apple",
    label: "Continue with Apple",
    icon: "apple",
    variant: "primary",
  },
  {
    key: "google",
    label: "Continue with Google",
    icon: "google",
    variant: "primary",
  },
  {
    key: "email",
    label: "Continue with Email",
    variant: "secondary",
  },
];

export const DEFAULT_LEGAL_PREFIX = "By using Trim you agree to our";
export const DEFAULT_TERMS_LABEL = "Terms";
export const DEFAULT_LEGAL_SEPARATOR = "and";
export const DEFAULT_PRIVACY_LABEL = "Privacy Policy";

export const CARDS: IWelcomeCard[] = [
  { key: "a", size: 128, top: 0.13, left: 0.63, rotate: -13 },
  { key: "b", size: 116, top: 0.28, left: 0.03, rotate: 11 },
  { key: "c", size: 146, top: 0.41, left: 0.56, rotate: -5 },
  { key: "d", size: 94, top: 0.5, left: 0.13, rotate: 17 },
];

export const CARD_RADIUS = 28;

export const ICON_SIZE = 17;
export const CONTENT_HORIZONTAL_PADDING = 24;
export const ACTION_HEIGHT = 50;
export const ACTION_RADIUS = 12;
export const ACTION_GAP = 8;
export const WORDMARK_SIZE = 24;

export const SERIF_FONT = Platform.select({
  android: "serif",
  default: "Georgia",
});

export const COLORS = {
  screen: "#ffffff",
  card: "#f4f4f2",
  wordmark: "#0b0b0b",
  title: "#111111",
  primary: "#1c1c1c",
  primaryPressed: "#3a3a3a",
  primaryLabel: "#ffffff",
  secondary: "#f0f0ee",
  secondaryPressed: "#e4e4e0",
  secondaryLabel: "#111111",
  legal: "#adadaa",
  legalLink: "#8c8c88",
} as const;
