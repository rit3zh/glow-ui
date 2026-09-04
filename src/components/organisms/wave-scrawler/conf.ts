export const WAVE_SCRAWLER_SHADER = /*wgsl*/ `
uniform shader fromImage;
uniform shader toImage;
uniform float progress;
uniform float2 resolution;
uniform float amplitude;
uniform float waves;
uniform float colorSeparation;

const float PI = 3.14159265358979323846264;

float compute(float2 p, float prog, float2 center) {
  float2 o = p * sin(prog * amplitude) - center;
  float len = length(o);
  if (len < 0.0001) {
    return 0.0;
  }
  float2 h = float2(1.0, 0.0);
  float dotProduct = clamp(dot(o / len, h), -1.0, 1.0);
  float theta = acos(dotProduct) * waves;
  return (exp(cos(theta)) - 2.0 * cos(4.0 * theta) + pow(sin((2.0 * theta - PI) / 24.0), 5.0)) / 10.0;
}

half4 main(float2 xy) {
  float2 uv = xy / resolution;
  float inv = 1.0 - progress;
  
  float disp = compute(uv, progress, float2(0.5, 0.5));
  
  float2 toCoord = (uv + inv * disp) * resolution;
  half4 texTo = toImage.eval(toCoord);
  
  float2 fromCoordR = (uv + progress * disp * (1.0 - colorSeparation)) * resolution;
  float2 fromCoordG = (uv + progress * disp) * resolution;
  float2 fromCoordB = (uv + progress * disp * (1.0 + colorSeparation)) * resolution;
  
  half4 texFrom = half4(
    fromImage.eval(fromCoordR).r,
    fromImage.eval(fromCoordG).g,
    fromImage.eval(fromCoordB).b,
    1.0
  );
  
  return texTo * progress + texFrom * inv;
}
`;

export const DEFAULT_CONFIG = {
  duration: 800,
  amplitude: 1.0,
  waves: 30.0,
  colorSeparation: 0.3,
} as const;
