import type { IWelcomeAction } from "./types";

export const DEFAULT_TITLE = "Your Music. Your Sound. Your Way.";
export const DEFAULT_SUBTITLE = "Discover music, create songs.";

export const DEFAULT_ACTIONS: IWelcomeAction[] = [
  {
    key: "apple",
    label: "Sign in with Apple",
    icon: "apple",
    variant: "primary",
  },
  {
    key: "google",
    label: "Sign in with Google",
    icon: "google",
    variant: "secondary",
  },
  {
    key: "email",
    label: "Continue with email",
    icon: "email",
    variant: "secondary",
  },
];

export const GRADIENT_RATIO = 0.58;
export const MESH_COLORS = {
  violet: [0.478, 0.294, 0.827],
  indigo: [0.337, 0.392, 0.855],
  blush: [0.902, 0.376, 0.518],
  coral: [0.957, 0.541, 0.451],
} as const;

export const GRADIENT_SEED = 1.1;

export const GRADIENT_WARP = 24;

export const GRADIENT_ANGLE = -24;

export const GRADIENT_SWIRL = 24;

export const GRADIENT_BEND = 3.5;

export const GRAIN_INTENSITY = 0.0882;

export const GRADIENT_ASPECT = 1.7;

export const GRADIENT_SHADER =  `
uniform float2 resolution;
uniform float seed;
uniform float warp;
uniform float angle;
uniform float swirl;
uniform float bend;
uniform float aspect;
uniform float grain;
uniform half3 c1;
uniform half3 c2;
uniform half3 c3;
uniform half3 c4;

float2x2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return float2x2(c, -s, s, c);
}

float2 hash(float2 p) {
  p = float2(dot(p, float2(2127.1, 81.17)), dot(p, float2(1269.5, 283.37)));
  return fract(sin(p) * 43758.5453);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float2 u = f * f * (3.0 - 2.0 * f);

  float n = mix(
    mix(dot(-1.0 + 2.0 * hash(i + float2(0.0, 0.0)), f - float2(0.0, 0.0)),
        dot(-1.0 + 2.0 * hash(i + float2(1.0, 0.0)), f - float2(1.0, 0.0)), u.x),
    mix(dot(-1.0 + 2.0 * hash(i + float2(0.0, 1.0)), f - float2(0.0, 1.0)),
        dot(-1.0 + 2.0 * hash(i + float2(1.0, 1.0)), f - float2(1.0, 1.0)), u.x),
    u.y);
  return 0.5 + 0.5 * n;
}

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / resolution;

  float2 tuv = uv - 0.5;

  float degree = noise(float2(seed, tuv.x * tuv.y)) - 0.5;
  tuv.y *= 1.0 / aspect;
  tuv = tuv * rot(radians(angle + degree * swirl));
  tuv.y *= aspect;

  float frequency = 5.0;
  float amplitude = bend;
  tuv.x += sin(tuv.y * frequency + warp) / amplitude;
  tuv.y += sin(tuv.x * frequency * 1.5 + warp) / (amplitude * 0.5);

  float x = (tuv * rot(radians(-5.0))).x;
  half3 layer1 = mix(c3, c2, half(smoothstep(-0.3, 0.2, x)));
  half3 layer2 = mix(c4, c1, half(smoothstep(-0.3, 0.2, x)));

  half3 color = mix(layer1, layer2, half(smoothstep(0.5, -0.3, tuv.y)));

  color = color - half(length(hash(uv)) * grain);

  return half4(color, 1.0);
}
`;

export const LOGO_SIZE = 62;

export const SHEET_HORIZONTAL_PADDING = 24;
export const SHEET_RADIUS = 0;
export const SHEET_OVERLAP = 34;
export const ACTION_HEIGHT = 56;
export const ACTION_RADIUS = ACTION_HEIGHT / 2;
export const ACTION_GAP = 12;
export const ICON_SIZE = 18;

export const COLORS = {
  sheet: "#fbfbfb",
  title: "#111111",
  subtitle: "#8a8a8e",
  primary: "#191919",
  primaryPressed: "#000000",
  primaryLabel: "#ffffff",
  secondary: "#efeff0",
  secondaryPressed: "#e4e4e6",
  secondaryLabel: "#111111",
  logo: "#ffffff",
} as const;
