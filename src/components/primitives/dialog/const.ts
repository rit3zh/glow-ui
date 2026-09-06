import type {
  WithSpringConfig,
  WithTimingConfig,
} from "react-native-reanimated";
import type { IDialogPalette, TDialogTheme } from "./types";

const DIALOG_THEME: Record<TDialogTheme, IDialogPalette> = {
  dark: {
    scrim: "rgba(9,9,11,0.55)",
    surface: "#18181B",
    border: "rgba(255,255,255,0.08)",
    title: "#FAFAFA",
    description: "#A1A1AA",
    close: "#D4D4D8",
    closeBg: "rgba(255,255,255,0.08)",
  },
  light: {
    scrim: "rgba(244,244,245,0.55)",
    surface: "#FFFFFF",
    border: "rgba(0,0,0,0.08)",
    title: "#18181B",
    description: "#52525B",
    close: "#3F3F46",
    closeBg: "rgba(0,0,0,0.06)",
  },
};

const DIALOG_CONTENT_SPRING: WithSpringConfig = {
  stiffness: 150,
  damping: 25,
  mass: 1,
  overshootClamping: false,
};

const DIALOG_OVERLAY_TIMING: WithTimingConfig = {
  duration: 450,
};
const DIALOG_EXIT_TIMING: WithTimingConfig = {
  duration: 450,
};
const DIALOG_BLUR_INTENSITY = 28;
const DIALOG_ANDROID_BLUR_RATIO = 0.5;
const DIALOG_ROTATION = 20;
const DIALOG_SCALE = 0.8;
const DIALOG_PERSPECTIVE = 500;
const DIALOG_DISABLED_OPACITY = 0.5;

export {
  DIALOG_THEME,
  DIALOG_CONTENT_SPRING,
  DIALOG_OVERLAY_TIMING,
  DIALOG_EXIT_TIMING,
  DIALOG_BLUR_INTENSITY,
  DIALOG_ANDROID_BLUR_RATIO,
  DIALOG_ROTATION,
  DIALOG_SCALE,
  DIALOG_PERSPECTIVE,
  DIALOG_DISABLED_OPACITY,
};
