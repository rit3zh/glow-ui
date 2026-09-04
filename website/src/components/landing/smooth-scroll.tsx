"use client";

import * as React from "react";

/**
 * GSAP ScrollSmoother. It transforms `#smooth-content` on a lerp, so anything
 * that must stay put — the fixed navbar — has to live outside this wrapper.
 *
 * Plugins are imported inside the effect so nothing GSAP-related is pulled
 * into the server render.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
