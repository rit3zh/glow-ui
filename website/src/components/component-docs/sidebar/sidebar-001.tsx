"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type * as React from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/components/workspace-ui/lib/utils";

const EFFECTS_KEY = "sidebar-001-effects";
const SIDEBAR_BOTTOM_FADE_MASK =
  "linear-gradient(to top, rgba(0, 0, 0, 1) 22%, rgba(0, 0, 0, 0.88) 44%, transparent 100%)";
const SIDEBAR_TOP_FADE_HEIGHT = "5rem";

// Client-only: the package pulls in mathjs, which has no business in the
// server bundle for a purely decorative overlay.
const GradualBlur = dynamic(() => import("gradualblur/Gradualblur.jsx"), {
  ssr: false,
});

const EffectsContext = createContext<{ enabled: boolean; toggle: () => void }>({
  enabled: true,
  toggle: () => undefined,
});

function EffectsProvider({
  children,
  defaultEnabled = true,
}: {
  children: React.ReactNode;
  defaultEnabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return defaultEnabled;

    try {
      const stored = localStorage.getItem(EFFECTS_KEY);
      return stored !== null ? stored === "true" : defaultEnabled;
    } catch {
      return defaultEnabled;
    }
  });

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;

      try {
        localStorage.setItem(EFFECTS_KEY, String(next));
      } catch {
        // Ignore storage access failures so the sidebar still works.
      }

      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);

  return (
    <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>
  );
}

interface HoverRect {
  top: number;
  height: number;
  left: number;
}

/**
 * Hover state is split in two on purpose.
 *
 * `HoverStateContext` changes on every pointer move. `HoverActionsContext`
 * never changes. Nav rows consume only the actions, so moving the pointer down
 * a hundred-row list re-renders the two components that actually depend on the
 * hovered id — the travelling highlight and the preview card — instead of every
 * row and the five motion nodes each one carries.
 */
const HoverStateContext = createContext<{
  hovered: string | null;
  hoverRect: HoverRect | null;
}>({ hovered: null, hoverRect: null });

const HoverActionsContext = createContext<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  setHovered: (id: string | null, rect?: HoverRect | null) => void;
}>({
  containerRef: { current: null },
  setHovered: () => undefined,
});

function HoverProvider({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHoveredId] = useState<string | null>(null);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);

  const setHovered = useCallback(
    (id: string | null, rect?: HoverRect | null) => {
      setHoveredId(id);
      setHoverRect(rect ?? null);
    },
    [],
  );

  // Never changes, so nothing that consumes it re-renders on a pointer move.
  const actions = useMemo(
    () => ({ containerRef, setHovered }),
    [containerRef, setHovered],
  );

  const state = useMemo(() => ({ hovered, hoverRect }), [hovered, hoverRect]);

  return (
    <HoverActionsContext.Provider value={actions}>
      <HoverStateContext.Provider value={state}>
        {children}
      </HoverStateContext.Provider>
    </HoverActionsContext.Provider>
  );
}

/**
 * The item the pointer is on, and where it sits.
 *
 * Exposed so chrome outside the list — the hover preview — can follow the same
 * pointer without a second set of listeners on every row.
 */
export function useSidebarHover() {
  const state = useContext(HoverStateContext);
  const { containerRef } = useContext(HoverActionsContext);
  return { ...state, containerRef };
}

/** Whether the sidebar's decorative effects are switched on. */
export function useSidebarEffects() {
  return useContext(EffectsContext);
}

