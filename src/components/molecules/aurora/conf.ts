const AURORA_VERTEX_SHADER = /*wgsl */ `
uniform float2 resolution;
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 skyTop;
uniform vec3 skyBottom;
uniform float speed;
uniform float intensity;
uniform float2 waveDirection;

float hash(float n) {
  return fract(sin(n) * 43758.5453);
}
float noise(float2 p) {
  float2 i = floor(p);
  float2 f = fract(p);
  float a = 3.0;
  float2 u = f * f * (a - 2.0 * f);
  return mix(
    mix(hash(i.x + hash(i.y)), hash(i.x + 1.0 + hash(i.y)), u.x),
    mix(hash(i.x + hash(i.y + 1)), hash(i.x + 1.0 + hash(i.y + 1.0)), u.x),
    u.y
  );
}

vec3 auroraLayer(float2 uv, float layerSpeed, float layerIntensity, vec3 color) {
  float t = time * layerSpeed * speed;
  float2 p = uv * 2.0 + t * waveDirection;
  float n = noise(p + noise(color.xy + p + t));
  float aurora = (n - uv.y * 0.5);
  return color * aurora * layerIntensity * intensity * 2.0;
}
half4 main(float2 fragCoord) {
  float2 uv = fragCoord / resolution;
  uv.x *= resolution.x / resolution.y;
  vec3 color = vec3(0.0);
  color += auroraLayer(uv, 0.05, 0.3, color1);
  color += auroraLayer(uv, 0.1, 0.4, color2);
  color += auroraLayer(uv, 0.15, 0.2, color3);
  color += auroraLayer(uv, 0.25, 0.3, color1 * 0.5 + color3 * 0.2);
  
  color += skyTop * (1.0 - smoothstep(0.4, 1.0, uv.y));
  color += skyBottom * (1.0 - smoothstep(0.5, 0.9, uv.y));
  
  return half4(color, 1.0);
}`;

export { AURORA_VERTEX_SHADER };
