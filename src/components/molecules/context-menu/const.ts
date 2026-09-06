import { Dimensions, Platform } from "react-native";
import type { WithSpringConfig } from "react-native-reanimated";

const IS_IOS = Platform.OS === "ios";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const DEFAULT_MENU_WIDTH = 250;
const GAP = 30;
const SCREEN_PADDING = 22;
const PREVIEW_SCALE = 1.04;
const PRESS_SCALE = 0.97;

const OPEN_SPRING: WithSpringConfig = {
  damping: 12,
  mass: 0.5,
  stiffness: 120,
};
const CLOSE_DURATION = 180;

const THEME = {
  light: {
    menuBg: IS_IOS ? "rgba(250,250,250,0.78)" : "rgba(250,250,250,0.98)",
    separator: "rgba(0,0,0,0.08)",
    groupGap: "rgba(0,0,0,0.04)",
    highlight: "rgba(0,0,0,0.07)",
    label: "rgba(60,60,67,0.6)",
    text: "#000000",
    destructive: "#ff3b30",
    backdrop: "rgba(0,0,0,0.08)",
    blurTint: "light" as const,
  },
  dark: {
    menuBg: IS_IOS ? "rgba(37,37,37,0.72)" : "rgba(37,37,37,0.96)",
    separator: "rgba(255,255,255,0.1)",
    groupGap: "rgba(0,0,0,0.4)",
    highlight: "rgba(255,255,255,0.12)",
    label: "rgba(235,235,245,0.6)",
    text: "#ffffff",
    destructive: "#ff453a",
    backdrop: "rgba(0,0,0,0.4)",
    blurTint: "dark" as const,
  },
};

export {
  IS_IOS,
  SCREEN_W,
  SCREEN_H,
  DEFAULT_MENU_WIDTH,
  GAP,
  SCREEN_PADDING,
  PREVIEW_SCALE,
  PRESS_SCALE,
  OPEN_SPRING,
  CLOSE_DURATION,
  THEME,
};
