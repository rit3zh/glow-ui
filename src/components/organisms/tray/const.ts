import type {
  WithSpringConfig,
  WithTimingConfig,
} from "react-native-reanimated";
import { Easing } from "react-native-reanimated";

import type { ITrayMotion, ITrayPalette, TTrayTheme } from "./types";

const PRESENT_SPRING: WithSpringConfig = {
  damping: 30,
  stiffness: 280,
  mass: 0.9,
  overshootClamping: false,
};

const HEIGHT_SPRING: WithSpringConfig = {
  damping: 26,
  stiffness: 260,
  mass: 0.75,
  overshootClamping: true,
};

const DETENT_SPRING: WithSpringConfig = {
  damping: 32,
  stiffness: 320,
  mass: 0.9,
  overshootClamping: false,
};

const GESTURE_ACTIVE_OFFSET: [number, number] = [-8, 8];
const GESTURE_FAIL_OFFSET: [number, number] = [-14, 14];

const DRAG_RETURN_SPRING: WithSpringConfig = {
  damping: 26,
  stiffness: 300,
  mass: 0.9,
};

const VIEW_IN_SPRING: WithSpringConfig = {
  damping: 26,
  stiffness: 280,
  mass: 0.7,
};

const VIEW_OUT_TIMING: WithTimingConfig = {
  duration: 160,
  easing: Easing.out(Easing.quad),
};

const DEFAULT_RADIUS = 38;
const DEFAULT_CLOSE_THRESHOLD = 96;
const DEFAULT_CLOSE_VELOCITY = 900;

const PRESENT_START_SCALE = 0.9;
const TRAVEL_PADDING = 56;

const VIEW_SLIDE = 26;
const VIEW_START_SCALE = 0.9;

const OVER_DRAG_RESISTANCE = 3;
const BACKDROP_DRAG_FALLOFF = 0.45;
const SCROLL_DECELERATION = 0.998;

const DEFAULT_MOTION: ITrayMotion = {
  presentSpring: PRESENT_SPRING,
  startScale: PRESENT_START_SCALE,
  travelPadding: TRAVEL_PADDING,
  heightSpring: HEIGHT_SPRING,
  detentSpring: DETENT_SPRING,
  dragReturnSpring: DRAG_RETURN_SPRING,
  overDragFactor: 0.55,
  backdropFalloff: BACKDROP_DRAG_FALLOFF,
  flickProjection: 0.35,
  viewInSpring: VIEW_IN_SPRING,
  viewOutTiming: VIEW_OUT_TIMING,
  viewSlide: VIEW_SLIDE,
  viewStartScale: VIEW_START_SCALE,
  viewAxis: "x",
  activeOffsetY: GESTURE_ACTIVE_OFFSET,
  failOffsetX: GESTURE_FAIL_OFFSET,
  scrollDeceleration: SCROLL_DECELERATION,
};

const LIGHT_PALETTE: ITrayPalette = {
  surface: "#ffffff",
  border: "#e3e7ec",
  handle: "rgba(60,60,67,0.3)",
  text: "#111111",
  mutedText: "#6d7480",
  backdrop: "rgba(0,0,0,0.4)",
};

const DARK_PALETTE: ITrayPalette = {
  surface: "#171716",
  border: "#2b2a25",
  handle: "rgba(246,243,236,0.28)",
  text: "#f6f3ec",
  mutedText: "#9a958a",
  backdrop: "rgba(0,0,0,0.55)",
};

const PALETTES: Record<TTrayTheme, ITrayPalette> = {
  light: LIGHT_PALETTE,
  dark: DARK_PALETTE,
};

export {
  BACKDROP_DRAG_FALLOFF,
  DEFAULT_MOTION,
  DETENT_SPRING,
  GESTURE_ACTIVE_OFFSET,
  GESTURE_FAIL_OFFSET,
  DARK_PALETTE,
  DEFAULT_CLOSE_THRESHOLD,
  DEFAULT_CLOSE_VELOCITY,
  DEFAULT_RADIUS,
  DRAG_RETURN_SPRING,
  HEIGHT_SPRING,
  LIGHT_PALETTE,
  OVER_DRAG_RESISTANCE,
  PALETTES,
  PRESENT_SPRING,
  PRESENT_START_SCALE,
  SCROLL_DECELERATION,
  TRAVEL_PADDING,
  VIEW_IN_SPRING,
  VIEW_OUT_TIMING,
  VIEW_SLIDE,
  VIEW_START_SCALE,
};
