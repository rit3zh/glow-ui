"use client";

import * as React from "react";

import { CHAR, DURATION, EASE_NUMERIC } from "./motion";
import { Phrase, useReducedMotion } from "./swap-text";

/**
 * A phrase that swaps itself on a timer using numeric-text's transition:
 * outgoing glyphs rise, shrink, rotate and blur away while the incoming ones
 * arrive from below, staggered across a fixed share of the duration. The
 * wrapper animates its own width on the same curve so the surrounding line
 * re-centers instead of snapping — numeric-text does the same thing by
 * FLIP-translating its prefix and suffix.
 */
export function CyclingText({
  phrases,
  interval = 2800,
  className,
  spread = 1,
}: {
  phrases: string[];
  interval?: number;
  className?: string;
  spread?: number;
}) {
  const [index, setIndex] = React.useState(0);
  const [previous, setPrevious] = React.useState<number | null>(null);
  const [width, setWidth] = React.useState<number | null>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced || phrases.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => {
        setPrevious(current);
        return (current + 1) % phrases.length;
      });
    }, interval);

    return () => window.clearInterval(id);
  }, [interval, phrases.length, reduced]);

  // The outgoing copy only needs to live as long as its exit animation.
  React.useEffect(() => {
    if (previous === null) return;
    const id = window.setTimeout(
      () => setPrevious(null),
      DURATION * 1000 * (1 + CHAR.stagger * spread),
    );
    return () => window.clearTimeout(id);
  }, [previous, spread]);

  React.useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;

    const update = () => setWidth(node.getBoundingClientRect().width);
    update();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [index]);

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        whiteSpace: "nowrap",
        width: width ?? undefined,
        transition: reduced
          ? undefined
          : `width ${DURATION}s ${EASE_NUMERIC}`,
      }}
    >
      {/* Sizes the wrapper without taking part in layout. */}
      <span
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0"
        ref={measureRef}
      >
        {phrases[index]}
      </span>

      {previous === null ? null : (
        <span aria-hidden className="absolute top-0 left-0">
          <Phrase
            key={`out-${previous}`}
            mode="out"
            spread={spread}
            text={phrases[previous]}
          />
        </span>
      )}

      <span className="relative inline-block">
        <Phrase
          key={`in-${index}`}
          mode="in"
          reduced={reduced}
          spread={spread}
          text={phrases[index]}
        />
      </span>
    </span>
  );
}
