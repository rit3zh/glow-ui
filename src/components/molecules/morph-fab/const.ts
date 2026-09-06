import type { WithSpringConfig } from "react-native-reanimated";

const MORPH_OPEN_SPRING: WithSpringConfig = {
  stiffness: 140,
  damping: 17,
  mass: 0.45,
};
const MORPH_CLOSE_SPRING: WithSpringConfig = {
  stiffness: 170,
  damping: 20,
  mass: 0.45,
};

const GOO_MATRIX = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 22, -11,
];

const DEFAULT_DIRECTION = "up";
const DEFAULT_ALIGN = "center";
const DEFAULT_SIDE_OFFSET = 16;
const DEFAULT_SPACING = 12;
const DEFAULT_ITEM_RADIUS = 999;
const DEFAULT_ITEM_PADDING = 16;
const DEFAULT_ITEM_GAP = 10;
const DEFAULT_TRIGGER_SIZE = 60;
const DEFAULT_TRIGGER_RADIUS = 999;
const DEFAULT_COLOR = "#ffffff";
const DEFAULT_GOO_STRENGTH = 9;
const DEFAULT_STAGGER = 0.1;
const DEFAULT_TRIGGER_ROTATION = 45;
const DEFAULT_PRESS_SCALE = 0.94;
const DEFAULT_ITEM_PRESS_SCALE = 0.94;
const LAYER_PADDING = 36;

const PRESS_IN_SPRING: WithSpringConfig = {
  stiffness: 150,
  damping: 14,
  mass: 0.5,
};
const PRESS_OUT_SPRING: WithSpringConfig = {
  stiffness: 260,
  damping: 16,
  mass: 0.5,
};

export {
  MORPH_OPEN_SPRING,
  MORPH_CLOSE_SPRING,
  GOO_MATRIX,
  DEFAULT_DIRECTION,
  DEFAULT_ALIGN,
  DEFAULT_SIDE_OFFSET,
  DEFAULT_SPACING,
  DEFAULT_ITEM_RADIUS,
  DEFAULT_ITEM_PADDING,
  DEFAULT_ITEM_GAP,
  DEFAULT_TRIGGER_SIZE,
  DEFAULT_TRIGGER_RADIUS,
  DEFAULT_COLOR,
  DEFAULT_GOO_STRENGTH,
  DEFAULT_STAGGER,
  DEFAULT_TRIGGER_ROTATION,
  DEFAULT_PRESS_SCALE,
  DEFAULT_ITEM_PRESS_SCALE,
  LAYER_PADDING,
  PRESS_IN_SPRING,
  PRESS_OUT_SPRING,
};
