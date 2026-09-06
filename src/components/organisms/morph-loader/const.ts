const M3_LOADING_SEQUENCE = [
  "soft-burst",
  "cookie-9-sided",
  "pentagon",
  "pill",
  "sunny",
  "cookie-4-sided",
  "oval",
] as const;

const VIEWBOX = 100;
const DEG_TO_RAD = Math.PI / 180;
const SQRT2 = Math.SQRT2;
const STEPS_PER_SEGMENT = 18;
const POINTS_PER_FRAME = 96;

const DISTANCE_EPSILON = 1e-4;
const ANGLE_EPSILON = 1e-6;
const RELAXED_DISTANCE_EPSILON = 5e-3;
const FLOAT_PI = Math.PI;
const TWO_PI = 2 * Math.PI;

export {
  M3_LOADING_SEQUENCE,
  VIEWBOX,
  DEG_TO_RAD,
  SQRT2,
  STEPS_PER_SEGMENT,
  POINTS_PER_FRAME,
  DISTANCE_EPSILON,
  ANGLE_EPSILON,
  RELAXED_DISTANCE_EPSILON,
  FLOAT_PI,
  TWO_PI,
};
