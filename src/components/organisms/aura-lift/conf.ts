const AURA_LIFT_SHADER = /*wgsl*/ `
  uniform float iProgress;
  uniform float2 iResolution;
  uniform shader contents;

  const float PI = 4.0 * atan(1.0);
  const int SAMPS = 16;
  const int S_LOD = 4;
  const float SIGMA = 4.0;

  float gaussian(float2 i) {
    float2 n = i / SIGMA;
    return exp(-0.5 * dot(n, n)) / (6.28 * SIGMA * SIGMA);
  }

  float remap(float v, float lo1, float hi1, float lo2, float hi2) {
    return lo2 + (v - lo1) * (hi2 - lo2) / (hi1 - lo1);
  }

  float easeIn(float x) {
    return 1.0 - cos((x * PI) / 2.0);
  }

  float easeInOut(float x) {
    return -(cos(PI * x) - 1.0) / 2.0;
  }

  float ring(float2 st, float radius) {
    float2 d  = st - float2(0.5, 1.0);
    float  dd = dot(d, d) * 4.0;
 
    float cRadius = 0.5;

    float  c1 = smoothstep(radius - radius * cRadius, radius, dd);
    float  c2 = 1.0 - smoothstep(radius, radius + radius * 0.5, dd);
    return c1 * c2;
  }

  half4 main(float2 fragCoord) {
    float2 uv    = fragCoord / iResolution;
    float  range = sin(iProgress * PI);

    float m3   = remap(range, 0.0, 1.0, -0.2, 1.6);
    float p1   = smoothstep(0.0, 0.25, distance(uv, float2(0.5, m3)));
    float3 g1  = mix(float3(0.855, 0.992, 1.0), float3(1.0), p1);

    float m2   = remap(range, 0.0, 1.0, -0.3, 1.5);
    float p2   = smoothstep(0.0, 0.25, distance(uv, float2(0.5, m2)));
    float3 g2  = mix(float3(1.0, 0.988, 0.855), float3(1.0), p2);

    float m1   = remap(range, 0.0, 1.0, -0.4, 1.4);
    float p3   = smoothstep(0.0, 0.25, distance(uv, float2(0.5, m1)));
    float3 g3  = mix(float3(1.0, 0.890, 0.878), float3(1.0), p3);

    float blurMix = smoothstep(0.0, 1.0, uv.y) * range;
    half4  blurred = half4(0.0);
    int    s = SAMPS / S_LOD;
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      float fs = float(s);
      float2 d = float2(fi - floor(fi / fs) * fs, floor(fi / fs))
                 * float(S_LOD) - float(SAMPS) / 2.0;
      blurred += half4(gaussian(d)) * contents.eval(fragCoord + d);
    }
    blurred = blurred.a > 0.0 ? blurred / blurred.a : blurred;

    float yS = easeIn(uv.y) * 0.1 * range;
    uv.y -= yS;

    float range2 = max(0.0, sin(iProgress * PI));
    float2 st    = uv;
    float  wpct  = 1.0 - ring(st, 5.0 * range2);
    float3 cc    = pow(mix(float3(1.069, 1.077, 1.100), float3(1.0), wpct),
                       float3(8.0));
    float  wS    = st.y * 0.3 * range2 * (wpct - st.y);
    st.y += wS;

    half4 wcolor = contents.eval(st * iResolution) * half4(half3(cc), 1.0);
    uv.y += wS;

    half4 color = contents.eval(uv * iResolution);
    color  = mix(color, wcolor,  half4(p1));
    color  = mix(color, blurred, half4(blurMix));
    color *= half4(half3(g1), 1.0);
    color *= half4(half3(g2), 1.0);
    color *= half4(half3(g3), 1.0);

    return color;
  }`;

export { AURA_LIFT_SHADER };
