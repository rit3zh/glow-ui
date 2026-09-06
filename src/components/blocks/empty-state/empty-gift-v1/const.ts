import type { IHaloRing } from "./types";

export const DEFAULT_ARTWORK_URI =
  "https://i.ibb.co/fYB6Qdzg/3dicons-gift-box-iso-color.png";

export const DEFAULT_TITLE = "Nothing here yet";

export const DEFAULT_DESCRIPTION = "Make someone's day with a little surprise.";

export const DEFAULT_ACTION_LABEL = "Send a gift";

export const CONTENT_HORIZONTAL_PADDING = 32;
export const ARTWORK_SIZE = 120;
export const SCENE_SIZE = 200;
export const HALO_CORE_SIZE = 152;
export const HALO_RINGS: IHaloRing[] = [
  { size: 288, opacity: 0.35 },
  { size: 220, opacity: 0.6 },
];
export const ACTION_HEIGHT = 50;
export const ACTION_HORIZONTAL_PADDING = 30;

export const COLORS = {
  screen: "#ffffff",
  halo: "#e9ebef",
  haloCore: "#f6f7f9",
  title: "#0f1013",
  description: "#8e9198",
  action: "#111114",
  actionPressed: "#33343a",
  actionLabel: "#ffffff",
} as const;
