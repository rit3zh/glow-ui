"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { CopyButton } from "@/components/buttons/copy";
import { FileTypeIcon } from "@/components/component-docs/file-type-icons";

/**
 * One source file: a titled header, and the code under it, collapsed until
 * asked for.
 *
 * Exactly one thing animates — the height of the code window. Everything else
 * holds still, and that is the whole design rather than an economy:
 *
 * The fade at the foot used to grow and shrink with the window, which meant its
 * five masked `backdrop-filter` layers were recomputed on every frame of the
 * open. A backdrop filter re-samples what is behind it; five of them, remasked
 * per frame, against a moving backdrop, is far more work than the height
 * change itself — and it is what made the expand and collapse stutter. The band
 * is a fixed height now and never animates at all, so the only thing the
 * browser does per frame is resize one box.
 *
 * The button does not move either. It sits in that band in both states and
 * changes its word, rather than travelling from the middle of the block to the
 * bottom of it.
 */

/** How much of a collapsed file is legible before the fade takes over. */
const COLLAPSED_HEIGHT = 148;

/** How tall an expanded file may stand before it scrolls internally. */
const EXPANDED_MAX = 620;

/** The fade band, and the button's home. Constant in both states. */
const FADE_HEIGHT = 96;

/** Below this much overflow a file is simply shown whole — no button, no fade. */
const OVERFLOW_SLACK = 24;

const TIMING = "300ms cubic-bezier(0.32, 0.72, 0, 1)";

/** Layers in the blur ramp. More is smoother and costs a layer each. */
const FADE_LAYERS = 5;

/** `gradualblur`'s bezier — smoothstep. */
const smoothstep = (progress: number) => progress * progress * (3 - 2 * progress);

/**
 * The blur ramp, resolved once at module load.
 *
 * Every value is a constant, so these objects are built here rather than per
 * render — there is nothing about them that depends on state.
 *
 * Later layers blur harder and reach less far up, so the radii pile up towards
 * the bottom edge. Each holds full strength until one feather short of its
 * reach, so neighbours overlap into a ramp instead of stepping.
 */
const FADE_STYLES: CSSProperties[] = Array.from(
  { length: FADE_LAYERS },
  (_, index) => {
    const layer = index + 1;
    const blur = 2 ** (smoothstep(layer / FADE_LAYERS) * 2) * 0.0625 * 1.6;
    const feather = FADE_HEIGHT / FADE_LAYERS;
    const reach = (FADE_HEIGHT * (FADE_LAYERS - layer + 1)) / FADE_LAYERS;
    const mask = `linear-gradient(to top, black 0px, black ${reach - feather}px, transparent ${reach}px)`;

    return {
      backdropFilter: `blur(${blur.toFixed(3)}rem)`,
      WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
      WebkitMaskImage: mask,
      maskImage: mask,
    };
  },
);

/**
 * The fade at the foot of the code.
 *
 * A gradient alone dims the code but leaves every glyph under it perfectly
 * sharp, which reads as a sheet laid over legible text rather than as text
 * receding. The stacked blur layers make the type go soft as it goes dim, and
 * the tint rides on top so the last line is not a half-legible tease.
 */
function ProgressiveFade() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0"
      style={{ height: FADE_HEIGHT }}
    >
      {FADE_STYLES.map((style, index) => (
        <div className="absolute inset-0" key={index} style={style} />
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-code-surface via-code-surface/75 to-transparent" />
    </div>
  );
}

export function CodeFile({
  path,
  filename,
  code,
  children,
}: {
  /** Where the file lands, e.g. `components/primitives/alert/index.tsx`. */
  path: string;
  filename: string;
  /** The raw file, for the copy button. */
  code: string;
  /** Highlighted markup, prepared on the server. */
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  /**
   * Whether the window has finished resizing.
   *
   * Scrolling is only handed over once it has. Switching to `overflow: auto`
   * as the animation starts lets a scrollbar appear and disappear mid-flight,
   * which reflows the code inside the box every frame it is visible.
   */
  const [settled, setSettled] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    // Rounded: a fractional target leaves the final frames sitting between two
    // pixels, and the clip edge shimmers as it rounds one way then the other.
    const measure = () =>
      setContentHeight(Math.round(node.getBoundingClientRect().height));

    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /**
   * Until it has been measured, a file is assumed to overflow.
   *
   * The height is only knowable on the client, so starting from "fits" meant
   * the server sent every file at full height and hydration snapped them all
   * shut. Starting collapsed, the only correction left is a short file opening
   * up, which is both rarer and gentler.
   */
  const measured = contentHeight > 0;
  const overflows = !measured || contentHeight > COLLAPSED_HEIGHT + OVERFLOW_SLACK;

  const height = open
    ? Math.min(contentHeight || EXPANDED_MAX, EXPANDED_MAX)
    : COLLAPSED_HEIGHT;

  const toggle = () => {
    setSettled(false);
    setOpen((current) => !current);
  };

  return (
    <div className="group/code overflow-hidden rounded-xl border-[0.5px] border-border/60 bg-code-surface">
      <div className="flex h-11 items-center gap-2 border-b border-border/50 px-4">
        <FileTypeIcon className="size-4 shrink-0" filename={filename} />
        <span className="truncate font-mono text-[13px] text-muted-foreground">
          {path}
        </span>
        <CopyButton
          className="ml-auto shrink-0 bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
          content={code}
          size="sm"
          variant="ghost"
        />
      </div>

      <div className="relative">
        <div
          onTransitionEnd={(event) => {
            if (event.propertyName === "height") setSettled(true);
          }}
          style={{
            height: overflows ? height : undefined,
            overflowY: overflows && open && settled ? "auto" : "hidden",
            transition: `height ${TIMING}`,
          }}
        >
          <div ref={contentRef}>{children}</div>
        </div>

        {overflows ? (
          <>
            <ProgressiveFade />

            <div
              className="absolute inset-x-0 bottom-0 flex items-center justify-center"
              style={{ height: FADE_HEIGHT }}
            >
              <button
                aria-expanded={open}
                className="pointer-events-auto rounded-full border-[0.5px] border-border/60 bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                onClick={toggle}
                type="button"
              >
                {open ? "Collapse" : "Expand"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
