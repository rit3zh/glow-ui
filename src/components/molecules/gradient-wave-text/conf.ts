const GRADIENT_WAVE_SHADER = /* wgsl */ `
uniform float2 u_resolution;
uniform float  u_gi;
uniform float  u_radial;
uniform float  u_count;
uniform float  u_pos[16];
uniform float3 u_cols[16];
float3 sampleStops(float t) {
  int n = int(u_count);
  float3 c = u_cols[0];
  for (int i = 1; i < 16; i++) {
    if (i < n) {
      float span = max(u_pos[i] - u_pos[i - 1], 0.0001);
      float f = clamp((t - u_pos[i - 1]) / span, 0.0, 1.0);
      c = mix(c, u_cols[i], f);
    }
  }
  return c;
}

half4 main(float2 fragcoord) {
  float w = u_resolution.x;
  float h = u_resolution.y;

  float q;
  if (u_radial > 0.5) {
    float2 bottomCenter = float2(w * 0.5, h);
    float R = length(float2(w * 0.5, h));
    q = length(fragcoord - bottomCenter) / max(R, 1.0) * 100.0;
  } else {
    q = (1.0 - fragcoord.y / max(h, 1.0)) * 100.0;
  }

  float3 col = sampleStops(q - u_gi);
  return half4(col, 1.0);
}
`;

export { GRADIENT_WAVE_SHADER };
