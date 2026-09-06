import type { ComponentType } from "react";

export interface MetallicPaintProps {
  /** Raster or data-URI image whose opaque pixels define the painted shape. */
  imageSrc: string;
  seed?: number;
  scale?: number;
  refraction?: number;
  blur?: number;
  liquid?: number;
  speed?: number;
  brightness?: number;
  contrast?: number;
  angle?: number;
  fresnel?: number;
  lightColor?: string;
  darkColor?: string;
  patternSharpness?: number;
  waveAmplitude?: number;
  noiseScale?: number;
  chromaticSpread?: number;
  /** Drive the animation from pointer position instead of elapsed time. */
  mouseAnimation?: boolean;
  distortion?: number;
  contour?: number;
  tintColor?: string;
}

declare const MetallicPaint: ComponentType<MetallicPaintProps>;
export default MetallicPaint;
