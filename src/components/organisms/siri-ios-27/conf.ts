const SHADER_SOURCE: string = /* wgsl */ `
uniform vec2 iResolution;
uniform float iTime;
uniform float level;
uniform float amplitude;
uniform float thickness;
uniform float hueShift;
uniform float exposure;
uniform float strandCount;
uniform float paletteCount;
uniform vec3 palette[8];

const float PI = 3.14159265;
const int MAX_STRANDS = 8;

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(2.0 * PI * (t + vec3(0.00, 0.33, 0.67)));
}

vec3 samplePalette(float t) {
  float scaled = clamp(fract(t), 0.0, 1.0) * (paletteCount - 1.0);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  vec3 c0 = palette[0];
  vec3 c1 = palette[0];
  for (int k = 0; k < MAX_STRANDS; k++) {
    if (k == idx) c0 = palette[k];
    if (k == idx + 1) c1 = palette[k];
  }
  return mix(c0, c1, f);
}

vec3 tint(float t) {
  if (paletteCount > 0.5) return samplePalette(t);
  return spectrum(t);
}

vec4 main(vec2 fragCoord) {
  vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

  float e = 0.06 + level * 0.94;

  
  float env = pow(max(cos(uv.x * PI * 1.3), 0.0), 2.9);

  vec3 col = vec3(0.0);
  float count = max(1.0, strandCount);

  for (int i = 0; i < MAX_STRANDS; i++) {
    if (float(i) >= count) break;

    float fi   = float(i);
    float ph   = fi * 1.7;
    float freq = 2.0 + fi * 0.35;
    float spd  = 1.4 + fi * 1.2;

    float w = sin(uv.x * freq       + iTime * spd       + ph) * 0.60
            + sin(uv.x * freq * 1.1 - iTime * spd * 0.7 + ph * 1.7) * 0.40;

    float amp = (0.1 + 0.02 * e) * env * amplitude;
    float y   = w * amp;

    float d     = abs(uv.y - y);
    float thick = (0.001 + 0.05 * e) * (0.35 + env) * thickness;
    float g     = thick / (d + thick * 0.45);
    g = g * g;

    float h = fi / count + uv.x * 0.30 + iTime * 0.04 + hueShift;
    col += tint(h) * g * env;
  }

  col *= 0.45 + 0.7 * e;
  col = 1.0 - exp(-col * exposure);

  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  return vec4(col * a, a);
}
`;

export { SHADER_SOURCE };
