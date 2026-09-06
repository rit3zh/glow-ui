const SHADER_SOURCE = /*wgsl */ `
uniform float2 uDimensions;
uniform float  uTick;
uniform float  uIterations;
uniform float  uScale;
uniform float  uWavelengthOffset;
uniform float  uWavelengthRange;
uniform float  uTimeScale;
uniform float  uBorderWidth;
uniform float4 uBorderColor;
uniform float  uBorderGlow;
uniform float  uGlowRadius;
uniform float  uBrightness;

uniform float  uUseCustomColors;
uniform float3 uColor0;
uniform float3 uColor1;
uniform float3 uColor2;

float3 spectral_colour(float l) {
  float r = 0.0, g = 0.0, b = 0.0;
  if      ((l >= 400.0) && (l < 410.0)) { float t = (l - 400.0) / (410.0 - 400.0); r = +(0.33 * t) - (0.20 * t * t); }
  else if ((l >= 410.0) && (l < 475.0)) { float t = (l - 410.0) / (475.0 - 410.0); r = 0.14 - (0.13 * t * t); }
  else if ((l >= 545.0) && (l < 595.0)) { float t = (l - 545.0) / (595.0 - 545.0); r = +(1.98 * t) - (t * t); }
  else if ((l >= 595.0) && (l < 650.0)) { float t = (l - 595.0) / (650.0 - 595.0); r = 0.98 + (0.06 * t) - (0.40 * t * t); }
  else if ((l >= 650.0) && (l < 700.0)) { float t = (l - 650.0) / (700.0 - 650.0); r = 0.65 - (0.84 * t) + (0.20 * t * t); }

  if      ((l >= 415.0) && (l < 475.0)) { float t = (l - 415.0) / (475.0 - 415.0); g = +(0.80 * t * t); }
  else if ((l >= 475.0) && (l < 590.0)) { float t = (l - 475.0) / (590.0 - 475.0); g = 0.8 + (0.76 * t) - (0.80 * t * t); }
  else if ((l >= 585.0) && (l < 639.0)) { float t = (l - 585.0) / (639.0 - 585.0); g = 0.82 - (0.80 * t); }

  if      ((l >= 400.0) && (l < 475.0)) { float t = (l - 400.0) / (475.0 - 400.0); b = +(2.20 * t) - (1.50 * t * t); }
  else if ((l >= 475.0) && (l < 560.0)) { float t = (l - 475.0) / (560.0 - 475.0); b = 0.7 - t + (0.30 * t * t); }

  return float3(r, g, b);
}

float3 custom_colour(float v) {
  float s = clamp(v * 0.5 + 0.5, 0.0, 1.0);
  float3 c;
  if (s < 0.5) {
    c = mix(uColor0, uColor1, s * 2.0);
  } else {
    c = mix(uColor1, uColor2, (s - 0.5) * 2.0);
  }
  return c;
}

half4 main(float2 coord) {
  float2 p = (2.0 * coord - uDimensions) / min(uDimensions.x, uDimensions.y);
  p *= uScale;

  float t = uTick * uTimeScale;

  for (int i = 0; i < 16; i++) {
    if (i >= int(uIterations)) { break; }
    float2 newp = float2(
      p.y + cos(p.x + t) - sin(p.y * cos(t * 0.2)),
      p.x - sin(p.y - t) - cos(p.x * sin(t * 0.3))
    );
    p = newp;
  }

  float3 col;
  if (uUseCustomColors > 0.5) {
    col = custom_colour(p.y + sin(t * 0.8) * 0.3);
  } else {
    col = spectral_colour(
      p.y * uWavelengthRange + uWavelengthOffset + sin(t * 0.8)
    );
  }
  col *= uBrightness;

  float2 uv   = coord / uDimensions;
  float edgeX  = min(uv.x, 1.0 - uv.x);
  float edgeY  = min(uv.y, 1.0 - uv.y);
  float edge   = min(edgeX, edgeY);
  float minDim = min(uDimensions.x, uDimensions.y);

  float borderNorm = uBorderWidth / minDim;
  float glowNorm   = uGlowRadius  / minDim;

  float borderMask = 1.0 - smoothstep(0.0, borderNorm, edge);
  float glowMask   = (1.0 - smoothstep(borderNorm, borderNorm + glowNorm, edge))
                   * (1.0 - borderMask);

  float3 finalColor = mix(col, uBorderColor.rgb, borderMask);
  finalColor       += uBorderColor.rgb * glowMask * uBorderGlow;
  finalColor        = clamp(finalColor, 0.0, 1.0);

  return half4(finalColor, 1.0);
}
`;

export { SHADER_SOURCE };
