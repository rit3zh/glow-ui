import type { MetalStop } from "./types";

const CONF = {
  borderWidth: 2,
  softness: 1,
  opacity: 1,
  glow: 0.35,
  sheen: 0.35,
  speed: 1,
  bands: 3,
  sharpness: 2.2,
  distortion: 0.35,
  noiseScale: 1,
  bevel: 0.6,
  contrast: 1.2,
  direction: 0,
} as const;

/**
 * Default palette. Stops run from t = 0 to t = 1 and are mirrored by the
 * shader, so the first and last stop meet. Keep the darkest stops lifted off
 * black, otherwise the shadowed bands disappear into a dark background and
 * the border reads as a plain white line.
 */
const DEFAULT_COLORS: readonly MetalStop[] = [
  "#28304a",
  "#9fe8ff",
  "#ffffff",
  "#ffc2d8",
  "#8f7bd6",
  "#2b2740",
];

/**
 * Ready made palettes. Pass one straight to `colors`, or write your own —
 * any two to eight stops work.
 */
const METAL_COLORS = {
  chromatic: DEFAULT_COLORS,
  silver: ["#3c4148", "#c2cad2", "#ffffff", "#8d959e", "#eef2f6", "#454b52"],
  gold: ["#4a3410", "#c79b45", "#fff6d0", "#e0b25c", "#fffbe8", "#553d16"],
  copper: ["#3d1f12", "#b96a45", "#ffd9c0", "#8e4529", "#ffe6d6", "#42231a"],
  oil: ["#1a1140", "#00e5ff", "#f3e9ff", "#ff2fd0", "#7b3bff", "#1d1235"],
} as const satisfies Record<string, readonly MetalStop[]>;

export { CONF, DEFAULT_COLORS, METAL_COLORS };