function useScrollToActive(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolled = useRef(false);

  useEffect(() => {
    if (!active || scrolled.current || !ref.current) return;

    scrolled.current = true;
    const el = ref.current;
    const schedule =
      typeof requestIdleCallback !== "undefined"
        ? (cb: () => void) => requestIdleCallback(cb)
        : (cb: () => void) => setTimeout(cb, 100);
    const cancel =
      typeof cancelIdleCallback !== "undefined"
        ? cancelIdleCallback
        : clearTimeout;
    const id = schedule(() => {
      const viewport = el.closest("[data-scroll-viewport]");
      if (!(viewport instanceof HTMLElement)) return;

      const vpRect = viewport.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset =
        elRect.top - vpRect.top - vpRect.height / 2 + elRect.height / 2;

      if (Math.abs(offset) > 40) {
        viewport.scrollBy({ top: offset, behavior: "smooth" });
      }
    });

    return () => cancel(id as number);
  }, [active]);

  useEffect(() => {
    if (!active) scrolled.current = false;
  }, [active]);

  return ref;
}

function HoverHighlight() {
  const { hoverRect, hovered } = useContext(HoverStateContext);
  const { enabled } = useContext(EffectsContext);

  return (
    <AnimatePresence initial={false}>
      {enabled && hovered && hoverRect ? (
        <motion.div
          // `y` rather than `top`: a transform is composited, while animating
          // `top` relayouts the panel on every frame of every hover. Height and
          // left are set outright — they are the same for every row, so there
          // is nothing there to animate.
          animate={{ y: hoverRect.top + 2, opacity: 0.5 }}
          className="pointer-events-none absolute top-0 z-0 rounded-md bg-accent/50 will-change-transform"
          exit={{ opacity: 0 }}
          initial={false}
          key="sb001-hover-bg"
          style={{
            left: hoverRect.left,
            right: 0,
            height: hoverRect.height - 4,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      ) : null}
    </AnimatePresence>
  );
}

interface Sidebar001ItemProps {
  href: string;
  label: React.ReactNode;
  isActive: boolean;
  isNew?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

/**
 * One nav row.
 *
 * Everything that reacts to the pointer — the dim, the nudge, the tick that
 * grows, the label colour — is CSS, driven by `:hover` and a `:has()` rule on
 * the list (see `globals.css`). The row therefore does not subscribe to the
 * hovered id at all, and a pointer sweeping the list re-renders nothing here.
 * Only `isActive` can change a row, and that happens once per navigation.
 *
 * React still owns the two things CSS cannot do: measuring the row so the
 * shared highlight can travel to it, and the `layoutId` bar that slides between
 * active rows.
 */
export const Sidebar001Item = memo(function Sidebar001Item({
  href,
  label,
  isActive,
  isNew,
  className,
  onClick,
}: Sidebar001ItemProps) {
  const { setHovered, containerRef } = useContext(HoverActionsContext);
  const itemRef = useScrollToActive(isActive);

  const handleMouseEnter = useCallback(() => {
    const el = itemRef.current;
    const container = containerRef.current;

    if (!el || !container) {
      setHovered(href);
      return;
    }

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setHovered(href, {
      top: elRect.top - containerRect.top,
      height: elRect.height,
      left: 25,
    });
  }, [containerRef, href, itemRef, setHovered]);

  const handleMouseLeave = useCallback(() => setHovered(null), [setHovered]);

  return (
    <div
      className="relative"
      data-active={isActive ? "true" : undefined}
      data-sb-row=""
    >
      {isActive ? (
        <motion.span
          animate={{ width: 23 }}
          className="pointer-events-none absolute top-1/2 left-[4px] z-10 h-[1.8px] -translate-y-1/2 rounded-full bg-accent-pro"
          layoutId="sb001-active-bar"
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
        />
      ) : null}

      <span
        className="pointer-events-none absolute top-1/2 left-0 h-px -translate-y-1/2 bg-foreground/50"
        data-sb-tick=""
      />
      <span className="pointer-events-none absolute top-1/4 left-0 h-px w-[13px] bg-foreground/30" />
      <span className="pointer-events-none absolute top-0 left-0 h-px w-[16px] bg-foreground/30" />
      <span className="pointer-events-none absolute top-3/4 left-0 h-px w-[13px] bg-foreground/30" />

      <div data-sb-shift="" ref={itemRef}>
        <Link
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "relative z-1 ml-2 flex select-none items-center gap-2 rounded-md py-1.5 pl-4 text-[15px]",
            className,
          )}
          href={href}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="relative z-1 truncate" data-sb-label="">
            {label}
          </span>
          {isNew ? (
            <span className="size-1.5 shrink-0 rounded-full bg-accent-pro" />
          ) : null}
        </Link>
      </div>
    </div>
  );
});

function Sidebar001Separator({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-2 px-0 py-3.5 font-medium text-[15px] text-foreground/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Sidebar001Section({
  label,
  children,
  className,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {label ? <Sidebar001Separator>{label}</Sidebar001Separator> : null}
      {children}
    </div>
  );
}

export function Sidebar001Content({
  children,
  className,
  edgeFades = true,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * Draw the top and bottom fades over the scroll area.
   *
   * These tint with `background` and blur what is behind them, which assumes
   * the sidebar sits on an opaque surface of its own. Hosts that already own
   * their edges — a translucent floating panel, say — pass `false` and fade
   * the content themselves; a `backdrop-filter` layered inside another one
   * samples an already-filtered backdrop and smears it.
   */
  edgeFades?: boolean;
}) {
  const { containerRef } = useContext(HoverActionsContext);

  return (
    <div className="relative flex min-h-0 flex-1">
      <div
        className={cn("no-scrollbar flex-1 overflow-y-auto py-4", className)}
        data-scroll-viewport
      >
        <div className="relative px-1 pb-24" data-sb-nav="" ref={containerRef}>
          <HoverHighlight />
          {children}
        </div>
      </div>

      {edgeFades ? (
        <>
          {/* Nav items dissolve as they scroll under the sidebar header instead
              of being clipped at a hard edge. A plain gradient would only fade
              the colour, so this blurs in steps as well. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 isolate"
            style={{ height: SIDEBAR_TOP_FADE_HEIGHT }}
          >
            <GradualBlur
              curve="bezier"
              divCount={5}
              exponential
              height={SIDEBAR_TOP_FADE_HEIGHT}
              position="top"
              strength={0.6}
              target="parent"
              zIndex={0}
            />
            {/* The blur carries no tint of its own — this keeps the sidebar
                background reading as solid at the very top. */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-background/60 to-transparent" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-background via-background/75 to-transparent backdrop-blur-md"
            style={{
              WebkitMaskImage: SIDEBAR_BOTTOM_FADE_MASK,
              maskImage: SIDEBAR_BOTTOM_FADE_MASK,
            }}
          />
        </>
      ) : null}
    </div>
  );
}

interface Sidebar001Props {
  children: React.ReactNode;
  className?: string;
  defaultEffectsEnabled?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function Sidebar001({
  children,
  className,
  defaultEffectsEnabled = true,
  defaultWidth = 240,
  minWidth = 160,
  maxWidth = 400,
}: Sidebar001Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(defaultWidth);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [width],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;

      const next = Math.min(
        maxWidth,
        Math.max(minWidth, startW.current + e.clientX - startX.current),
      );
      setWidth(next);
    },
    [maxWidth, minWidth],
  );

  const stopDragging = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <EffectsProvider defaultEnabled={defaultEffectsEnabled}>
      <HoverProvider containerRef={containerRef}>
        <aside
          className={cn("relative flex h-full shrink-0 flex-col", className)}
          style={{ width }}
        >
          {children}

          <div
            className="group/handle absolute top-0 right-0 z-20 h-full w-1 cursor-col-resize touch-none"
            onLostPointerCapture={stopDragging}
            onPointerCancel={stopDragging}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDragging}
          >
            <div className="absolute top-0 right-0 h-full w-px bg-border/30 transition-colors duration-150 group-hover/handle:bg-border" />
          </div>
        </aside>
      </HoverProvider>
    </EffectsProvider>
  );
}
