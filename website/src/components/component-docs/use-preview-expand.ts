"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const EXPAND_MS = 420;
const EXPAND_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Below this the column has collapsed and is not a usable collapse target. */
const MIN_COLLAPSE_HEIGHT = 40;

/** Everything the expand writes inline, and the collapse has to hand back. */
const FIXED_PROPERTIES = [
  "position",
  "top",
  "left",
  "width",
  "height",
  "zIndex",
  "padding",
  "transition",
  "backgroundColor",
] as const;

export interface PreviewRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** A rect plus the padding that goes with it, since both are animated. */
interface PreviewGeometry {
  rect: PreviewRect;
  padding: string;
}

export function createPreviewRect(rect: DOMRect | PreviewRect): PreviewRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

/**
 * The expanded padding is a design call — full bleed on a phone, a hairline
 * inset on a desktop. The split padding is never stated here: it is whatever
 * the shell's own class list resolves to at the current breakpoint, so it gets
 * measured alongside the rect.
 */
function getExpandedPadding(isMobile: boolean) {
  return isMobile ? "0px" : "12px";
}

/** The longhands, because a shorthand read back is not guaranteed to serialize. */
function readPadding(shell: HTMLElement) {
  const style = getComputedStyle(shell);

  return `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`;
}

/** Whatever the shell is showing right now, mid-transition included. */
function readGeometry(shell: HTMLElement): PreviewGeometry {
  return {
    rect: createPreviewRect(shell.getBoundingClientRect()),
    padding: readPadding(shell),
  };
}

/**
 * Where the shell would sit if it were not fixed — measured, not derived.
 *
 * The collapse has to land exactly where flow will drop the shell the instant
 * the inline styles come off, and the only thing that knows that is layout.
 * Reconstructing it from the column means restating the shell's padding and box
 * model here, and being one border-box out is a visible snap on the last frame.
 * Style changes within a task are never painted, so the shell can go back into
 * flow, be read, and be put back without a frame of it reaching the screen.
 */
function measureSplitGeometry(shell: HTMLElement): PreviewGeometry {
  const column = shell.closest<HTMLElement>("[data-docs-right-column]");
  const columnMinHeight = column?.style.minHeight ?? "";

  for (const property of FIXED_PROPERTIES) {
    shell.style.removeProperty(property);
  }

  // Nothing may animate off the temporary state, on the way in or back out.
  shell.style.transition = "none";
  column?.style.removeProperty("min-height");

  const geometry = readGeometry(shell);

  if (columnMinHeight) column?.style.setProperty("min-height", columnMinHeight);

  return geometry;
}

