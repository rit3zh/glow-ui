export const SHADER_SOURCE = /*wgsl*/ `
  uniform float2 iResolution;
  uniform float iTime;
  uniform float borderWidth;
  uniform float borderRadius;
  uniform float speed;
  uniform float3 baseColor;
  uniform float3 glowColor;

  const float PI = 3.14159265359;


  float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + vec2(r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }


  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }


  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  vec4 main(vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    vec2 center = vec2(0.5, 0.5);
    

    vec2 pixelPos = fragCoord - iResolution * 0.5;
    
    vec2 halfSize = iResolution * 0.5 - vec2(1.0);
    float r = min(borderRadius, min(halfSize.x, halfSize.y));
    

    float dist = sdRoundedBox(pixelPos, halfSize, r);
    

    float borderInner = borderWidth;
    float borderOuter = 0.0;
    float borderMask = 1.0 - smoothstep(borderOuter, borderOuter + 1.0, dist) 
                     - (1.0 - smoothstep(-borderInner - 1.0, -borderInner, dist));
    borderMask = clamp(borderMask, 0.0, 1.0);
    

    float angle = atan(pixelPos.y, pixelPos.x);
    float normalizedAngle = (angle + PI) / (2.0 * PI); 
    

    float t = iTime * speed;
    

    float perimeter = normalizedAngle;
    

    float lights = 0.0;
    

    float p1 = fract(perimeter - t * 0.15);
    lights += pow(max(0.0, 1.0 - abs(p1 - 0.5) * 8.0), 2.0);
    

    float p2 = fract(perimeter - t * 0.12 + 0.33);
    lights += pow(max(0.0, 1.0 - abs(p2 - 0.5) * 8.0), 2.0);
    

    float p3 = fract(perimeter - t * 0.1 + 0.66);
    lights += pow(max(0.0, 1.0 - abs(p3 - 0.5) * 8.0), 2.0);
    

    float sparkle = noise(vec2(normalizedAngle * 20.0, t * 2.0)) * 0.5;
    sparkle += noise(vec2(normalizedAngle * 40.0 + 100.0, t * 3.0)) * 0.3;
    

    vec3 rainbow;
    float hueShift = normalizedAngle * 2.0 + t * 0.5;
    rainbow.r = 0.5 + 0.5 * sin(hueShift * PI * 2.0);
    rainbow.g = 0.5 + 0.5 * sin(hueShift * PI * 2.0 + PI * 0.66);
    rainbow.b = 0.5 + 0.5 * sin(hueShift * PI * 2.0 + PI * 1.33);
    

    vec3 borderColor = baseColor;
    

    vec3 lightColor = mix(glowColor, rainbow, 0.6);
    borderColor += lightColor * lights * 1.5;
    

    borderColor += glowColor * sparkle * 0.3;
    

    borderColor += baseColor * 0.3;
    

    vec3 finalColor = borderColor * borderMask;
    float alpha = borderMask * (0.4 + lights * 0.6 + sparkle * 0.2);
    

    alpha = clamp(alpha, 0.0, 1.0);
    
    return vec4(finalColor, alpha);
  }
`;
