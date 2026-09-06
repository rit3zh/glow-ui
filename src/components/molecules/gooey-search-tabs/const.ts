import type { WithSpringConfig } from "react-native-reanimated";
import type { IColorScheme } from "./types";

const HEIGHT = 46;
const GAP = 10;
const H_PADDING = 14;
const ICON_SIZE = 18;

const DEFAULT_PLACEHOLDER = "Search";
const DEFAULT_INTENSITY = 0.5;
const _TAB_PADDING_HORIZONTAL = 32;

const DEFAULT_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 200,
  mass: 0.9,
};

const DEFAULT_COLOR_SCHEME: IColorScheme = {
  bg: "#ffffff",
  fg: "#1d1d1f",
  muted: "#8a8a90",
  indicator: "rgba(0,0,0,0.06)",
};

export {
  HEIGHT,
  GAP,
  H_PADDING,
  ICON_SIZE,
  DEFAULT_PLACEHOLDER,
  DEFAULT_INTENSITY,
  DEFAULT_SPRING,
  DEFAULT_COLOR_SCHEME,
  _TAB_PADDING_HORIZONTAL,
};
