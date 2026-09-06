const SHADER_SOURCE = /*wgsl */ `
uniform shader uField;

uniform float2 uResolution;
uniform float2 uTexel;
uniform float2 uTilt;
uniform float  uAspect;
uniform float  uTime;
uniform float  uSlope;
uniform float  uHorizon;
uniform float  uRough;
uniform float  uFresnel;
uniform float  uSparkle;
uniform float  uEdge;
uniform float3 uS0;
uniform float3 uS1;
uniform float3 uS2;
uniform float3 uS3;
uniform float3 uS4;
uniform float3 uSpark;

const float TAU = 6.2831853;

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

float4 fieldAt(float2 uv) {
  return float4(uField.eval(uv * uResolution));
}

float heightAt(float2 uv) {
  float4 f = fieldAt(uv);
  return f.g + f.b * 0.18;
}

float step_k(float x, float k) {
  float w = max(k, 0.02) * 0.5;
  return smoothstep(0.5 - w, 0.5 + w, x);
}

float3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  float x = t * 4.0;
  float3 col = uS0;
  col = mix(col, uS1, smoothstep(0.0, 1.0, clamp(x, 0.0, 1.0)));
  col = mix(col, uS2, step_k(clamp(x - 1.0, 0.0, 1.0), uHorizon));
  col = mix(col, uS3, smoothstep(0.0, 1.0, clamp(x - 2.0, 0.0, 1.0)));
  col = mix(col, uS4, smoothstep(0.0, 1.0, clamp(x - 3.0, 0.0, 1.0)));
  return col;
}

float envT(float2 env) {
  float t = clamp(0.5 - env.y * 0.9, 0.0, 1.0);
  t = t + (t - 0.5) * 0.35 * (1.0 - abs(env.x));
  return clamp(t, 0.0, 1.0);
}

float3 toneMap(float3 c) {
  return c / (c + float3(0.85)) * 1.85;
}

float3 envSample(float2 uv) {
  float2 c = (uv - float2(0.5, 0.44)) * float2(uAspect, 1.0);
  float radial = 1.0 - smoothstep(0.0, 0.95, length(c));
  float3 col = uS2 * 0.6 + uS3 * 0.35 * radial;
  float f = noise(uv * float2(uAspect, 1.0) * 1.4 + float2(uTime * 0.08, -uTime * 0.056));
  return mix(col, uS3 * 0.5, smoothstep(0.4, 0.85, f));
}

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / uResolution;

  float2 wuv = uv - uTilt * 0.012;

  float4 f0 = fieldAt(wuv);
  float crisp = f0.r;
  float height = f0.g + f0.b * 0.18;

  if (height < 0.01) {
    return half4(0.0);
  }

  float g1 = 1.6;
  float g2 = 3.4;

  float aL = heightAt(wuv - float2(g1, 0.0) * uTexel);
  float aR = heightAt(wuv + float2(g1, 0.0) * uTexel);
  float aD = heightAt(wuv - float2(0.0, g1) * uTexel);
  float aU = heightAt(wuv + float2(0.0, g1) * uTexel);

  float bL = heightAt(wuv - float2(g2, 0.0) * uTexel);
  float bR = heightAt(wuv + float2(g2, 0.0) * uTexel);
  float bD = heightAt(wuv - float2(0.0, g2) * uTexel);
  float bU = heightAt(wuv + float2(0.0, g2) * uTexel);

  float2 slope = (float2(aR - aL, aU - aD) * 0.6 + float2(bR - bL, bU - bD) * 0.4) * uSlope;
  float3 N = normalize(float3(-slope.x, -slope.y, 1.0));

  float3 V = float3(0.0, 0.0, 1.0);
  float3 R = reflect(-V, N);

  float tt = uTime;
  float2 fp = uv * float2(uAspect, 1.0) * 1.6;
  float2 flow = float2(
    fbm(fp + float2(tt * 0.25, height * 3.0)) - 0.5,
    fbm(fp + float2(-tt * 0.20 + 5.0, tt * 0.15)) - 0.5
  ) * 0.55;
  flow += float2(sin(tt * 0.31) * 0.10, cos(tt * 0.24) * 0.08);

  float2 env = R.xy + uTilt + flow;

  float3 sharpRefl = ramp(envT(env));
  float3 blurRefl = float3(0.0);
  for (int i = 0; i < 6; i++) {
    float a = float(i) / 6.0 * TAU;
    blurRefl += ramp(envT(env + float2(cos(a), sin(a)) * 0.14));
  }
  blurRefl /= 6.0;

  float rough = clamp(uRough + 0.25 * clamp(length(slope), 0.0, 1.0), 0.0, 1.0);
  float3 metal = mix(sharpRefl, blurRefl, rough);

  float tMid = envT(env);
  float3 envColor = envSample(clamp(uv + env * 0.35, 0.0, 1.0));
  float envMix = (1.0 - abs(tMid - 0.5) * 2.0) * 0.3;
  metal = mix(metal, metal + envColor * 2.0, envMix);

  float streak = smoothstep(0.35, 0.5, abs(env.x + sin(env.y * 3.0) * 0.1));
  metal += (1.0 - streak) * 0.1 * uS1;

  float fres = pow(1.0 - N.z, 2.2);
  metal += fres * uS1 * 0.45 * uFresnel;

  float3 keyDir = normalize(float3(cos(tt * 0.22) * 0.7, 0.5 + sin(tt * 0.18) * 0.3, 0.9));
  float3 Hh = normalize(keyDir + V);
  float3 Na = normalize(float3(N.x * 0.6, N.y, N.z));
  metal += pow(max(dot(Na, Hh), 0.0), 120.0) * uSpark * 1.3;
  metal += pow(max(dot(N, Hh), 0.0), 16.0) * uS1 * 0.25;

  float sweep = fract(uTime * 0.16);
  float diag = (uv.x * uAspect + (1.0 - uv.y)) * 0.42;
  float band = 1.0 - smoothstep(0.0, 0.06, abs(diag - sweep * 1.4 + 0.2));
  float facing = clamp(N.x * -0.6 + N.y * 0.6 + 0.4, 0.0, 1.0);
  metal += band * facing * uSpark * 0.5;

  float curv = length(slope);
  float bright = smoothstep(0.62, 1.0, tMid) * smoothstep(0.4, 1.2, curv);
  float tw = 0.5 + 0.5 * sin(uTime * 2.0 + height * 40.0 + uv.x * 30.0);
  metal += bright * tw * tw * uSpark * 1.1 * uSparkle;

  float ao = smoothstep(0.15, 0.7, f0.g);
  metal *= 0.7 + ao * 0.3;
  metal *= 0.86 + smoothstep(0.3, 0.55, crisp) * 0.14;

  metal += (noise(uv * float2(uAspect, 1.0) * 520.0) - 0.5) * 0.035;

  float3 c = toneMap(metal);
  c += (hash(uv * 1024.0 + fract(uTime)) - 0.5) * (1.5 / 255.0);
  c = clamp(c, 0.0, 1.0);

  float half_w = 0.12 * uEdge;
  float aa = smoothstep(0.28 - half_w, 0.28 + half_w, height);
  return half4(half3(c * aa), half(aa));
}
`;

export { SHADER_SOURCE };
