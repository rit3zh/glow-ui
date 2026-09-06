"use client";

import type { ReactNode } from "react";

import { DocsEdgeBlur } from "@/components/component-docs/edge-blur";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * The reading half of the split shell.
 *
 * It owns its own scroll container instead of riding the document, which is
 * what lets the preview half stay pinned at full height beside it. The header
 * is pinned above the scroller rather than inside it, so the page title
 * scrolls away while the breadcrumb stays.
 */
export function ComponentDocsLeftColumn({
  header,
  children,
  fullWidth = false,
}: {
  header?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-full w-full flex-col bg-background",
        fullWidth ? "min-h-screen flex-1" : "lg:max-w-1/2 lg:basis-1/2",
      )}
      data-docs-left-column
    >
      <DocsEdgeBlur position="top" />

      {header && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-5 pt-5 lg:px-8">
          <div className="pointer-events-auto">{header}</div>
        </div>
      )}

      <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>

      <DocsEdgeBlur className="lg:h-28" height="5rem" position="bottom" />
    </div>
  );
}
