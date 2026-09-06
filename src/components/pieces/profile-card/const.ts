import type { WithSpringConfig } from "react-native-reanimated";

import type { TProfilePalette } from "./types";

/** Light paper, as in the left card */
const DEFAULT_PALETTE: TProfilePalette = {
  surface: "#FAF7F0",
  cover: "#F4F4F5",
  name: "#18181B",
  handle: "#A1A1AA",
  bio: "#3F3F46",
  location: "#52525B",
  action: "#EDE9DD",
  actionLabel: "#18181B",
  avatarRing: "#FAF7F0",
  outline: "#FFFFFF",
};

/** Ink paper, as in the right card */
const DARK_PALETTE: TProfilePalette = {
  surface: "#131315",
  cover: "#1C1C1F",
  name: "#FAFAFA",
  handle: "#71717A",
  bio: "#D4D4D8",
  location: "#A1A1AA",
  action: "#26262A",
  actionLabel: "#FAFAFA",
  avatarRing: "#131315",
  outline: "#0B0B0C",
};

const CARD_WIDTH = 320;
const CARD_RADIUS = 34;
const OUTLINE_WIDTH = 10;
const COVER_HEIGHT = 108;
const COVER_BOTTOM_RADIUS = 20;
const ACTION_RADIUS = 14;

const AVATAR_SIZE = 60;
const AVATAR_RADIUS = 18;
const AVATAR_RING = 3;
const AVATAR_INSET = 16;
/** How much of the avatar hangs below the cover */
const AVATAR_OVERLAP = 0.45;

const PRESS_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 320,
  mass: 0.5,
};

export {
  DEFAULT_PALETTE,
  DARK_PALETTE,
  CARD_WIDTH,
  CARD_RADIUS,
  OUTLINE_WIDTH,
  COVER_HEIGHT,
  COVER_BOTTOM_RADIUS,
  ACTION_RADIUS,
  AVATAR_SIZE,
  AVATAR_RADIUS,
  AVATAR_RING,
  AVATAR_INSET,
  AVATAR_OVERLAP,
  PRESS_SPRING,
};
