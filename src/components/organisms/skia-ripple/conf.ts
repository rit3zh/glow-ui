const RIPPLE_SHADER_SOURCE = /*wgsl */ `
uniform float2 u_origin;
uniform float u_time;
uniform float u_amplitude;
uniform float u_frequency;
uniform float u_decay;
uniform float u_speed;
uniform shader image;

half4 main(float2 position) {
  float dist = length(position - u_origin);
  
  float delay = dist / u_speed;
  
  float time = max(0.0, u_time - delay);
  
  float rippleAmount = u_amplitude * sin(u_frequency * time) * exp(-u_decay * time);
  float2 n = dist > 0.001 ? normalize(position - u_origin) : float2(0.0, 0.0);
  
  float2 newPosition = position + rippleAmount * n;
  
  half4 color = image.eval(newPosition);
  
  float brightness = 0.3 * (rippleAmount / max(u_amplitude, 0.001)) * color.a;
  color.rgb += brightness;
  
  return color;
}
`;

export { RIPPLE_SHADER_SOURCE };
