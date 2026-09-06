"use client";

import * as React from "react";

import MetallicPaint from "@/components/metallic-paint/metallic-paint";
import { cn } from "#/lib/utils";
import { Logo } from "./logo";
import { LOGO_PATHS, LOGO_VIEWBOX } from "./paths";

/**
 * The shader reads its shape out of an image's alpha channel, so the glyph has
 * to be rasterised first. 512px is the smallest size the processing step will
 * accept without upscaling it itself, and the depth solve it runs is O(pixels),
 * so staying at the floor keeps the one-off cost as small as it goes.
 */
const RASTER_SIZE = 512;

const LOGO_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}" width="${RASTER_SIZE}" height="${RASTER_SIZE}">${LOGO_PATHS.map(
    (d) => `<path d="${d}" fill="#000000"/>`,
  ).join("")}</svg>`,
)}`;

export interface MetallicLogoProps {
  className?: string;
  /** Colour of the plain glyph shown until — or instead of — the shader. */
  fallbackClassName?: string;
}

/**
 * The glyph, painted by the metallic shader.
 *
 * The plain SVG sits underneath and is what a visitor sees while the depth map
 * is being solved, and what they keep seeing if WebGL2 is unavailable: the
 * canvas simply never paints over it. Mounting is deferred to an idle callback
 * so the solve never lands inside the first paint of the page.
 */
export function MetallicLogo({ className, fallbackClassName }: MetallicLogoProps) {
  const [painted, setPainted] = React.useState(false);

  React.useEffect(() => {
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => setPainted(true), { timeout: 2000 })
        : window.setTimeout(() => setPainted(true), 300);

    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle as number);
      } else {
        window.clearTimeout(idle as number);
      }
    };
  }, []);

  return (
    <span className={cn("relative block", className)}>
      <Logo className={cn("h-full w-full", fallbackClassName)} />
      {painted ? (
        <span className="absolute inset-0">
          <MetallicPaint
            angle={-20}
            blur={0.012}
            brightness={2.1}
            chromaticSpread={2.4}
            contour={0.35}
            contrast={0.55}
            distortion={1.1}
            imageSrc={LOGO_DATA_URI}
            liquid={0.85}
            noiseScale={0.45}
            refraction={0.014}
            scale={5}
            seed={17}
            speed={0.18}
            tintColor="#c9d4ff"
          />
        </span>
      ) : null}
    </span>
  );
}
