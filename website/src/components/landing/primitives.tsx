"use client";

import * as React from "react";
import { cn } from "#/lib/utils";
import { CHAR, DURATION, EASE_NUMERIC } from "./motion";

/* -------------------------------------------------------------------------- */
/*                                   in view                                  */
/* -------------------------------------------------------------------------- */

type InViewOptions = {
  /** Stop observing after the first intersection. */
  once?: boolean;
  /** How far into the viewport the element must travel. */
  margin?: string;
  amount?: number;
};

export function useInView<T extends HTMLElement>({
  once = true,
  margin = "0px 0px -12% 0px",
  amount = 0.15,
}: InViewOptions = {}) {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin, threshold: amount },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, margin, amount]);

  return [ref, inView] as const;
}

function usePrefersReducedMotion() {
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

/* -------------------------------------------------------------------------- */
/*                              character reveal                              */
/* -------------------------------------------------------------------------- */

const SPACE = " ";

type CharsProps = {
  children: string;
  className?: string;
  /** Seconds before the first character starts. */
  delay?: number;
  /** Multiplier on the stagger budget; >1 spreads the line out further. */
  spread?: number;
  /** Animate immediately instead of waiting for the element to scroll in. */
  immediate?: boolean;
};

/**
 * Per-character entrance built from numeric-text's transform recipe: glyphs
 * rise 0.35em, scale from 0.6, unrotate 2deg and unblur, staggered across a
 * fixed fraction of the duration so long lines never feel slow.
 */
export function Chars({
  children,
  className,
  delay = 0,
  spread = 1,
  immediate = false,
}: CharsProps) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const words = React.useMemo(() => children.split(" "), [children]);
  const animatingCount = children.replace(/\s/g, "").length;
  const step = (DURATION * CHAR.stagger * spread) / Math.max(animatingCount, 1);

  const visible = reduced || (immediate ? mounted : inView);

  /**
   * Whether the entrance is over.
   *
   * `will-change` below promotes every glyph to its own compositor layer, and
   * a promise about `filter` keeps a blur surface allocated alongside it. It
   * used to be unconditional, which made it a standing cost rather than a
   * hint: the landing page painted 127 glyph layers before a single one had
   * moved — most of them in sections still several screens away — and none of
   * them was ever released. So the promise is now made only for the half
   * second a line is actually in motion. Off-screen lines make no promise at
   * all, and a line that has landed withdraws its own.
   */
  const [settled, setSettled] = React.useState(false);

  React.useEffect(() => {
    if (!visible || reduced) return;

    setSettled(false);
    const last = delay + Math.max(animatingCount - 1, 0) * step + DURATION;
    const timer = window.setTimeout(() => setSettled(true), last * 1000 + 60);
    return () => window.clearTimeout(timer);
  }, [visible, reduced, delay, animatingCount, step]);

  let index = 0;

  return (
    <span aria-label={children} className={cn("inline", className)} ref={ref}>
      {words.map((word, wordIndex) => (
        <span
          aria-hidden
          className="inline-block whitespace-nowrap"
          key={`${word}-${wordIndex}`}
        >
          {[...word].map((char, charIndex) => {
            const charDelay = delay + index * step;
            index += 1;

            return (
              <span
                className="inline-block"
                key={`${char}-${charIndex}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? "none"
                    : `translateY(${CHAR.y}em) scale(${CHAR.scale}) rotateZ(${CHAR.rotate}deg)`,
                  filter: visible ? "blur(0px)" : `blur(${CHAR.blur}em)`,
                  transition: reduced
                    ? "none"
                    : `opacity ${DURATION}s ${EASE_NUMERIC} ${charDelay}s,
                       transform ${DURATION}s ${EASE_NUMERIC} ${charDelay}s,
                       filter ${DURATION}s ${EASE_NUMERIC} ${charDelay}s`,
                  willChange:
                    visible && !settled && !reduced
                      ? "transform, filter, opacity"
                      : undefined,
                }}
              >
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 ? SPACE : null}
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                scroll reveal                               */
/* -------------------------------------------------------------------------- */

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  /** Vertical travel in pixels. */
  distance?: number;
  /** Starting blur radius in pixels. */
  blur?: number;
  as?: "div" | "section" | "li" | "span" | "p" | "h1";
  immediate?: boolean;
} & InViewOptions;

/** The section-level counterpart to `Chars`: same curve, one soft rise. */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 14,
  blur = 8,
  as: Tag = "div",
  immediate = false,
  once,
  margin,
  amount,
  style,
  ...props
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ once, margin, amount });
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const visible = reduced || (immediate ? mounted : inView);

  // `as` widens the element type, so the shared ref is narrowed at the call.
  const Element = Tag as React.ElementType;

  return (
    <Element
      className={className}
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${distance}px)`,
        filter: visible ? "blur(0px)" : `blur(${blur}px)`,
        transition: reduced
          ? "none"
          : `opacity ${DURATION}s ${EASE_NUMERIC} ${delay}s,
             transform ${DURATION}s ${EASE_NUMERIC} ${delay}s,
             filter ${DURATION}s ${EASE_NUMERIC} ${delay}s`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Element>
  );
}
