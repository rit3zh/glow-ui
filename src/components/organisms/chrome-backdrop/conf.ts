const SHADER_SOURCE = /*wgsl */ `
uniform float2 uResolution;
uniform float  uAspect;
uniform float  uTime;
uniform float  uVariant;
uniform float  uIntensity;
uniform float  uGrain;
uniform float  uBaseOpacity;
uniform float3 uAccent;
uniform float3 uBase;

const float GRID_HORIZON = 0.60;
const float GRID_DEPTH = 0.40;

float hash(float2 p) {
  return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float a = hash(i);
  float b = hash(i + float2(1.0, 0.0));
  float c = hash(i + float2(0.0, 1.0));
  float d = hash(i + float2(1.0, 1.0));
  float2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(float2 p) {
  return noise(p) * 0.6 + noise(p * 2.1 + 4.0) * 0.3 + noise(p * 4.3 + 9.0) * 0.1;
}

float3 baseCol() {
  return uBase * uBaseOpacity;
}

float3 studio(float2 uv) {
  float2 c = (uv - float2(0.5, 0.44)) * float2(uAspect, 1.0);
  float radial = 1.0 - smoothstep(0.0, 0.95, length(c));

  float3 col = baseCol() * 0.30;
  col += uAccent * 0.42 * radial * radial;

  float horizon = 1.0 - smoothstep(0.0, 0.18, abs(uv.y - 0.32));
  col += uAccent * 0.14 * horizon;

  float ray = uv.x * uAspect * 0.5 + uv.y - fract(uTime * 0.03) * 2.0;
  col += uAccent * 0.10 * (1.0 - smoothstep(0.0, 0.24, abs(ray - 0.4))) * radial;

  return col * mix(0.35, 1.0, radial);
}

float3 pool(float2 uv) {
  float3 col = studio(uv);

  float2 p = uv * float2(uAspect, 1.0);
  float t = uTime * 0.08;
  float f1 = fbm(p * 1.4 + float2(t, -t * 0.7));
  float f2 = fbm(p * 1.9 + float2(-t * 0.8, t) + f1);

  col = mix(col, baseCol() * 1.6, smoothstep(0.35, 0.75, f1));
  col = mix(col, uAccent * 0.55, smoothstep(0.40, 0.85, f2));
  col = mix(col, mix(uAccent, float3(1.0), 0.6) * 0.16,
            smoothstep(0.60, 0.95, f1 * f2 * 1.6));

  return col;
}

float3 grid(float2 uv) {
  float sky = smoothstep(GRID_HORIZON, 0.0, uv.y);
  float3 col = mix(uAccent * 0.16, baseCol() * 0.22, sky);

  float centre = 1.0 - smoothstep(0.0, 0.8, abs(uv.x - 0.5) * uAspect);
  float glow = 1.0 - smoothstep(0.0, 0.26, abs(uv.y - GRID_HORIZON));
  col += uAccent * pow(glow, 2.0) * (0.30 + centre * 0.70) * 1.3;

  float line = 1.0 - smoothstep(0.0, 0.006, abs(uv.y - GRID_HORIZON));
  col += mix(uAccent, float3(1.0), 0.5) * line * centre * 0.7;

  float d = uv.y - GRID_HORIZON;
  if (d > 0.0) {

    float z = GRID_DEPTH / d;
    float gx = (uv.x - 0.5) * uAspect * z * 3.5;
    float gz = z - uTime * 0.55;

    float wz = min(0.006 * z * z / GRID_DEPTH, 0.5);
    float wx = min(0.006 * uAspect * z * 3.5, 0.5);

    float lz = 1.0 - smoothstep(0.0, wz, abs(fract(gz + 0.5) - 0.5));
    float lx = 1.0 - smoothstep(0.0, wx, abs(fract(gx + 0.5) - 0.5));

    col += uAccent * max(lx, lz) * smoothstep(0.0, 0.05, d) * 1.25;
  }

  return col;
}

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / uResolution;

  float3 col = baseCol();
  if (uVariant > 2.5)      col = grid(uv);
  else if (uVariant > 1.5) col = pool(uv);
  else if (uVariant > 0.5) col = studio(uv);

  col *= uIntensity;

  float lum = max(col.r, max(col.g, col.b));
  float alpha = clamp(uBaseOpacity + lum * 8.0, 0.0, 1.0);

  col += (noise(uv * float2(uAspect, 1.0) * 520.0) - 0.5) * uGrain;
  col += (hash(uv * 1024.0 + fract(uTime)) - 0.5) * (1.5 / 255.0);
  col = clamp(col, 0.0, 1.0);

  return half4(half3(col * alpha), half(alpha));
}
`;

const BACKDROP_VARIANTS = {
  solid: 0,
  studio: 1,
  pool: 2,
  grid: 3,
} as const;

export { SHADER_SOURCE, BACKDROP_VARIANTS };
