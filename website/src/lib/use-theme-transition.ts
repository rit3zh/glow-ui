"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";

/**
 * Drop-in replacement for next-themes `setTheme` that plays a circular
 * reveal animation originating from the last pointer position.
 *
 * The reveal itself is CSS — see the `::view-transition` block in the
 * stylesheet. This side only captures where the pointer was and how far the
 * circle has to grow; without those rules the browser falls back to its own
 * full-page cross-fade, which is the expensive one.
 *
 * Usage:
 *   const { toggle, ref } = useThemeTransition();
 *   <button ref={ref} onClick={toggle} />
 */
export function useThemeTransition() {
  const { resolvedTheme, setTheme } = useTheme();
  const originRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // `resolvedTheme` is the source of truth once React has caught up; dropping
  // the pending marker then keeps a stale target from surviving a theme change
  // this hook did not make (system switch, another tab via storage sync).
  useEffect(() => {
    if (pendingTheme === resolvedTheme) pendingTheme = null;
  }, [resolvedTheme]);

  /** Call this on the element that triggers the change to capture position. */
  const captureOrigin = useCallback((e: React.MouseEvent | MouseEvent) => {
    originRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const toggle = useCallback(
    (e?: React.MouseEvent | MouseEvent) => {
      if (e) captureOrigin(e);
      // Read through the pending marker, not `resolvedTheme` alone: that only
      // catches up after React commits, so a second click inside the same
      // frame would read the pre-click theme and "toggle" back to the theme
      // the page is already switching to — a full sweep that dissolves and
      // blurs the page for 560ms to arrive exactly where it started.
      const current = pendingTheme ?? resolvedTheme;
      const next = current === "dark" ? "light" : "dark";
      applyThemeTransition(
        { x: originRef.current.x, y: originRef.current.y },
        next,
        setTheme,
      );
    },
    [resolvedTheme, setTheme, captureOrigin],
  );

  const setThemeAnimated = useCallback(
    (theme: string, e?: React.MouseEvent | MouseEvent) => {
      if (e) captureOrigin(e);
      applyThemeTransition(
        { x: originRef.current.x, y: originRef.current.y },
        theme,
        setTheme,
      );
    },
    [setTheme, captureOrigin],
  );

  return { toggle, setThemeAnimated, captureOrigin, resolvedTheme };
}

interface ViewTransitionLike {
  finished: Promise<void>;
  ready: Promise<void>;
  skipTransition(): void;
}

type VTDocument = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => ViewTransitionLike;
};

// Module scope, not refs: the docs shell mounts three switchers at once — the
// site bar, the sidebar footer and the preview toolbar — and a transition
// started by one has to be seen by the next click, whichever button it lands
// on. Per-instance refs would let two of them run overlapping sweeps and tear
// down each other's `data-theme-switching` flag.
let activeTransition: ViewTransitionLike | null = null;
let pendingTheme: string | null = null;
let runId = 0;

function applyThemeTransition(
  origin: { x: number; y: number },
  next: string,
  setTheme: (theme: string) => void,
) {
  const { x, y } = origin;
  const doc = document as VTDocument;
  const root = document.documentElement;

  pendingTheme = next;

  // No View Transitions, or the reader has asked for less motion: switch
  // outright. The width guard that used to sit here existed because the
  // default cross-fade rasterized the whole page — the reveal is a mask on one
  // composited layer now, which costs the same at any size, so a wide window no
  // longer means no animation at all.
  //
  // `document.hidden` belongs with them: a backgrounded tab never advances the
  // transition, so it would sit unresolved with the flag latched on and the
  // theme would look stuck until the tab is focused again.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (
    typeof doc.startViewTransition !== "function" ||
    reduceMotion ||
    doc.hidden
  ) {
    setTheme(next);
    return;
  }

  // Compute radius large enough to cover the farthest corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  root.style.setProperty("--vt-r", `${endRadius}px`);

  // Clicking again mid-sweep would otherwise let the browser skip the running
  // transition for us, and a skip resolves its `finished` immediately — the
  // cleanup below would then strip the flag out from under the transition that
  // just replaced it. Skipping deliberately also means the next capture reads a
  // settled page rather than a half-revealed one.
  activeTransition?.skipTransition();

  // A backdrop-filtered element is composited against whatever is behind it,
  // and during a view transition that backdrop is a snapshot being masked and
  // blurred — so the blurred bar flickers as it re-samples a surface that is
  // itself animating. The flag lets the stylesheet flatten those surfaces to an
  // opaque fill for the length of the sweep; see `[data-theme-switching]`.
  root.dataset.themeSwitching = "";

  const run = ++runId;

  const transition = doc.startViewTransition(() => {
    // The browser snapshots the "new" state once this callback settles, and
    // paints the live page in the meantime. next-themes applies the class from
    // a passive effect, so a bare `setTheme` lands in a later task: the page
    // repaints fully in the new theme *before* the snapshot is taken, the
    // sweep then starts from radius zero under the old snapshot, and the
    // switch reads as a flash to the new theme, a snap back, then the
    // animation. `flushSync` commits the class inside this callback, so
    // nothing can paint between the two captures.
    flushSync(() => setTheme(next));
  });

  activeTransition = transition;
  transition.ready.catch(() => {}); // suppress unhandled rejection if interrupted

  const cleanup = () => {
    // A superseded run must not tear down the transition that replaced it.
    if (run !== runId) return;
    activeTransition = null;
    root.removeAttribute("data-theme-switching");
  };

  // `finished` rejects on `skipTransition` and on an aborted transition; an
  // unhandled rejection would surface as a console error on every fast click.
  transition.finished.then(cleanup, cleanup);
}
