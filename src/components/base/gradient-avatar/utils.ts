import type { IMesh, IPalette, IPaletteConfig, Scheme } from "./types";

type BuiltScheme = Exclude<Scheme, "custom">;

const SCHEMES: BuiltScheme[] = [
  "analogous",
  "triadic",
  "splitComplementary",
  "tetradic",
  "complementary",
];

const GOLDEN_ANGLE_DEG = 137.5;
const GOLDEN_ANGLE_RAD = GOLDEN_ANGLE_DEG * (Math.PI / 180);

const BLOB_STOPS: [number, number][] = [
  [0, 1],
  [35, 0.82],
  [65, 0.4],
  [100, 0],
];

const makeRng = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const hexFromHsl = (h: number, s: number, l: number): string => {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const secondary = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const lift = l - chroma / 2;

  const [r, g, b] =
    h < 60
      ? [chroma, secondary, 0]
      : h < 120
        ? [secondary, chroma, 0]
        : h < 180
          ? [0, chroma, secondary]
          : h < 240
            ? [0, secondary, chroma]
            : h < 300
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];

  const channel = (n: number) =>
    Math.round((n + lift) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
};

const spreadHues = (base: number, scheme: BuiltScheme): number[] => {
  switch (scheme) {
    case "analogous":
      return [base - 40, base - 15, base + 15, base + 40];
    case "triadic":
      return [base, base + 120, base + 240];
    case "splitComplementary":
      return [base, base + 150, base + 210];
    case "tetradic":
      return [base, base + 90, base + 180, base + 270];
    case "complementary":
      return [base, base + 180, base + 25, base + 205];
  }
};

const hashToken = (input: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x7feb352d) >>> 0;
  h ^= h >>> 15;
  h = Math.imul(h, 0x846ca68b) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
};

const normalizeSeed = (token: number | string): number =>
  typeof token === "number" ? token >>> 0 : hashToken(token);

const cleanHex = (value: string): string | null => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  let body = match[1];
  if (body.length === 3) {
    body = body[0] + body[0] + body[1] + body[1] + body[2] + body[2];
  }
  return `#${body.toUpperCase()}`;
};

const cleanPalette = (palette?: string[]): string[] | null => {
  if (!palette?.length) return null;
  const out: string[] = [];
  for (const entry of palette) {
    const hex = cleanHex(entry);
    if (hex) out.push(hex);
  }
  return out.length ? out : null;
};

const derivePalette = (
  token: number | string,
  config: IPaletteConfig = {},
): IPalette => {
  const seed = normalizeSeed(token);
  const supplied = cleanPalette(config.palette);
  if (supplied) {
    const offset = seed % supplied.length;
    const swatches = supplied.map(
      (_, i) => supplied[(i + offset) % supplied.length],
    );
    return { seed, swatches, scheme: "custom" };
  }

  const rng = makeRng(seed);
  const baseHue = (seed * GOLDEN_ANGLE_DEG) % 360;
  const scheme = SCHEMES[Math.floor(rng() * SCHEMES.length)];
  const swatches = spreadHues(baseHue, scheme).map((hue) =>
    hexFromHsl(hue, 72 + rng() * 26, 52 + rng() * 16),
  );
  return { seed, swatches, scheme };
};

const withAlpha = (hex: string, alpha: number): string => {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const radialLayer = (
  cx: number,
  cy: number,
  r: number,
  color: string,
): string => {
  const stops = BLOB_STOPS.map(
    ([pos, a]) => `${withAlpha(color, a)} ${pos}%`,
  ).join(", ");
  return `radial-gradient(${r}px ${r}px at ${cx}px ${cy}px, ${stops})`;
};

const buildMesh = (
  token: number | string,
  size: number,
  config: IPaletteConfig & { sheen?: boolean } = {},
): IMesh => {
  const seed = normalizeSeed(token);
  const { swatches } = derivePalette(seed, config);
  const rng = makeRng(seed ^ 0x9e3779b9);

  const count = 7 + Math.floor(rng() * 4);
  const center = size / 2;
  const jitter = () => (rng() - 0.5) * size * 0.12;

  const blobs = Array.from({ length: count }, (_, i) => {
    const angle = i * GOLDEN_ANGLE_RAD;
    const spread = Math.sqrt((i + 0.5) / count) * size * 0.46;
    return {
      cx: center + Math.cos(angle) * spread + jitter(),
      cy: center + Math.sin(angle) * spread + jitter(),
      r: size * (0.34 + rng() * 0.34),
      color: swatches[i % swatches.length],
    };
  });

  blobs.sort((a, b) => b.r - a.r);

  const vignette =
    `radial-gradient(farthest-side at 50% 45%, ` +
    `rgba(0, 0, 0, 0) 58%, rgba(0, 0, 0, 0.22) 100%)`;

  const sheen =
    `linear-gradient(135deg, ` +
    `rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.06) 34%, ` +
    `rgba(255, 255, 255, 0) 60%)`;

  const layers = [
    ...(config.sheen === false ? [] : [sheen]),
    vignette,
    ...blobs
      .slice()
      .reverse()
      .map((b) => radialLayer(b.cx, b.cy, b.r, b.color)),
  ];

  return { fill: swatches[0], layers };
};

export { normalizeSeed, hashToken, derivePalette, buildMesh };
