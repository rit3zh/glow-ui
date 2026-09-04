const BORDER_BEAM_SHADER = /* wgsl */ `
uniform float2 u_resolution;
uniform float2 u_size;
uniform float  u_radius;
uniform float  u_border;
uniform float  u_glow;
uniform float  u_time;
uniform float  u_speed;
uniform float  u_arc;
uniform float  u_intensity;
uniform float  u_ambient;
uniform float  u_count;
uniform float3 u_colors[6];

const float TAU = 6.28318530718;

float sdRoundRect(float2 p, float2 b, float r) {
  float2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float3 palette(float t) {
  t = clamp(t, 0.0, 1.0);
  int n = int(u_count);
  float3 c = u_colors[0];
  for (int i = 1; i < 6; i++) {
    if (i < n) {
      float prev = float(i - 1) / (u_count - 1.0);
      float pos = float(i) / (u_count - 1.0);
      c = mix(c, u_colors[i], smoothstep(prev, pos, t));
    }
  }
  return c;
}

half4 main(float2 fragcoord) {
  float2 center = u_resolution * 0.5;
  float2 p = fragcoord - center;
  float2 halfBox = u_size * 0.5;

  float d = sdRoundRect(p, halfBox, u_radius);
  float ad = abs(d);
  float core = 1.0 - smoothstep(0.0, max(u_border, 0.5), ad);
  float g = d > 0.0 ? max(u_glow, 1.0) : max(u_glow * 0.5, 1.0);
  float halo = exp(-ad / g);
  if (core + halo <= 0.004) { return half4(0.0); }

  float2 uv = fragcoord / u_resolution;
  float3 col = palette((uv.x + uv.y) * 0.5);
  float a = atan(p.y, p.x) / TAU + 0.5;
  float sweep = fract(u_time * u_speed);
  float da = abs(fract(a - sweep + 0.5) - 0.5);
  float win = 1.0 - smoothstep(0.0, max(u_arc, 0.001), da);
  win = win * win;

  float beam = win * (0.9 * core + 0.5 * halo);
  float base = u_ambient * (0.55 * core + 0.45 * halo);
  float alpha = clamp((beam + base) * u_intensity, 0.0, 1.0);
  return half4(col * alpha, alpha);
}
`;

export { BORDER_BEAM_SHADER };
