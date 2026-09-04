import { Easing } from "react-native-reanimated";

const DEFAULT_SWEEP_COLORS = [
  "#c679c4",
  "#fa3d1d",
  "#ffb005",
  "#e1e1fe",
  "#0358f7",
];

const DEFAULT_BASE_COLOR = "#111111";
const DEFAULT_DURATION = 1500;
const DEFAULT_DELAY = 0;
const DEFAULT_LOOP_DELAY = 500;
const DEFAULT_BAND_RATIO = 0.34;
const SWEEP_EASING = Easing.inOut(Easing.cubic);
const SWAP_EASING = Easing.bezier(0.22, 1, 0.36, 1);
const EXIT_DURATION = 260;
const ENTER_DURATION = 380;
const SWAP_SHIFT = 12;

export {
  DEFAULT_BAND_RATIO,
  DEFAULT_BASE_COLOR,
  DEFAULT_DELAY,
  DEFAULT_DURATION,
  DEFAULT_LOOP_DELAY,
  DEFAULT_SWEEP_COLORS,
  ENTER_DURATION,
  EXIT_DURATION,
  SWAP_EASING,
  SWAP_SHIFT,
  SWEEP_EASING,
};
