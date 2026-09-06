import type { WithSpringConfig } from "react-native-reanimated";
import type { TPhotoStackPalette } from "./types";

const DEFAULT_PALETTE: TPhotoStackPalette = {
  frame: "#FFFFFF",
  photo: "#F4F4F5",
  caption: "#71717A",
};

const STACK_SIZE = 128;

// Read by child order: the deck fans left, centre, right.
const ROTATIONS: readonly number[] = [-6, 2, -2];
const OFFSETS: readonly number[] = [-24, 0, 24];

const LIFT = 8;

const LIFT_SPRING: WithSpringConfig = {
  damping: 16,
  stiffness: 220,
  mass: 0.6,
};

export { DEFAULT_PALETTE, STACK_SIZE, ROTATIONS, OFFSETS, LIFT, LIFT_SPRING };
