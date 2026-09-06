import { Platform } from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";
import type { TPolaroidPalette } from "./types";

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

const DEFAULT_PALETTE: TPolaroidPalette = {
  paper: "#FFFFFF",
  caption: "#27272A",
  meta: "#A1A1AA",
  photo: "#F4F4F5",
  tape: "rgba(254, 243, 199, 0.9)",
  tapeBorder: "rgba(253, 230, 138, 0.7)",
};

const POLAROID_WIDTH = 280;
const TILT = -2;
const LIFT = 6;

const TAPE_WIDTH = 96;
const TAPE_HEIGHT = 28;
const TAPE_TILT = -3;

const LIFT_SPRING: WithSpringConfig = {
  damping: 16,
  stiffness: 220,
  mass: 0.6,
};

export {
  SERIF_FONT,
  MONO_FONT,
  DEFAULT_PALETTE,
  POLAROID_WIDTH,
  TILT,
  LIFT,
  TAPE_WIDTH,
  TAPE_HEIGHT,
  TAPE_TILT,
  LIFT_SPRING,
};
