const CONF = {
  patternScale: 0.94,
  refraction: 0.012,
  edge: 0.4,
  patternBlur: 0,
  liquid: 0.1,
  speed: 0.3,
  edgeRadius: 9,
  rotation: 0,
  noiseStrength: 1,
  noiseScale: 1,
  bulgeStrength: 1,
  stripeWarp: 1,
  edgeSoftness: 1,
} as const;

const DEFAULT_LIGHT_COLOR = "#ffffff";
const DEFAULT_DARK_COLOR = "#231A10";

export { CONF, DEFAULT_DARK_COLOR, DEFAULT_LIGHT_COLOR };
