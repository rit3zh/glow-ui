"use client";

import type { ReactNode } from "react";

import { SlidingTabs } from "@/components/primitives-docs/sliding-tabs";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * The Preview / Code switch at the head of a primitive's page.
 *
 * The card, the slide and the height all come from `SlidingTabs`; what belongs
 * to this one is the dashed frame around the recording. That frame lives inside
 * the preview pane, not across the card — drawn across it, the rules ran
 * straight over the source in the Code tab, which read as scratches on the text
 * rather than as a frame around a specimen.
 */

/**
 * A dashed rule. Drawn as an SVG line rather than a CSS dashed border so the
 * dash pattern keeps its length on every edge — a border-image would rescale
 * it to fit.
 */
function Guide({
  orientation,
  className,
}: {
  orientation: "horizontal" | "vertical";
  className?: string;
}) {
  const horizontal = orientation === "horizontal";

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute text-border",
        horizontal ? "left-0 h-px w-full" : "top-0 h-full w-px",
        className,
      )}
    >
      <line
        stroke="currentColor"
        strokeDasharray="8 4"
        strokeWidth="1"
        x1="0"
        x2={horizontal ? "100%" : "0"}
        y1="0"
        y2={horizontal ? "0" : "100%"}
      />
    </svg>
  );
}

export function PreviewTabs({
  preview,
  code,
}: {
  preview: ReactNode;
  /** Omitted when the primitive's source has not synced to the bucket. */
  code?: ReactNode;
}) {
  return (
    <SlidingTabs
      ariaLabel="Preview or source"
      tabs={[
        {
          id: "preview",
          label: "Preview",
          content: (
            <div className="relative px-6 py-6">
              <Guide className="left-6" orientation="vertical" />
              <Guide className="right-6" orientation="vertical" />
              <Guide className="bottom-0" orientation="horizontal" />
              {preview}
            </div>
          ),
        },
        // The `pre` arrives already padded and scroll-capped from the
        // highlighter, so the pane reports the height it actually renders.
        ...(code ? [{ id: "code", label: "Code", content: code }] : []),
      ]}
    />
  );
}
