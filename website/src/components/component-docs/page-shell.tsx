import { findNeighbour } from "fumadocs-core/server";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/app/config/site";
import { FileStructure } from "@/components/component-docs/file-structure";
import { InstallCommand } from "@/components/component-docs/install-command";
import { ComponentDocsLeftColumn } from "@/components/component-docs/left-column";
import { PreviewPanel } from "@/components/component-docs/preview-panel";
import { ComponentDocsSection } from "@/components/component-docs/section";
import { loadHighlightedSource } from "@/components/component-docs/source-code";
import { SidebarTrigger } from "@/components/component-docs/floating-sidebar";
import { cn } from "@/components/workspace-ui/lib/utils";
import { source } from "#/lib/source";

interface ComponentPageShellProps {
  title: string;
  description?: string;
  url: string;
  /** Slug within the section, e.g. `accordion`. */
  slug: string;
  installPath: string;
  /** The synced source file to offer in the preview's source sheet. */
  sourceName?: string;
  /** The recording, or the landing still for components without one. */
  previewSrc?: string;
  /** `lastModifiedTime: "git"` hands this back serialized, not as a Date. */
  lastModified?: Date | string | number;
  children: ReactNode;
}

const pagerButtonClassName =
  "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

function formatDate(value: Date | string | number) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  // A bare `2025-01-31` parses as UTC midnight, so formatting in local time
  // would render the day before west of Greenwich.
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The split frame every component page renders inside.
 *
 * The two columns scroll independently: the left one owns the reading flow,
 * the right one holds the recording at full height so it stays in view for the
 * whole page rather than scrolling away after the first screen. Below `lg`
 * they stack, preview first.
 */
export async function ComponentPageShell({
  title,
  description,
  url,
  slug,
  installPath,
  sourceName,
  previewSrc,
  lastModified,
  children,
}: ComponentPageShellProps) {
  const { previous, next } = findNeighbour(source.getPageTree(), url);
  const released = lastModified ? formatDate(lastModified) : null;

  // Highlighting happens here rather than in the sheet so the code ships with
  // the page instead of costing a round trip the first time it is opened.
  const componentSource = await loadHighlightedSource(
    "component",
    sourceName ?? slug,
    "no-scrollbar px-5 pb-10 font-mono text-[13.5px] leading-[1.7]",
  );

  const header = (
    <div className="flex w-full items-center gap-2.5">
      <SidebarTrigger />

      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-1 items-center gap-2 text-[15px] tracking-[-0.01em] text-muted-foreground"
      >
        <Link
          className="shrink-0 transition-colors hover:text-foreground"
          href="/components"
        >
          Components
        </Link>
        <span aria-hidden className="text-muted-foreground/40">
          /
        </span>
        <span className="truncate font-medium text-foreground">{title}</span>
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          aria-disabled={!previous}
          aria-label={previous ? `Go to ${previous.name}` : "No previous page"}
          className={cn(
            pagerButtonClassName,
            !previous && "pointer-events-none opacity-35",
          )}
          href={previous?.url ?? url}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Link
          aria-disabled={!next}
          aria-label={next ? `Go to ${next.name}` : "No next page"}
          className={cn(
            pagerButtonClassName,
            !next && "pointer-events-none opacity-35",
          )}
          href={next?.url ?? url}
        >
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-full min-h-screen w-full flex-col text-foreground lg:h-screen lg:flex-row"
      data-docs-layout
    >
      <ComponentDocsLeftColumn header={header}>
        <div className="w-full px-5 pb-32 pt-24 lg:px-8 lg:pt-28">
          <header className="max-w-4xl pb-16">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h1 className="font-serif text-[2.75rem] font-normal leading-[1.05] tracking-[-0.015em] text-foreground">
                {title}
              </h1>
              {released && (
                <span className="shrink-0 text-[14px] text-muted-foreground">
                  {released}
                </span>
              )}
            </div>

            {description && (
              <p className="mt-5 max-w-3xl text-[16px] leading-relaxed tracking-[-0.011em] text-foreground/60">
                {description}
              </p>
            )}
          </header>

          <div className="max-w-4xl space-y-16">
            <ComponentDocsSection id="installation" title="Installation">
              <InstallCommand component={slug} key={slug} />
            </ComponentDocsSection>

            <ComponentDocsSection id="file-structure" title="File Structure">
              <FileStructure path={installPath} />
            </ComponentDocsSection>

            <div id="component-docs-body">{children}</div>
          </div>

          <nav className="mt-24 flex max-w-4xl items-center justify-between border-t border-border/60 pt-8">
            {previous ? (
              <Link
                className="flex max-w-44 flex-col gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                href={previous.url}
              >
                <span className="text-muted-foreground/70">Previous</span>
                <span className="truncate font-medium text-foreground">
                  {previous.name}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                className="flex max-w-44 flex-col items-end gap-1 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
                href={next.url}
              >
                <span className="text-muted-foreground/70">Next</span>
                <span className="truncate font-medium text-foreground">
                  {next.name}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </ComponentDocsLeftColumn>

      <div
        className="z-20 order-first flex flex-1 flex-col bg-background lg:sticky lg:top-0 lg:order-last lg:h-full lg:max-w-1/2 lg:basis-1/2"
        data-docs-right-column
      >
        <div
          // Stacked, the preview takes the whole screen and the docs begin
          // below the fold — `dvh` rather than `vh` so a mobile browser's
          // collapsing chrome does not leave the panel taller than the window.
          // Side by side it just fills its half.
          className="relative h-[100dvh] w-full overflow-hidden p-4 lg:h-full lg:pb-3 lg:pl-1.5 lg:pr-3 lg:pt-3"
          data-docs-preview-shell
        >
          <PreviewPanel
            githubUrl={siteConfig.links.github}
            key={slug}
            previewSrc={previewSrc}
            sourceCode={componentSource?.code}
            sourceContent={componentSource?.rendered}
            sourceFilename={componentSource?.filename}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
