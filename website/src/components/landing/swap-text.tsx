"use client";

import * as React from "react";

import { CHAR, DURATION, EASE_NUMERIC } from "./motion";

/**
 * numeric-text's content transition, driven by a value rather than a timer.
 *
 * The mechanic is the one in `inspo/numeric-text`: the outgoing string leaves
 * along the same axis the incoming one arrives on — glyphs rise, shrink to
 * 0.6, rotate 2deg and blur, staggered across a fixed share of the duration —
 * while the wrapper animates its own width so whatever sits beside it slides
 * instead of snapping. numeric-text gets that last part by FLIP-translating
 * its prefix and suffix around the changed middle; a width tween on the same
 * curve is indistinguishable for a label that swaps wholesale.
 */

export function SwapText({
  value,
  className,
  spread = 1,
}: {
  value: string;
  className?: string;
  /** Multiplier on the stagger budget; >1 spreads the string out further. */
  spread?: number;
}) {
  const [outgoing, setOutgoing] = React.useState<string | null>(null);
  const previous = React.useRef(value);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [width, setWidth] = React.useState<number | null>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (previous.current === value) return;
    setOutgoing(previous.current);
    previous.current = value;
  }, [value]);

  // The outgoing copy only needs to live as long as its exit animation.
  React.useEffect(() => {
    if (outgoing === null) return;
    const id = window.setTimeout(
      () => setOutgoing(null),
      DURATION * 1000 * (1 + CHAR.stagger * spread),
    );
    return () => window.clearTimeout(id);
  }, [outgoing, spread]);

  React.useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;

    const update = () => setWidth(node.getBoundingClientRect().width);
    update();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        verticalAlign: "top",
        whiteSpace: "nowrap",
        width: width ?? undefined,
        transition: reduced ? undefined : `width ${DURATION}s ${EASE_NUMERIC}`,
      }}
    >
      {/* Sizes the wrapper without taking part in layout. */}
      <span
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0"
        ref={measureRef}
      >
        {value}
      </span>

      {outgoing === null ? null : (
        <span aria-hidden className="absolute top-0 left-0">
          <Phrase key={`out-${outgoing}`} mode="out" spread={spread} text={outgoing} />
        </span>
      )}

      <span className="relative inline-block">
        <Phrase
          key={`in-${value}`}
          mode="in"
          reduced={reduced}
          spread={spread}
          text={value}
        />
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   phrase                                   */
/* -------------------------------------------------------------------------- */

/**
 * Every glyph is its own `inline-block` so it can be transformed, and a plain
 * space inside one collapses to zero width — "muscle memory" renders as
 * "musclememory". numeric-text solves it the same way, with its `SPACE` const.
 */
const NBSP = "\u00A0";

/** One copy of a string, either arriving or leaving. */
export function Phrase({
  text,
  mode,
  spread,
  reduced,
}: {
  text: string;
  mode: "in" | "out";
  spread: number;
  reduced?: boolean;
}) {
  // "in" starts displaced and settles; "out" starts at rest and leaves.
  const [atRest, setAtRest] = React.useState(mode === "out");

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setAtRest(mode === "in"));
    return () => cancelAnimationFrame(frame);
  }, [mode]);

  const chars = [...text];
  const animating = text.replace(/\s/g, "").length;
  const step = (DURATION * CHAR.stagger * spread) / Math.max(animating, 1);

  // Enter rises from below, exit continues upward — one direction of travel.
  const displaced =
    mode === "in"
      ? `translateY(${CHAR.y}em) scale(${CHAR.scale}) rotateZ(${CHAR.rotate}deg)`
      : `translateY(-${CHAR.y}em) scale(${CHAR.scale}) rotateZ(${CHAR.rotate}deg)`;

  return (
    <span aria-label={mode === "in" ? text : undefined}>
      {chars.map((char, charIndex) => (
        <span
          aria-hidden
          className="inline-block"
          key={`${char}-${charIndex}`}
          style={{
            opacity: atRest ? 1 : 0,
            transform: atRest ? "none" : displaced,
            filter: atRest ? "blur(0px)" : `blur(${CHAR.blur}em)`,
            transition: reduced
              ? "none"
              : `opacity ${DURATION}s ${EASE_NUMERIC} ${charIndex * step}s,
                 transform ${DURATION}s ${EASE_NUMERIC} ${charIndex * step}s,
                 filter ${DURATION}s ${EASE_NUMERIC} ${charIndex * step}s`,
            willChange: "transform, filter, opacity",
          }}
        >
          {char === " " ? NBSP : char}
        </span>
      ))}
    </span>
  );
}

export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
