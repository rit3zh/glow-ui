/**
 * not-in-use file, only for types export
 */
interface MetallicUniforms {
  u_time: number;
  u_ratio: number;
  u_patternScale: number;
  u_refraction: number;
  u_edge: number;
  u_patternBlur: number;
  u_liquid: number;
  u_resolution: readonly [number, number];
}

interface MetallicPaintProps {
  /**
   * The URI of the image to be used as the base texture for the metallic paint effect.
   * @summary Provide a valid image URI to achieve the desired metallic paint effect.
   * PS: Only use high-quality .PNG files.
   */
  unstable_uri: string;
  size?: number;
  patternScale?: number;
  refraction?: number;
  edge?: number;
  patternBlur?: number;
  liquid?: number;
  speed?: number;
}

export type { MetallicPaintProps, MetallicUniforms };
