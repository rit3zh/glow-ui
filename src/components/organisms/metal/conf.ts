const METAL_SHADER = /* sksl */ `
uniform float2 u_resolution;
uniform float u_time;

/** rgb + per stop alpha, padded out to MAX_STOPS entries. */
uniform float4 u_colors[8];

/** thickness, radius, softness, opacity */
uniform float4 u_shape;

/** stop count, bands, sharpness, direction (radians) */
uniform float4 u_pattern;

/** distortion, noise scale, bevel, contrast */
uniform float4 u_surface;

/** sheen, glow, bleed */
uniform float3 u_light;

const float SHADER_TAU = 6.283185307179586;

float3 wrap289_3(float3 value) {
  return value - floor(value * (1.0 / 289.0)) * 289.0;
}

float2 wrap289_2(float2 value) {
  return value - floor(value * (1.0 / 289.0)) * 289.0;
}

float3 hashPermute(float3 value) {
  return wrap289_3(((value * 34.0) + 1.0) * value);
}

float simplexNoise(float2 point) {
  const float4 noiseConstants = float4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  float2 cell = floor(point + dot(point, noiseConstants.yy));

  float2 local = point - cell + dot(cell, noiseConstants.xx);

  float2 offset = local.x > local.y ? float2(1.0, 0.0) : float2(0.0, 1.0);

  float4 corners = local.xyxy + noiseConstants.xxzz;

  corners.xy -= offset;

  cell = wrap289_2(cell);

  float3 permutation = hashPermute(
    hashPermute(cell.y + float3(0.0, offset.y, 1.0)) +
    cell.x +
    float3(0.0, offset.x, 1.0)
  );

  float3 attenuation = max(
    0.5 - float3(
      dot(local, local),
      dot(corners.xy, corners.xy),
      dot(corners.zw, corners.zw)
    ),
    0.0
  );

  attenuation *= attenuation;
  attenuation *= attenuation;

  float3 gradientValue = 2.0 * fract(permutation * noiseConstants.www) - 1.0;

  float3 gradientHeight = abs(gradientValue) - 0.5;

  float3 gradientOffset = floor(gradientValue + 0.5);

  float3 gradientBase = gradientValue - gradientOffset;

  attenuation *= 1.79284291400159 - 0.85373472095314 * (
    gradientBase * gradientBase + gradientHeight * gradientHeight
  );

  float3 gradient;

  gradient.x = gradientBase.x * local.x + gradientHeight.x * local.y;

  gradient.yz = gradientBase.yz * corners.xz + gradientHeight.yz * corners.yw;

  return 130.0 * dot(attenuation, gradient);
}

/**
 * Piecewise ramp across the supplied stops. Unlike a weighted average the
 * ramp keeps every stop at full saturation, which is what reads as polished
 * metal rather than a grey blur. Sharpness tightens each transition so the
 * palette lands as distinct bands with hard specular edges.
 */
float4 palette(float t) {
  float count = max(u_pattern.x, 2.0);

  float position = clamp(t, 0.0, 1.0) * (count - 1.0);

  float index = floor(position);

  float mixAmount = position - index;

  float sharpness = max(u_pattern.z, 0.001);

  mixAmount = clamp((mixAmount - 0.5) * sharpness + 0.5, 0.0, 1.0);

  mixAmount = mixAmount * mixAmount * (3.0 - 2.0 * mixAmount);

  float4 from = u_colors[0];
  float4 to = u_colors[0];

  for (int stop = 0; stop < 8; stop++) {
    if (float(stop) >= count) {
      break;
    }

    if (float(stop) == index) {
      from = u_colors[stop];
    }

    if (float(stop) == index + 1.0) {
      to = u_colors[stop];
    }
  }

  return mix(from, to, mixAmount);
}

/** Signed distance to a rounded rectangle centred on the origin. */
float roundedBox(float2 point, float2 halfSize, float radius) {
  radius = clamp(radius, 0.0, min(halfSize.x, halfSize.y));

  float2 q = abs(point) - halfSize + radius;

  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

half4 main(float2 fragCoord) {
  float thickness = max(u_shape.x, 0.5);
  float softness = max(u_shape.z, 0.001);
  float bleed = u_light.z;

  float2 center = u_resolution * 0.5;

  float2 point = fragCoord - center;

  /* The canvas is inflated by bleed on every side so the glow has room to
   * fall off. The ring is inset back onto the wrapped view's real edge. */
  float2 halfSize = max(center - bleed - thickness * 0.5, float2(0.5));

  float distance = roundedBox(
    point,
    halfSize,
    u_shape.y - thickness * 0.5
  );

  /* Position across the ring, 0 at the inner wall and 1 at the outer wall. */
  float across = clamp(distance / thickness + 0.5, 0.0, 1.0);

  /* Position along the perimeter. Normalising by halfSize before taking the
   * angle spreads the sweep evenly on non square views. */
  float2 normalized = point / halfSize;

  float along = atan(normalized.y, normalized.x) / SHADER_TAU + 0.5;

  float distortion = u_surface.x;
  float noiseScale = max(u_surface.y, 0.001);

  /* Two noise fields: one that travels along the rim, one locked to the
   * view so the reflection looks anchored to a surface as it drifts. */
  float rimNoise = simplexNoise(
    float2(along * 3.0 * noiseScale, u_time * 0.35)
  );

  float bodyNoise = simplexNoise(
    normalized * 2.0 * noiseScale + u_time * 0.2
  );

  float sweep = (along + u_pattern.w / SHADER_TAU) * u_pattern.y;

  sweep += u_time * 0.5;

  sweep += (rimNoise * 0.35 + bodyNoise * 0.65) * distortion;

  /* Refraction across the wall: the outer face lags the inner one, which is
   * what gives the rim its rolled, chromed cross section. */
  sweep += (across - 0.5) * 0.6;

  /* Triangle wave so the palette reflects back on itself, the way a real
   * highlight sweeps up and back down a curved surface. */
  float ramp = abs(fract(sweep) * 2.0 - 1.0);

  float4 sampled = palette(ramp);

  float3 color = sampled.rgb;

  /* A second, tighter pass of the same sweep. Fine grain bands like this are
   * what separate brushed metal from a plain gradient. */
  float micro = abs(fract(sweep * 3.0 + bodyNoise * 0.4) * 2.0 - 1.0);

  color *= 0.88 + 0.24 * micro;

  /* Cross section shading. The centre of the wall catches the light and both
   * walls fall into shadow, so the border reads as a rolled wire rather than
   * a flat line. Kept at or below 1 so bright stops never clip to white. */
  float curve = 1.0 - abs(across * 2.0 - 1.0);

  color *= mix(1.0, 0.3 + 0.7 * pow(curve, 0.45), u_surface.z);

  /* A single hot specular that orbits the rim. */
  float sheenPhase = fract(along - u_time * 0.12);

  float sheenDistance = min(sheenPhase, 1.0 - sheenPhase);

  color += exp(-sheenDistance * sheenDistance * 400.0) *
    u_light.x *
    (0.55 + 0.45 * curve);

  color = pow(max(color, float3(0.0)), float3(max(u_surface.w, 0.001)));

  color = clamp(color, 0.0, 1.0);

  float band = 1.0 - smoothstep(
    thickness * 0.5 - softness,
    thickness * 0.5 + softness,
    abs(distance)
  );

  float glowStrength = u_light.y;

  /* Quadratic falloff over a fixed radius. An exponential tail spreads a
   * faint, noise modulated haze across the whole canvas instead. */
  float glowRadius = max(thickness * 3.0, 6.0);

  float glowFalloff = clamp(
    1.0 - max(distance - thickness * 0.5, 0.0) / glowRadius,
    0.0,
    1.0
  );

  float glow = glowStrength *
    glowFalloff * glowFalloff *
    step(0.0, distance);

  float alpha = clamp(band + glow, 0.0, 1.0) * u_shape.w * sampled.a;

  color *= alpha;

  return half4(half3(color), half(alpha));
}
`;

/** Length of the `u_colors` array declared above. */
const MAX_STOPS = 8;

export { MAX_STOPS, METAL_SHADER };
