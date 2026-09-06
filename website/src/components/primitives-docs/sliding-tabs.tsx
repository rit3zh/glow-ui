"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";

import {
  PANEL_SPRING,
  usePaneHeight,
} from "@/components/component-docs/code-panel";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * The tabbed card the primitives pages are built out of — the preview, and the
 * installation block.
 *
 * Panes sit side by side in one track that translates, and the card springs to
 * the measured height of whichever pane is showing. Every moving part is on a
 * spring off one set of constants — nothing here runs on a duration — so the
 * height, the slide, the pill and the labels read as a single movement.
 *
 * Two things are load-bearing and both were bugs first:
 *
 * - `items-start` on the track. A flex row stretches its children to the
 *   tallest, so every pane reported the tallest pane's height and the card sat
 *   open at the size of its longest tab regardless of which one was showing.
 * - The panes' content must carry its own padding and scroll caps. Capping a
 *   `pre` with a descendant selector here leaves the pane reporting the
 *   uncapped height, which is the same bug by another route.
 */

export interface SlidingTab {
  id: string;
  label: string;
  content: ReactNode;
}

export function SlidingTabs({
  tabs,
  className,
  ariaLabel = "View",
}: {
  tabs: SlidingTab[];
  className?: string;
  ariaLabel?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const reduceMotion = useReducedMotion();

  /**
   * Three springs off one set of constants, split by the unit they animate.
   *
   * They share stiffness and damping, so the height, the slide and the pill
   * still read as a single movement. What cannot be shared is `restDelta`: it
   * is the distance at which a spring is allowed to stop, expressed in the
   * units of whatever it is driving, and these drive two different units.
   *
   * Half a pixel is right for the height. Against `overflow: hidden` the
   * default `0.01` leaves the spring creeping through hundredths of a pixel
   * that round back and forth across the clip edge, and the last line of
   * content shudders while the animation finishes.
   *
   * Half a *percent* is what that same number meant on the slide, which
   * animates `x` in percent — about four pixels on a card this wide. The track
   * jumped the last stretch instead of settling into it, which is the chop
   * this card was reported for. The slide keeps the pixel-scale default.
   */
  const heightTransition = reduceMotion
    ? { duration: 0 }
    : { ...PANEL_SPRING, restDelta: 0.5 };

  // `x` is a percentage here, so `restDelta` has to stay percentage-scale.
  const slideTransition = reduceMotion ? { duration: 0 } : PANEL_SPRING;

  // The pill travels in pixels, so it takes the pixel-scale rest.
  const pillTransition = heightTransition;

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === active),
  );
  const { containerRef, paneRefs, height: measured } = usePaneHeight(activeIndex);

  // `getBoundingClientRect` reports fractions, and a fractional target
  // guarantees the final frames sit between two pixels — the same shudder from
  // the other end. The card is only ever as tall as a whole number of them.
  const height = Math.round(measured);

  return (
    <div
      className={cn(
        "not-prose my-6 overflow-hidden rounded-2xl border border-border/60",
        className,
      )}
    >
      <div className="flex h-11 items-center border-b border-border/60 px-3">
        <div
          aria-label={ariaLabel}
          className="flex items-center gap-0.5"
          role="tablist"
        >
          {tabs.map((tab) => {
            const selected = tab.id === active;

            return (
              <button
                aria-selected={selected}
                className={cn(
                  "relative z-10 h-7 rounded-md px-3 text-[13.5px] text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                )}
                key={tab.id}
                onClick={() => setActive(tab.id)}
                role="tab"
                type="button"
              >
                {selected ? (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-md bg-accent"
                    // Scoped to this card: two of them on a page would hand the
                    // pill between cards when the second one is clicked.
                    layoutId={`sliding-tabs-${tabs.map((item) => item.id).join("-")}`}
                    transition={pillTransition}
                  />
                ) : null}
                {/*
                  The label dims on a spring rather than on a colour tween.
                  `transition-colors duration-200` was the one timing curve left
                  on this card, and a 200ms ease against a spring that settles
                  on its own schedule is what made the pill and its label look
                  like two separate movements. Opacity also composites, where
                  interpolating `text-muted-foreground` to `text-foreground`
                  repaints the glyphs every frame.
                */}
                <motion.span
                  animate={{ opacity: selected ? 1 : 0.55 }}
                  className="relative"
                  initial={false}
                  transition={pillTransition}
                >
                  {tab.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        animate={{ height: height || "auto" }}
        className="relative overflow-hidden"
        ref={containerRef}
        transition={heightTransition}
      >
        <motion.div
          animate={{ x: `${activeIndex * -100}%` }}
          className="flex items-start"
          transition={slideTransition}
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;

            return (
              // No filter on the panes.
              //
              // These used to animate `blur(0px)` ↔ `blur(4px)` on the same
              // spring as everything else, and a changing blur radius is what
              // read as the pane scaling in and out at the end of the move: the
              // softened edges of every glyph swell and contract, which the eye
              // takes for size. It is also the most expensive thing here — the
              // whole pane is re-rasterized on every frame — so it was still
              // re-rendering through the spring's tail, long after the slide had
              // visually finished. The slide and the height carry the movement.
              <motion.div
                className="w-full shrink-0"
                initial={false}
                inert={!isActive}
                key={tab.id}
                ref={(node) => {
                  paneRefs.current[index] = node;
                }}
                role="tabpanel"
                transition={slideTransition}
              >
                {tab.content}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
