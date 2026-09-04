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

type EdgeBlurProps = {
  position: "top" | "bottom";
  className?: string;
};

/**
 * The soft fade at a viewport edge. Both edges share one implementation so the
 * top and bottom bands read as the same material.
 */
export function EdgeBlur({ position, className }: EdgeBlurProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0",
        position === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={{ height: BLUR_HEIGHT }}
    >
      <GradualBlur
        curve="bezier"
        divCount={3}
        exponential
        height={BLUR_HEIGHT}
        position={position}
        strength={2}
        target="parent"
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