function getViewportRect(): PreviewRect {
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function applyFixedRect(shell: HTMLElement, rect: PreviewRect, padding: string) {
  shell.style.position = "fixed";
  shell.style.top = `${rect.top}px`;
  shell.style.left = `${rect.left}px`;
  shell.style.width = `${rect.width}px`;
  shell.style.height = `${rect.height}px`;
  shell.style.zIndex = "60";
  shell.style.padding = padding;
  shell.style.backgroundColor = "var(--background)";
}

function clearFixedStyles(shell: HTMLElement, cacheSplitRect: () => void) {
  delete shell.dataset.previewExpanded;

  for (const property of FIXED_PROPERTIES) {
    shell.style.removeProperty(property);
  }

  shell
    .closest<HTMLElement>("[data-docs-right-column]")
    ?.style.removeProperty("min-height");

  cacheSplitRect();
}

/**
 * Pin the shell to the frame it is currently showing, with nothing animating.
 *
 * Both directions start here: a toggle mid-flight carries on from where the eye
 * last saw the shell instead of jumping to wherever the previous animation was
 * headed.
 */
function pinTo(shell: HTMLElement, geometry: PreviewGeometry) {
  shell.style.transition = "none";
  applyFixedRect(shell, geometry.rect, geometry.padding);
  shell.getBoundingClientRect(); // Flush, so the next frame animates from here.
}

function expand(
  shell: HTMLElement,
  expandedPadding: string,
  transition: string,
  splitRectRef: RefObject<PreviewRect | null>,
) {
  const from = readGeometry(shell);
  // Re-expanding out of a collapse that is still running: the shell is fixed
  // and mid-flight, so its own box is not the split box any more.
  const split =
    shell.style.position === "fixed" ? measureSplitGeometry(shell) : from;

  if (split.rect.height >= MIN_COLLAPSE_HEIGHT) {
    splitRectRef.current = split.rect;
  }

  // Taking the shell out of flow would otherwise collapse the column behind
  // it, and the page would jump before the animation had started.
  shell
    .closest<HTMLElement>("[data-docs-right-column]")
    ?.style.setProperty("min-height", `${split.rect.height}px`);

  pinTo(shell, from);

  shell.style.transition = transition;
  requestAnimationFrame(() => {
    applyFixedRect(shell, getViewportRect(), expandedPadding);
    shell.dataset.previewExpanded = "true";
  });
}

function collapse(
  shell: HTMLElement,
  transition: string,
  splitRectRef: RefObject<PreviewRect | null>,
  cacheSplitRect: () => void,
) {
  const from = readGeometry(shell);
  const split = measureSplitGeometry(shell);
  const cached = splitRectRef.current;

  // A degenerate live measurement means the column is not a usable target —
  // a stale rect from before the expand still beats snapping home.
  const rect =
    split.rect.height >= MIN_COLLAPSE_HEIGHT
      ? split.rect
      : cached && cached.height >= MIN_COLLAPSE_HEIGHT
        ? cached
        : null;

  if (!rect) {
    clearFixedStyles(shell, cacheSplitRect);
    return undefined;
  }

  splitRectRef.current = rect;
  delete shell.dataset.previewExpanded;
  pinTo(shell, from);

  shell.style.transition = transition;
  requestAnimationFrame(() => applyFixedRect(shell, rect, split.padding));

  let finished = false;
  let timeoutId = 0;

  const finish = () => {
    if (finished) return;

    finished = true;
    window.clearTimeout(timeoutId);
    shell.removeEventListener("transitionend", onTransitionEnd);
    clearFixedStyles(shell, cacheSplitRect);
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== shell) return;
    finish();
  };

  shell.addEventListener("transitionend", onTransitionEnd);
  // The transition can be dropped (a background tab, say) and never fire — and
  // side by side the shell keeps its height throughout, so the property that
  // ends last is not knowable up front.
  timeoutId = window.setTimeout(finish, EXPAND_MS + 80);

  return () => {
    window.clearTimeout(timeoutId);
    shell.removeEventListener("transitionend", onTransitionEnd);
  };
}

/**
 * Grow the preview shell out of the split column and into the viewport.
 *
 * The shell animates between two measured rectangles rather than toggling a
 * class, because its collapsed size is whatever the column happens to be —
 * there is no static "from" to write in CSS.
 */
export function usePreviewShellExpand({
  isExpanded,
  previewRef,
  cacheSplitRect,
  splitRectRef,
}: {
  isExpanded: boolean;
  previewRef: RefObject<HTMLDivElement | null>;
  cacheSplitRect: () => void;
  splitRectRef: RefObject<PreviewRect | null>;
}) {
  useEffect(() => {
    const layout = previewRef.current?.closest("[data-docs-layout]");
    const shell = layout?.querySelector<HTMLElement>(
      "[data-docs-preview-shell]",
    );

    if (!shell) return;

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const transition = (["top", "left", "width", "height", "padding"] as const)
      .map((property) => `${property} ${EXPAND_MS}ms ${EXPAND_EASING}`)
      .join(", ");

    let cleanup: (() => void) | undefined;

    if (isExpanded) {
      expand(shell, getExpandedPadding(isMobile), transition, splitRectRef);
    } else if (shell.style.position === "fixed") {
      cleanup = collapse(shell, transition, splitRectRef, cacheSplitRect);
    } else {
      clearFixedStyles(shell, cacheSplitRect);
    }

    return () => cleanup?.();
  }, [cacheSplitRect, isExpanded, previewRef, splitRectRef]);
}
