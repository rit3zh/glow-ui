import type { IPerformance } from "./types";

const DEFAULTS = {
  width: 320,
  height: 160,
  speed: 1,
  level: 0.5,
  amplitude: 1,
  thickness: 1,
  strandCount: 4,
  hueShift: 0,
  exposure: 1.45,
  animated: true,
} as const;

const DEFAULT_PERFORMANCE: Required<IPerformance> = {
  undersampling: 1,
  fpsLock: -1,
};

export { DEFAULTS, DEFAULT_PERFORMANCE };
