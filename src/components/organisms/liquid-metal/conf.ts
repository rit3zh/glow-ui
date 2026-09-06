const LIQUID_METAL_SHADER = /* wgsl */ `
uniform shader u_image;

uniform float4 u_scene;
uniform float4 u_params;
uniform float4 u_extra;
uniform float4 u_rect;
uniform float4 u_tuning;

uniform float u_noiseStrength;

uniform float3 u_lightColor;
uniform float3 u_darkColor;

const float SHADER_PI = 3;

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
    0.2,
    0.3,
    -0.57,
    0.024
  );

  float2 cell = floor(
    point + dot(point, noiseConstants.yy)
  );

  float2 local =
    point -
    cell +
    dot(cell, noiseConstants.xx);

  float2 offset =
    local.x > local.y
      ? float2(1.0, 0.0)
      : float2(0.0, 1.0);

  float4 corners =
    local.xyxy +
    noiseConstants.xxzz;

  corners.xy -= offset;

  cell = wrap289_2(cell);

  float3 permutation =
    hashPermute(
      hashPermute(
        cell.y +
        float3(
          0.0,
          offset.y,
          1.0
        )
      ) +
      cell.x +
      float3(
        0.0,
        offset.x,
        1.0
      )
    );

  float3 attenuation =
    max(
      0.5 -
      float3(
        dot(local, local),
        dot(corners.xy, corners.xy),
        dot(corners.zw, corners.zw)
      ),
      0.0
    );

  attenuation *= attenuation;
  attenuation *= attenuation;

  float3 gradientValue =
    2.0 *
    fract(
      permutation *
      noiseConstants.www
    ) -
    1.0;

  float3 gradientHeight =
    abs(gradientValue) -
    0.5;

  float3 gradientOffset =
    floor(
      gradientValue + 0.5
    );

  float3 gradientBase =
    gradientValue -
    gradientOffset;

  attenuation *=
    1.7 -
    0.85 *
    (
      gradientBase * gradientBase +
      gradientHeight * gradientHeight
    );

  float3 gradient;

  gradient.x =
    gradientBase.x * local.x +
    gradientHeight.x * local.y;

  gradient.yz =
    gradientBase.yz * corners.xz +
    gradientHeight.yz * corners.yw;

  return 130.0 *
    dot(
      attenuation,
      gradient
    );
}

float2 rotateVector(
  float2 point,
  float angle
) {
  return float2x2(
    cos(angle),
    -sin(angle),
    sin(angle),
    cos(angle)
  ) * point;
}

float sampleStripeChannel(
  float primaryColor,
  float secondaryColor,
  float stripePosition,
  float3 stripeWidths,
  float additionalBlur,
  float shapeFactor
) {
  float channelValue =
    secondaryColor;

  float transitionEdge = 0.0;

  float softness =
    u_params.w +
    additionalBlur;

  channelValue =
    mix(
      channelValue,
      primaryColor,
      smoothstep(
        0.0,
        softness,
        stripePosition
      )
    );

  transitionEdge =
    stripeWidths[0];

  channelValue =
    mix(
      channelValue,
      secondaryColor,
      smoothstep(
        transitionEdge - softness,
        transitionEdge + softness,
        stripePosition
      )
    );

  shapeFactor =
    smoothstep(
      0.2,
      0.8,
      shapeFactor
    );

  transitionEdge =
    stripeWidths[0] +
    0.4 *
    (1.0 - shapeFactor) *
    stripeWidths[1];

  channelValue =
    mix(
      channelValue,
      primaryColor,
      smoothstep(
        transitionEdge - softness,
        transitionEdge + softness,
        stripePosition
      )
    );

  transitionEdge =
    stripeWidths[0] +
    0.5 *
    (1.0 - shapeFactor) *
    stripeWidths[1];

  channelValue =
    mix(
      channelValue,
      secondaryColor,
      smoothstep(
        transitionEdge - softness,
        transitionEdge + softness,
        stripePosition
      )
    );

  transitionEdge =
    stripeWidths[0] +
    stripeWidths[1];

  channelValue =
    mix(
      channelValue,
      primaryColor,
      smoothstep(
        transitionEdge - softness,
        transitionEdge + softness,
        stripePosition
      )
    );

  float gradientPosition =
    (
      stripePosition -
      stripeWidths[0] -
      stripeWidths[1]
    ) /
    max(
      stripeWidths[2],
      0.1
    );

  float gradientValue =
    mix(
      primaryColor,
      secondaryColor,
      smoothstep(
        0.0,
        1.0,
        gradientPosition
      )
    );

  channelValue =
    mix(
      channelValue,
      gradientValue,
      smoothstep(
        transitionEdge - softness,
        transitionEdge + softness,
        stripePosition
      )
    );

  return channelValue;
}

float frameAlpha(
  float2 coordinate,
  float frameSize
) {
  float horizontal =
    smoothstep(
      0.0,
      frameSize,
      coordinate.x
    ) *
    smoothstep(
      1.0,
      1.0 - frameSize,
      coordinate.x
    );

  float vertical =
    smoothstep(
      0.0,
      frameSize,
      coordinate.y
    ) *
    smoothstep(
      1.0,
      1.0 - frameSize,
      coordinate.y
    );

  return horizontal * vertical;
}

float calculateEdgeField(
  float2 coordinate,
  float radiusLimit
) {
  float accumulatedAlpha = 0.0;

  for (int layer = 1; layer <= 6; layer++) {
    float radius =
      radiusLimit *
      float(layer) /
      6.0;

    for (int sampleIndex = 0; sampleIndex < 8; sampleIndex++) {
      float angle =
        float(sampleIndex) *
        0.78;

      float2 offset =
        float2(
          cos(angle),
          sin(angle)
        ) *
        radius;

      accumulatedAlpha +=
        float(
          u_image.eval(
            coordinate + offset
          ).a
        );
    }
  }

  float depth =
    clamp(
      accumulatedAlpha / 48.0,
      0.0,
      1.0
    );

  return 1.0 -
    depth * depth;
}

half4 main(float2 fragCoord) {
  float2 resolution =
    u_scene.xy;

  float2 uv =
    float2(
      fragCoord.x / resolution.x,
      1.0 -
      fragCoord.y / resolution.y
    );

  uv.y =
    1.0 - uv.y;

  uv.x *=
    u_scene.w;

  float diagonal =
    uv.x - uv.y;

  float time =
    u_scene.z;

  float2 imageUv =
    (fragCoord - u_rect.xy) /
    u_rect.zw;

  half4 texel =
    u_image.eval(
      fragCoord
    );

  float3 color =
    float3(0.0);

  float opacity =
    1.0;

  float3 lightColor =
    u_lightColor;

  float3 darkColor =
    u_darkColor;

  darkColor.b +=
    0.1 *
    smoothstep(
      0.7,
      1.3,
      uv.x + uv.y
    );

  float edge =
    u_extra.z > 0.5
      ? calculateEdgeField(
          fragCoord,
          max(
            u_extra.y,
            0.5
          )
        )
      : 0.0;

  float2 gradientUv =
    uv - 0.5;

  float distanceFromCenter =
    length(
      gradientUv +
      float2(
        0.0,
        0.2 * diagonal
      )
    );

  gradientUv =
    rotateVector(
      gradientUv,
      (0.25 - 0.2 * diagonal) * SHADER_PI + u_extra.w
    );

  float bulge =
    pow(
      1.8 *
      distanceFromCenter,
      1.2
    );

  bulge =
    1.0 - bulge;

  bulge *=
    pow(
      uv.y,
      0.3
    );

  bulge *=
    u_tuning.y;

  float cycleWidth =
    u_params.x;

  float thinStripA =
    0.12 /
    cycleWidth *
    (
      1.0 -
      0.4 * bulge
    );

  float thinStripB =
    0.07 /
    cycleWidth *
    (
      1.0 +
      0.4 * bulge
    );

  float wideStrip =
    1.0 -
    thinStripA -
    thinStripB;

  float thinWidthA =
    cycleWidth *
    thinStripA;

  float thinWidthB =
    cycleWidth *
    thinStripB;

  if (u_extra.z > 0.5) {
    float edgeAmount =
      smoothstep(
        0.9 -
        0.5 * u_params.z,
        1.0 -
        0.5 * u_params.z,
        edge
      );

    opacity =
      1.0 -
      edgeAmount *
      u_tuning.z;

    opacity *=
      frameAlpha(
        imageUv,
        0.01
      );

    opacity *=
      smoothstep(
        0.0,
        0.5,
        float(texel.a)
      );
  }

  float noise =
    simplexNoise(
      (
        uv -
        time
      ) *
      u_tuning.x
    );

  edge +=
    (1.0 - edge) *
    u_extra.x *
    noise *
    u_noiseStrength;

  float refr =
    1.0 - bulge;

  refr =
    clamp(
      refr,
      0.0,
      1.0
    );

  float direction =
    gradientUv.x;

  direction +=
    diagonal;

  direction -=
    2.0 *
    noise *
    diagonal *
    u_tuning.w *
    (
      smoothstep(
        0.0,
        1.0,
        edge
      ) *
      smoothstep(
        1.0,
        0.0,
        edge
      )
    );

  bulge *=
    clamp(
      pow(
        uv.y,
        0.1
      ),
      0.3,
      1.0
    );

  direction *=
    0.1 +
    (
      1.1 -
      edge *
      u_tuning.z
    ) *
    bulge;

  direction *=
    smoothstep(
      1.0,
      0.7,
      edge
    );

  direction +=
    0.18 *
    (
      smoothstep(
        0.1,
        0.2,
        uv.y
      ) *
      smoothstep(
        0.4,
        0.2,
        uv.y
      )
    );

  direction +=
    0.03 *
    (
      smoothstep(
        0.1,
        0.2,
        1.0 - uv.y
      ) *
      smoothstep(
        0.4,
        0.2,
        1.0 - uv.y
      )
    );

  direction *=
    0.5 +
    0.5 *
    pow(
      uv.y,
      2.0
    );

  direction *=
    cycleWidth;

  direction -=
    time;

  float refrRed =
    refr;

  refrRed +=
    0.03 *
    bulge *
    noise;

  float refrBlue =
    1.3 *
    refr;

  refrRed +=
    5.0 *
    (
      smoothstep(
        -0.1,
        0.2,
        uv.y
      ) *
      smoothstep(
        0.5,
        0.1,
        uv.y
      )
    ) *
    (
      smoothstep(
        0.4,
        0.6,
        bulge
      ) *
      smoothstep(
        1.0,
        0.4,
        bulge
      )
    );

  refrRed -=
    diagonal;

  refrBlue +=
    (
      smoothstep(
        0.0,
        0.4,
        uv.y
      ) *
      smoothstep(
        0.8,
        0.1,
        uv.y
      )
    ) *
    (
      smoothstep(
        0.4,
        0.6,
        bulge
      ) *
      smoothstep(
        0.8,
        0.4,
        bulge
      )
    );

  refrBlue -=
    0.2 *
    edge;

  refrRed *=
    u_params.y;

  refrBlue *=
    u_params.y;

  float3 stripeWidths =
    float3(
      thinWidthA,
      thinWidthB,
      wideStrip
    );

  stripeWidths[1] -=
    0.02 *
    smoothstep(
      0.0,
      1.0,
      edge + bulge
    );

  float stripeRed =
    mod(
      direction +
      refrRed,
      1.0
    );

  float red =
    sampleStripeChannel(
      lightColor.r,
      darkColor.r,
      stripeRed,
      stripeWidths,
      0.02 +
      0.03 *
      u_params.y *
      bulge,
      bulge
    );

  float stripeGreen =
    mod(
      direction,
      1.0
    );

  float safeDiagonal =
    max(
      abs(1.0 - diagonal),
      0.0001
    );

  float green =
    sampleStripeChannel(
      lightColor.g,
      darkColor.g,
      stripeGreen,
      stripeWidths,
      0.01 /
      safeDiagonal,
      bulge
    );

  float stripeBlue =
    mod(
      direction -
      refrBlue,
      1.0
    );

  float blue =
    sampleStripeChannel(
      lightColor.b,
      darkColor.b,
      stripeBlue,
      stripeWidths,
      0.01,
      bulge
    );

  color =
    float3(
      red,
      green,
      blue
    );

  color =
    clamp(
      color,
      0.0,
      1.0
    );

  opacity =
    clamp(
      opacity,
      0.0,
      1.0
    );

  color *=
    opacity;

  return half4(
    half3(color),
    half(opacity)
  );
}
`;

export { LIQUID_METAL_SHADER };
