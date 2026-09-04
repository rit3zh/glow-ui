"use client";

import dynamic from "next/dynamic";

import { cn } from "#/lib/utils";

// Client-only: the package pulls in mathjs, which has no business in the
// server bundle for a purely decorative overlay.
const GradualBlur = dynamic(() => import("gradualblur/Gradualblur.jsx"), {
  ssr: false,
});

/** Height of the blur gradient — deliberately taller than the 3.5rem bar. */
export const BLUR_HEIGHT = "6rem";

type BottomEdgeBlurProps = {
  position: "top" | "bottom";
  className?: string;
};

/**
 * The soft band the page dissolves into at the bottom of the window.
 *
 * Pinned to the viewport here rather than by each caller. It used to be laid
 * out `absolute`, which needs a positioned ancestor to mean anything — the
 * landing page wrapped it in a `fixed` box and every catalogue page rendered it
 * bare, where `bottom-0` resolved against the initial containing block and put
 * the band a viewport down from the top of the document, nowhere near an edge.
 *
 * This blur is only for the bottom. Use the @EdgeBlur for the main nav blur.
 */
export function BottomEdgeBlur({
  position,
  className,
}: BottomEdgeBlurProps): React.ReactNode {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 z-[140]",
        position === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={{ height: BLUR_HEIGHT }}
    >
      <GradualBlur
        curve="bezier"
        divCount={8}
        exponential
        height={BLUR_HEIGHT}
        position={position}
        strength={2.5}
        target="parent"
        gpuOptimized
        zIndex={0}
      />
      {/* The blur alone carries no tint — this keeps content legible over
          bright material scrolling underneath it. */}
      <div
        className={cn(
          "absolute inset-0",
          position === "top"
            ? "bg-linear-to-b from-surface/80 via-surface/40 to-transparent"
            : "bg-linear-to-t from-surface/80 via-surface/40 to-transparent",
        )}
      />
    </div>
  );
}
