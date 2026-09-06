"use client";

import * as React from "react";

import { COARSE_POINTER } from "@/hooks/use-media-query";

/**
 * GSAP ScrollSmoother. It transforms `#smooth-content` on a lerp, so anything
 * that must stay put — the fixed navbar — has to live outside this wrapper.
 *
 * Plugins are imported inside the effect so nothing GSAP-related is pulled
 * into the server render.
 *
 * It does not run on touch devices at all. `smoothTouch: 0` already turned the
 * lerp off there, but the rest of the machinery stayed: `normalizeScroll` takes
 * over touch scrolling to keep wheel input in sync with the transformed
 * content, which on a phone replaces the platform's own scrolling — the one
 * thing a mobile browser does entirely off the main thread — with a
 * JavaScript one, and the content wrapper keeps a transform that promotes the
 * whole document to a single layer under it. The result was a page paying the
 * full cost of smoothing to get none of it. Bailing out early also means gsap
 * and its two plugins are never fetched or parsed on mobile.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (window.matchMedia(COARSE_POINTER).matches) {
      return;
    }

    let smoother: { kill: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { ScrollSmoother }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/ScrollSmoother"),
        ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        // Seconds the content takes to catch up with the real scroll position.
        smooth: 1.1,
        smoothTouch: 0,
        // Keeps wheel/trackpad input in sync with the transformed content.
        normalizeScroll: true,
        ignoreMobileResize: true,
      });
    })();

    return () => {
      cancelled = true;
      smoother?.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}
