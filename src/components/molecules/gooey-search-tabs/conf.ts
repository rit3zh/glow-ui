const GOOEY_SHADER = /* wgsl */ `
uniform float2 u_resolution;
uniform float4 u_search;
uniform float4 u_right;
uniform float  u_radius;
uniform float  u_k;
uniform float3 u_color;

float sdRoundRect(float2 p, float2 b, float r) {
  float2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

half4 main(float2 fragcoord) {
  float2 cA = float2(u_search.x + u_search.z * 0.5, u_search.y + u_search.w * 0.5);
  float2 hA = float2(u_search.z * 0.5, u_search.w * 0.5);
  float2 cB = float2(u_right.x + u_right.z * 0.5, u_right.y + u_right.w * 0.5);
  float2 hB = float2(u_right.z * 0.5, u_right.w * 0.5);

  float rA = min(u_radius, min(hA.x, hA.y));
  float rB = min(u_radius, min(hB.x, hB.y));

  float dA = sdRoundRect(fragcoord - cA, hA, rA);
  float dB = sdRoundRect(fragcoord - cB, hB, rB);
  float d = smin(dA, dB, max(u_k, 0.0001));

  float a = 1.0 - smoothstep(-0.75, 0.75, d);
  return half4(u_color * a, a);
}
`;

export { GOOEY_SHADER };
