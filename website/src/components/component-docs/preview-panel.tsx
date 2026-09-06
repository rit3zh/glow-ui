"use client";

import { CodeXml, Github, Maximize, Minimize, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { ThemeSwitcher } from "@/components/animate/theme-switcher";
import {
  createPreviewRect,
  type PreviewRect,
  usePreviewShellExpand,
} from "@/components/component-docs/use-preview-expand";
import { SourceDrawer } from "@/components/component-docs/source-drawer";
import { DURATION, EASE_NUMERIC } from "@/components/landing/motion";
import { SwapText } from "@/components/landing/swap-text";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * One shared plate rather than a tooltip per control: it slides to whichever
 * cell the pointer is on and swaps its text with numeric-text's content
 * transition, so moving along the toolbar reads as one label being handed
 * between the buttons — the same mechanic as the landing page avatar stack.
 */
function ToolbarPopover({
  label,
  x,
  visible,
}: {
  label: string;
  x: number;
  visible: boolean;
}) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-lg border border-border/60 bg-background px-2 py-1 text-[0.7rem] text-foreground shadow-[0_4px_12px_-8px_rgba(0,0,0,0.35)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(${x}px) translateX(-50%)`,
        transition: `transform ${DURATION}s ${EASE_NUMERIC}, opacity 0.16s linear`,
      }}
    >
      <SwapText value={label} />
    </span>
  );
}

function ToolbarCell({
  children,
  active,
  label,
  onPoint,
  onClear,
}: {
  children: ReactNode;
  active?: boolean;
  /** Text the shared plate shows while this cell is pointed at or focused. */
  label: string;
  onPoint: (label: string, cell: HTMLElement) => void;
  onClear: () => void;
}) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-foreground/65 transition-colors",
        active && "bg-accent-pro text-white",
      )}
      onBlur={onClear}
      onFocus={(event) => onPoint(label, event.currentTarget)}
      onPointerEnter={(event) => onPoint(label, event.currentTarget)}
      onPointerLeave={onClear}
    >
      {children}
    </div>
  );
}

/**
 * The WebM sibling of a preview recording.
 *
 * The bucket stores both encodings of every preview under the same stem, so the
 * pages carry one URL and the second source is derived rather than duplicated
 * across 109 MDX files.
 */
function toWebm(src: string) {
  return src.replace(/\.mp4$/, ".webm");
}

/**
 * Whether a preview source is a still rather than a recording.
 *
 * The `(\?|$)` tail is load-bearing: landing-asset URLs carry a `?v=<hash>`
 * cache buster, so an extension test anchored to the end of the string never
 * matches one and the still gets handed to a `<video>`, which renders nothing.
 */
const STILL_FILE = /\.(png|jpe?g|webp|avif|gif)(\?|$)/i;

const toolbarIconClass =
  "flex size-full items-center justify-center rounded-[10px] text-current transition-[color,transform] ease-in-out active:scale-[0.96]";

/**
 * The preview half of the split shell.
 *
 * Components here are React Native, so the preview is a recorded run rather
 * than a live render — the panel still carries the controls that make sense
 * for one (replay, expand, theme), and drops the ones that do not.
 */
export function PreviewPanel({
  previewSrc,
  poster,
  title,
  githubUrl,
  sourceContent,
  sourceCode,
  sourceFilename,
}: {
  /** The recording, or the landing still for components without one. */
  previewSrc?: string;
  poster?: string;
  title: string;
  githubUrl?: string;
  /** The highlighted source, rendered on the server and shown in the sheet. */
  sourceContent?: ReactNode;
  sourceCode?: string;
  sourceFilename?: string;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSource, setShowSource] = useState(false);

  // The label outlives `hovered` so the plate keeps its text while it fades
  // out, instead of emptying and collapsing first.
  const [hovered, setHovered] = useState(false);
  const [hint, setHint] = useState({ label: "", x: 0 });

  /** A still has nothing to replay, so the toolbar drops that control for one. */
  const isStill = previewSrc ? STILL_FILE.test(previewSrc) : false;

  const previewRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLElement>(null);
  const splitRectRef = useRef<PreviewRect | null>(null);

  /**
   * Remember where the shell sits while it is still in the split layout —
   * once it is fixed and expanded, that geometry is no longer measurable.
   */
  const cacheSplitRect = useCallback(() => {
    const layout = previewRef.current?.closest("[data-docs-layout]");
    const shell = layout?.querySelector<HTMLElement>(
      "[data-docs-preview-shell]",
    );

    if (!shell || shell.style.position === "fixed") return;

    splitRectRef.current = createPreviewRect(shell.getBoundingClientRect());
  }, []);

  const handleReload = useCallback(() => {
    setReplayKey((current) => current + 1);
  }, []);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((current) => !current);
  }, []);

  const handleToggleSource = useCallback(() => {
    setShowSource((current) => !current);
  }, []);

  const handleCloseSource = useCallback(() => setShowSource(false), []);

  /** Cell centre, measured against the toolbar so its scroll offset is baked in. */
  const pointCell = useCallback((label: string, cell: HTMLElement) => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const box = cell.getBoundingClientRect();
    const x = box.left - toolbar.getBoundingClientRect().left + box.width / 2;

    setHint({ label, x });
    setHovered(true);
  }, []);

  const clearCell = useCallback(() => setHovered(false), []);

  useEffect(() => {
    cacheSplitRect();
    if (!isExpanded) return;

    const onResize = () => cacheSplitRect();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [cacheSplitRect, isExpanded]);

  // Escape is the expected way out of a full-bleed preview, and the split
  // layout has no other affordance once the panel covers the page.
  useEffect(() => {
    if (!isExpanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  usePreviewShellExpand({
    cacheSplitRect,
    isExpanded,
    previewRef,
    splitRectRef,
  });

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-background"
      ref={previewRef}
    >
      {/* The controls sit along the bottom edge, clear of the phone frame the
          recording fills the middle of the panel with. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
        {/* The plate lives outside the scroller — the toolbar clips its own
            overflow, and the plate sits above the toolbar's top edge. */}
        <div className="relative max-w-full">
          <ToolbarPopover label={hint.label} visible={hovered} x={hint.x} />

          <section
            aria-label="Preview controls"
            className="pointer-events-auto isolate flex max-w-full select-none items-center gap-1 overflow-x-auto rounded-2xl border border-border/50 bg-background p-1.5 shadow-[0_4px_12px_-8px_rgba(0,0,0,0.35)] no-scrollbar"
            ref={toolbarRef}
          >
            {!isStill && (
              <ToolbarCell
                label="Replay"
                onClear={clearCell}
                onPoint={pointCell}
              >
                <button
                  aria-label="Replay preview"
                  className={toolbarIconClass}
                  onClick={handleReload}
                  type="button"
                >
                  <RotateCcw className="size-4" />
                </button>
              </ToolbarCell>
            )}

            <ToolbarCell
              active={isExpanded}
              label={isExpanded ? "Collapse" : "Expand"}
              onClear={clearCell}
              onPoint={pointCell}
            >
              <button
                aria-label={isExpanded ? "Collapse preview" : "Expand preview"}
                aria-pressed={isExpanded}
                className={toolbarIconClass}
                onClick={handleToggleExpanded}
                type="button"
              >
                {isExpanded ? (
                  <Minimize className="size-4" />
                ) : (
                  <Maximize className="size-4" />
                )}
              </button>
            </ToolbarCell>

            <ToolbarCell label="Theme" onClear={clearCell} onPoint={pointCell}>
              <ThemeSwitcher className="size-full! rounded-[10px]! bg-transparent! shadow-none hover:bg-transparent!" />
            </ToolbarCell>

            {githubUrl && (
              <ToolbarCell
                label="GitHub"
                onClear={clearCell}
                onPoint={pointCell}
              >
                <a
                  aria-label="View on GitHub"
                  className={toolbarIconClass}
                  href={githubUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Github className="size-4" />
                </a>
              </ToolbarCell>
            )}

            {sourceContent && (
              <>
                <span
                  aria-hidden
                  className="mx-1 h-5 w-px shrink-0 bg-border"
                />

                <ToolbarCell
                  active={showSource}
                  label={showSource ? "Close code" : "Source"}
                  onClear={clearCell}
                  onPoint={pointCell}
                >
                  <button
                    aria-label={
                      showSource ? "Close source code" : "View source"
                    }
                    aria-pressed={showSource}
                    className={toolbarIconClass}
                    onClick={handleToggleSource}
                    type="button"
                  >
                    <CodeXml className="size-4" />
                  </button>
                </ToolbarCell>
              </>
            )}
          </section>
        </div>
      </div>

      {sourceContent && (
        <SourceDrawer
          copyCode={sourceCode}
          filename={sourceFilename}
          onClose={handleCloseSource}
          open={showSource}
        >
          {sourceContent}
        </SourceDrawer>
      )}

      <div className="flex h-full w-full items-center justify-center overflow-hidden p-6 lg:p-10">
        {previewSrc ? (
          <div
            className="relative flex h-full max-h-full w-full items-center justify-center"
            key={replayKey}
          >
            {/* Both encodings and the stills carry their own alpha channel, so
                the element gets no frame of its own — no radius, border or
                shadow. Any of those would draw a rectangle around a shape that
                is deliberately not rectangular, and a shadow would fall from
                the media's box rather than from the component inside it. */}
            {isStill ? (
              // Sized by width rather than height: the stills are exports a few
              // hundred pixels wide, so filling the panel's height the way a
              // recording does would blow a 380px badge up past 3x and show it.
              // `w-full` still lets it shrink to a phone column, and the cap
              // keeps it near its own resolution on a wide one.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`${title} preview`}
                className="h-auto max-h-full w-full max-w-[32rem] object-contain"
                decoding="async"
                src={previewSrc}
              />
            ) : (
              <video
                autoPlay
                className="h-full max-h-full w-auto max-w-full bg-transparent object-contain"
                loop
                muted
                playsInline
                poster={poster}
                preload="metadata"
              >
                {/* No single encoding is transparent everywhere, and both the
                    order and the `type` strings are load-bearing.

                    Safari composites alpha only from HEVC, Gecko only from VP9
                    in WebM, and each one plays the other's file opaque rather
                    than refusing it — so the markup has to make the wrong file
                    unselectable rather than merely second. Declaring the HEVC
                    as `codecs="hvc1"` does that: Safari takes it, Gecko refuses
                    the codec outright and falls through to the WebM below.
                    Naming the same file `video/quicktime` instead is what
                    paints a black rectangle in Gecko — it accepts quicktime and
                    decodes the HEVC with no alpha path. */}
                <source src={previewSrc} type='video/mp4; codecs="hvc1"' />
                <source src={toWebm(previewSrc)} type="video/webm" />
              </video>
            )}
          </div>
        ) : (
          <p className="max-w-xs text-center text-sm text-muted-foreground">
            No preview recorded for {title} yet.
          </p>
        )}
      </div>
    </div>
  );
}
