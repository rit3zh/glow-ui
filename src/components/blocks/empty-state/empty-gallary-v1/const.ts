import type { ICardLayout } from "./types";

export const DEFAULT_TITLE = "Add Photos to your walk";
export const DEFAULT_DESCRIPTION =
  "A space for your sunset, tree and flower photos.";
export const DEFAULT_ACTION_LABEL = "Add Photos";
export const DEFAULT_PHOTOS = [
  "https://i.pinimg.com/736x/c0/88/68/c08868e88e8d57b25d7b726d74dd0847.jpg",
  "https://i.pinimg.com/736x/3d/84/03/3d8403bf1594f1837d55c1e64045a883.jpg",
  "https://i.pinimg.com/736x/c2/fe/01/c2fe01ae1297bf78c338073ee48402f2.jpg",
  "https://i.pinimg.com/736x/22/36/63/2236638dfa53913ed8383b0dbf6ec748.jpg",
] as const;

export const STACK_WIDTH = 268;
export const STACK_HEIGHT = 212;
export const CARD_WIDTH = 132;
export const CARD_HEIGHT = 132;
export const CARD_RADIUS = 25;
export const CARD_BORDER_WIDTH = 4;
export const CARD_LAYOUTS: ICardLayout[] = [
  { rotate: "-16deg", translateX: -52, translateY: 6 },
  { rotate: "-5deg", translateX: -16, translateY: -35 },
  { rotate: "13deg", translateX: 66, translateY: 0 },
  { rotate: "-1deg", translateX: 0, translateY: 34 },
];
export const ACTION_HEIGHT = 50;
export const ACTION_HORIZONTAL_PADDING = 22;
export const COLORS = {
  screen: "#fbfbfb",
  card: "#ffffff",
  placeholder: "#ececee",
  ink: "#0b0b0c",
  body: "#111113",
  action: "#0b0b0c",
  actionPressed: "#333336",
  actionLabel: "#ffffff",
} as const;
