export const DEFAULT_TITLE = "Welcome to Beside";
export const DEFAULT_SUBTITLE =
  "Starting today, your AI phone assistant saves you 2 hours daily.";
export const DEFAULT_ACTION_LABEL = "Get Started";
export const DEFAULT_FOOTER_PROMPT = "Already have an account?";
export const DEFAULT_FOOTER_ACTION_LABEL = "Log in";
export const DEFAULT_LEGAL_PREFIX = "By tapping Get Started, I agree with the";
export const DEFAULT_TERMS_LABEL = "Terms of Service";
export const DEFAULT_LEGAL_SEPARATOR = "and";
export const DEFAULT_PRIVACY_LABEL = "Privacy Policy";
export const DEFAULT_LEGAL_SUFFIX = ".";

export const ORB_CENTER = [0.5, 0.42];
export const ORB_SCALE = [0.62, 0.5];

export const ORB_BACKDROP = [0.042, 0.042, 0.05];
export const ORB_WARM = [0.965, 0.925, 0.855];
export const ORB_BLUE = [0.09, 0.235, 0.98];

export const ORB_WARM_OFFSET = [0.07, 0.02];
export const ORB_WARM_RING = 0.9;
export const ORB_WARM_WIDTH = 0.12;
export const ORB_WARM_GAIN = 0.5;
export const ORB_WARM_ANGLE = 88;
export const ORB_WARM_SPREAD = 0.7;
export const ORB_BLUE_OFFSET = [-0.09, 0.06];
export const ORB_BLUE_RING = 0.72;
export const ORB_BLUE_WIDTH = 0.2;
export const ORB_BLUE_GAIN = 1.7;
export const ORB_BLUE_ANGLE = 0;
export const ORB_BLUE_SPREAD = 1.2;
export const ORB_HAZE_RING = 0.78;
export const ORB_HAZE_WIDTH = 0.5;
export const ORB_HAZE_GAIN = 0.09;
export const ORB_CLOUD = 0.055;
export const ORB_CLOUD_SCALE = 1.7;
export const ORB_DOME_FADE = 0.08;
export const ORB_EXPOSURE = 1.25;
export const ORB_GRAIN = 0.14;
export const ORB_GRAIN_SCALE = 2;
export const ORB_SHADER =  `
uniform float2 resolution;
uniform float2 center;
uniform float2 orbScale;
uniform float3 backdrop;
uniform float3 warmColor;
uniform float3 blueColor;
uniform float2 warmOffset;
uniform float warmRing;
uniform float warmWidth;
uniform float warmGain;
uniform float warmAngle;
uniform float warmSpread;
uniform float2 blueOffset;
uniform float blueRing;
uniform float blueWidth;
uniform float blueGain;
uniform float blueAngle;
uniform float blueSpread;
uniform float hazeRing;
uniform float hazeWidth;
uniform float hazeGain;
uniform float cloud;
uniform float cloudScale;
uniform float domeFade;
uniform float exposure;
uniform float grain;
uniform float grainScale;

float hash1(float2 p) {
  return fract(sin(dot(p, float2(12.9898, 78.233))) * 43758.5453);
}

float vnoise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float2 u = f * f * (3.0 - 2.0 * f);
  float a = hash1(i);
  float b = hash1(i + float2(1.0, 0.0));
  float c = hash1(i + float2(0.0, 1.0));
  float d = hash1(i + float2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(float2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.03;
    a = a * 0.2;
  }
  return v;
}

float band(float r, float ring, float width) {
  float t = (r - ring) / width;
  return exp(-t * t);
}

float lobe(float2 dir, float deg, float spread) {
  float a = radians(deg);
  float2 axis = float2(sin(a), -cos(a));
  return pow(clamp(0.5 + 0.5 * dot(dir, axis), 0.0, 1.0), spread);
}

half4 main(float2 fragCoord) {
  float2 q = (fragCoord - center * resolution) / (orbScale * resolution.x);
  float base = length(q);
  float2 dir = base > 0.0001 ? q / base : float2(0.0, -1.0);

  float nWarm = fbm(q * cloudScale + 4.1) - 0.47;
  float nBlue = fbm(q * cloudScale + 13.7) - 0.47;

  float rWarm = length(q - warmOffset) + nWarm * cloud;
  float rBlue = length(q - blueOffset) + nBlue * cloud;

  float dome = smoothstep(domeFade, -0.6, q.y);

  float warm = band(rWarm, warmRing, warmWidth) * lobe(dir, warmAngle, warmSpread) * warmGain;
  float blue = band(rBlue, blueRing, blueWidth) * lobe(dir, blueAngle, blueSpread) * blueGain;
  float haze = band(base, hazeRing, hazeWidth) * hazeGain;

  float3 glow = blueColor * blue + warmColor * (warm + haze);
  float3 color = backdrop + glow * dome;

  color = 1.0 - exp(-color * exposure);

  float coarse = hash1(floor(fragCoord / grainScale));
  float fine = hash1(fragCoord * 1.37 + 7.1);
  float n = mix(coarse, fine, 0.35) - 0.5;
  float luma = dot(color, float3(0.299, 0.587, 0.114));
  color += n * grain * (0.18 + 1.5 * luma);

  return half4(half3(clamp(color, 0.0, 1.0)), 1.0);
}
`;

export const LOGO_SIZE = 46;
export const CONTENT_HORIZONTAL_PADDING = 24;
export const ACTION_HEIGHT = 58;
export const ACTION_RADIUS = ACTION_HEIGHT / 2;

export const COLORS = {
  screen: "#0e0e11",
  title: "#ffffff",
  subtitle: "#9b9ba1",
  action: "#ffffff",
  actionPressed: "#e6e6ea",
  actionLabel: "#0b0b0d",
  footer: "#8e8e94",
  footerAction: "#ffffff",
  legal: "#5c5c62",
  legalLink: "#8e8e94",
  logo: "#ffffff",
} as const;
