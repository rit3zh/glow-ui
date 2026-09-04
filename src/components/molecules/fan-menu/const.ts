import type { WithSpringConfig } from "react-native-reanimated";
import type { TFanDirection, TFanPosition, TItemDirection } from "./types";

const DEFAULT_BUTTON_SIZE = 60;
const DEFAULT_STAGGER = 30;
const DEFAULT_OFFSET = 32;
const DEFAULT_SPACING = 70;
const DEFAULT_SPREAD = 4;
const DEFAULT_TILT = 6;

const DEFAULT_SPRING: WithSpringConfig = {
  damping: 14,
  stiffness: 170,
  mass: 0.8,
} as const;

const DIRECTION_ANGLES: Record<TFanDirection, number> = {
  right: 0,
  up: 90,
  left: 180,
  down: 270,
} as const;

const DEFAULT_DIRECTION: TFanDirection = "up";
const DEFAULT_ITEM_DIRECTION: TItemDirection = "right";
const DEFAULT_POSITION: TFanPosition = "bottom-left";

export {
  DEFAULT_BUTTON_SIZE,
  DEFAULT_STAGGER,
  DEFAULT_SPACING,
  DEFAULT_SPREAD,
  DEFAULT_TILT,
  DEFAULT_OFFSET,
  DEFAULT_SPRING,
  DIRECTION_ANGLES,
  DEFAULT_DIRECTION,
  DEFAULT_ITEM_DIRECTION,
  DEFAULT_POSITION,
};
