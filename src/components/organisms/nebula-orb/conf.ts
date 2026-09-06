const NEBULA_ORB_SHADER = /*wgsl*/ `
uniform float2 uResolution;
uniform float  uTime;
uniform float3 uColor;
uniform float3 uHighlight;
uniform float  uTurbulence;
uniform float  uScale;
uniform float  uContrast;
uniform float  uEdgeSoftness;

float hash(float2 p) {
  return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + float2(0.0, 0.0)), hash(i + float2(1.0, 0.0)), u.x),
    mix(hash(i + float2(0.0, 1.0)), hash(i + float2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(float2 seed) {
  float2 p = seed;
  float v = 0.0;
  float a = 0.6;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / uResolution;
  float2 guv = float2(uv.x, 1.0 - uv.y);

  float t = uTime * 0.22;
  float2 drift = float2(
    sin(t) + 0.6 * sin(t * 1.7 + 1.3),
    cos(t * 0.8) + 0.6 * cos(t * 1.3 + 2.1));
  float2 p = float2(guv.x * 1.8, guv.y) * uScale + drift * 0.7;
  float2 q = float2(fbm(p + drift), fbm(p + float2(3.2, 1.5) - drift));
  float f = fbm(p + uTurbulence * q);

  float g = clamp(1.0 - guv.y, 0.0, 1.0);
  float anchor = smoothstep(0.0, 0.3, guv.y);
  float shade = clamp(g + (f - 0.5) * uContrast * anchor, 0.0, 1.0);

  float3 light = mix(uHighlight, uColor, 0.5);
  float3 col = uHighlight;
  col = mix(col, light, smoothstep(0.28, 0.52, shade));
  col = mix(col, uColor, smoothstep(0.58, 0.88, shade));

  float edge = smoothstep(0.5, 0.5 - uEdgeSoftness, distance(uv, float2(0.5)));
  return half4(half3(col) * half(edge), half(edge));
}
`;

export { NEBULA_ORB_SHADER };
