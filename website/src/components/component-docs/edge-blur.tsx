"use client";

import { useComponentSidebarOpen } from "@/components/component-docs/sidebar/context";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/components/workspace-ui/lib/utils";

/** Peak blur, in rem, at the outer edge — `2^4 * 0.0625 * strength`. */
const STRENGTH = 0.75;

/**
 * The progressive blur at the top and bottom of the reading column.
 *
 * A single gradient would only fade the colour; this blurs in steps as well,
 * so text dissolves as it passes under the pinned header instead of sliding
 * out from behind a hard edge.
 */
export function DocsEdgeBlur({
  position,
  height = "7rem",
  className,
}: {
  position: "top" | "bottom";
  height?: string;
  className?: string;
}) {
  const sidebarOpen = useComponentSidebarOpen();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-20 isolate",
        position === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={{ height }}
    >
      {/* `backdrop-filter` samples only what falls inside the filtered element
          and clamps at that boundary, repeating the outermost row of pixels
          outwards. Opening the panel re-composites this whole strip, and those
          repeated rows land as vertical streaks over the page. Nothing here is
          load-bearing while the panel is up — the tint below carries the band
          on its own — so the filtered layers stand down until it closes. */}
      {sidebarOpen ? null : (
        <ProgressiveBlur divCount={5} position={position} strength={STRENGTH} />
      )}

      {/* The blur alone carries no tint — this keeps the page background
          reading as solid behind the header and footer edges. */}
      <div
        className={cn(
          "absolute inset-0",
          position === "top"
            ? "bg-linear-to-b from-background via-background/60 to-transparent"
            : "bg-linear-to-t from-background via-background/60 to-transparent",
        )}
      />
    </div>
  );
}
