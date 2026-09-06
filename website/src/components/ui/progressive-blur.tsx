"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";

import { cn } from "#/lib/utils";

/**
 * A progressive blur band — a stack of masked `backdrop-filter` layers whose
 * radii ramp towards one edge, so content dissolves as it approaches it rather
 * than sliding under a hard line.
 *
 * This replaces the `gradualblur` package, which produced exactly these styles
 * but imported all of `mathjs` — 716KB of computer algebra — to call `pow` and
 * `round`. That was the single largest script on the site, parsed on every page
 * load before anything decorative could paint, and on a mid-range phone that is
 * most of a second of blocked main thread for two arithmetic operations.
 * `code-file.tsx` had already inlined the same ramp for the same reason; this
 * is that fix generalised so every band on the site shares one implementation.
 *
 * The curve, the radii and the mask stops are the package's own, so the bands
 * look exactly as they did.
 */

type Position = "top" | "bottom";

const DIRECTION: Record<Position, string> = {
  top: "to top",
  bottom: "to bottom",
};

/** `gradualblur`'s "bezier" curve — smoothstep. */
const smoothstep = (progress: number) => progress * progress * (3 - 2 * progress);

const round1 = (value: number) => Math.round(value * 10) / 10;

function ramp(divCount: number, strength: number, position: Position) {
  const increment = 100 / divCount;
  const direction = DIRECTION[position];
  const layers: CSSProperties[] = [];

  for (let i = 1; i <= divCount; i++) {
    const progress = smoothstep(i / divCount);
    const blur = 2 ** (progress * 4) * 0.0625 * strength;

    const p1 = round1(increment * i - increment);
    const p2 = round1(increment * i);
    const p3 = round1(increment * i + increment);
    const p4 = round1(increment * i + increment * 2);

    let stops = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) stops += `, black ${p3}%`;
    if (p4 <= 100) stops += `, transparent ${p4}%`;

    const mask = `linear-gradient(${direction}, ${stops})`;

    layers.push({
      position: "absolute",
      inset: 0,
      maskImage: mask,
      WebkitMaskImage: mask,
      backdropFilter: `blur(${blur.toFixed(3)}rem)`,
      WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
    });
  }

  return layers;
}

export interface ProgressiveBlurProps {
  position: Position;
  /** Layers in the ramp. More is smoother and costs a compositor pass each. */
  divCount?: number;
  /**
   * Layers on a touch device.
   *
   * Every layer is a full-width `backdrop-filter` behind a mask, and a band
   * pinned to the viewport is re-composited on every scroll frame — so an
   * eight-layer ramp is eight blur passes per frame across the width of the
   * screen for the entire life of the page. Desktop GPUs absorb that; phone
   * GPUs are what the site was juddering on. One pass is still a real blur and
   * at phone size is all but indistinguishable from the ramp.
   *
   * Both ramps are rendered and a media query picks one, rather than measuring
   * the viewport in JavaScript. A `matchMedia` answer only arrives after
   * hydration, which would mean phones painting the full stack first and
   * standing it down afterwards — paying the exact cost this avoids, during
   * the busiest moment of the page's life. `display: none` costs nothing: the
   * compositor never builds a layer for the ramp that loses.
   */
  mobileDivCount?: number;
  /** Peak blur in rem at the ramp's far end is `2^4 * 0.0625 * strength`. */
  strength?: number;
  className?: string;
  style?: CSSProperties;
}

export function ProgressiveBlur({
  position,
  divCount = 5,
  mobileDivCount = 1,
  strength = 2,
  className,
  style,
}: ProgressiveBlurProps) {
  const fine = useMemo(
    () => ramp(divCount, strength, position),
    [divCount, strength, position],
  );
  const coarse = useMemo(
    () => ramp(mobileDivCount, strength, position),
    [mobileDivCount, strength, position],
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={style}
    >
      {divCount > 0 ? (
        <div className="progressive-blur-fine absolute inset-0">
          {fine.map((layer, index) => (
            <div key={index} style={layer} />
          ))}
        </div>
      ) : null}

      {mobileDivCount > 0 ? (
        <div className="progressive-blur-coarse absolute inset-0">
          {coarse.map((layer, index) => (
            <div key={index} style={layer} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
