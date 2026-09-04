"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "#/lib/utils";
import { SPRING } from "./motion";

/**
 * One highlight shared by a set of hover targets.
 *
 * Per-item `hover:bg-*` transitions cross-fade — the old item is still dimming
 * out while the new one fades in, which reads as lag rather than as movement.
 * Here a single element is measured onto whichever target the pointer is over
 * and springs between them, so the highlight travels instead of blinking.
 *
 * It is positioned against the group rather than nested inside each item: an
 * item that clips its overflow (the FAQ rows do) would otherwise cut the
 * highlight in half while it is in transit.
 */

type Rect = { x: number; y: number; width: number; height: number };

type HoverGroupContextValue = {
  enter: (element: HTMLElement) => void;
};

const HoverGroupContext = React.createContext<HoverGroupContextValue | null>(
  null,
);

type HoverGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Shape and fill of the travelling highlight — radius must match the items. */
  highlightClassName?: string;
};

export function HoverGroup({
  children,
  className,
  highlightClassName,
  ...props
}: HoverGroupProps) {
  const groupRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLElement | null>(null);

  const [rect, setRect] = React.useState<Rect | null>(null);
  const [shown, setShown] = React.useState(false);
  /**
   * Set when the highlight is arriving from hidden. Without it, re-entering
   * the group at a distant item would drag a visible ghost across everything
   * in between, from wherever the highlight was last parked.
   */
  const [teleport, setTeleport] = React.useState(true);

  const measure = React.useCallback(() => {
    const group = groupRef.current;
    const active = activeRef.current;
    if (!(group && active)) return;

    const groupBox = group.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();

    setRect({
      x: activeBox.left - groupBox.left,
      y: activeBox.top - groupBox.top,
      width: activeBox.width,
      height: activeBox.height,
    });
  }, []);

  const enter = React.useCallback(
    (element: HTMLElement) => {
      setTeleport(activeRef.current === null);
      activeRef.current = element;
      measure();
      setShown(true);
    },
    [measure],
  );

  const leave = React.useCallback(() => {
    activeRef.current = null;
    setShown(false);
  }, []);

  // Anything that reflows the group — an accordion row opening, the window
  // resizing — moves the target out from under the highlight.
  React.useEffect(() => {
    const group = groupRef.current;
    if (!group || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(group);
    return () => observer.disconnect();
  }, [measure]);

  const value = React.useMemo(() => ({ enter }), [enter]);

  return (
    <HoverGroupContext.Provider value={value}>
      <div
        className={cn("relative", className)}
        // Scoped so that tabbing *between* items keeps the highlight alive and
        // lets it travel, the same as moving the pointer between them.
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) leave();
        }}
        onPointerLeave={leave}
        ref={groupRef}
        {...props}
      >
        {rect ? (
          <motion.span
            animate={{
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              opacity: shown ? 1 : 0,
            }}
            aria-hidden
            className={cn(
              // Above the items: the cards and FAQ rows are opaque, so a
              // highlight painted behind them would never show through.
              "pointer-events-none absolute top-0 left-0 z-10",
              highlightClassName,
            )}
            initial={false}
            transition={{
              opacity: { duration: 0.16, ease: "linear" },
              default: teleport ? { duration: 0 } : SPRING,
            }}
          />
        ) : null}

        {children}
      </div>
    </HoverGroupContext.Provider>
  );
}

/**
 * Props to spread onto a hover target. Returns handlers only — the element is
 * read off the event, so items keep whatever ref they already need.
 */
export function useHoverItem() {
  const context = React.useContext(HoverGroupContext);

  return React.useMemo(
    () => ({
      onFocus: (event: React.FocusEvent<HTMLElement>) =>
        context?.enter(event.currentTarget),
      onPointerEnter: (event: React.PointerEvent<HTMLElement>) =>
        context?.enter(event.currentTarget),
    }),
    [context],
  );
}
