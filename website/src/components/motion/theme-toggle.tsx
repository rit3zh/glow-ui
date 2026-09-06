"use client";
// beui.dev/components/motion/theme-toggle

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useReducedMotion } from "motion/react";
import { flushSync } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { ActionSwapIcon } from "@/components/motion/action-swap";
import { EASE_OUT_CSS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type ThemeVariant =
  | "rectangle"
  | "circle"
  | "circle-blur"
  | "blinds"
  | "blinds-horizontal"
  | "curtain"
  | "dissolve"
  | "fade"
  | "flip"
  | "iris"
  | "slide"
  | "wipe"
  | "zoom";

export const THEME_VARIANTS: readonly ThemeVariant[] = [
  "rectangle",
  "circle",
  "circle-blur",
  "blinds",
  "blinds-horizontal",
  "curtain",
  "dissolve",
  "fade",
  "flip",
  "iris",
  "slide",
  "wipe",
  "zoom",
];

export type RectStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center"
  | "bottom-up";

export const RECT_STARTS: readonly RectStart[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
  "bottom-up",
];

/**
 * Variants whose reveal grows from a point or travels along an axis, so `start`
 * changes the result. Everything else sweeps or covers the whole viewport and
 * ignores it.
 */
export const DIRECTIONAL_VARIANTS: readonly ThemeVariant[] = [
  "rectangle",
  "circle",
  "circle-blur",
  "iris",
  "slide",
  "wipe",
];

export const variantUsesStart = (variant: ThemeVariant): boolean =>
  DIRECTIONAL_VARIANTS.includes(variant);

export interface ThemeToggleProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children" | "onClick"> {
  /** Animation variant. Default: "rectangle". */
  variant?: ThemeVariant;
  /** Origin direction for the reveal. Default: "bottom-up". */
  start?: RectStart;
  /** Override the variant's default duration, in milliseconds. */
  duration?: number;
  iconClassName?: string;
}

const VT_STYLE_ID = "beui-theme-toggle-vt";

// View transitions animate in CSS, not motion springs, so easing here is
// either EASE_OUT_CSS or a keyword. The circle variants keep the Material
// standard curve because their reveal expands symmetrically rather than
// decelerating. Durations differ per variant to match native OS mode switches
// and are handed in as --beui-vt-dur so a caller can override one instance.
const STD = "cubic-bezier(0.4, 0, 0.2, 1)";
const DUR = "var(--beui-vt-dur, 700ms)";

const VT_CSS = `
/* Registered properties. mask-image and clip-path are not animatable as
   whole values, but they re-resolve every frame a registered custom property
   inside them ticks — that indirection is what drives the masked variants.
   If registration fails the var is invalid, the mask drops out, and the new
   theme simply appears in one step. */
@property --beui-vt-slat {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}
@property --beui-vt-dot {
  syntax: "<length>";
  inherits: false;
  initial-value: 20px;
}
@property --beui-vt-curtain {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 60%;
}
@property --beui-vt-wipe {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 100%;
}

/* Every variant paints the new theme as an opaque layer over the old one, so
   the UA's plus-lighter cross-fade has to be switched off across the board —
   otherwise the two themes add together and the reveal edge glows. */
html[data-beui-vt]::view-transition-old(root),
html[data-beui-vt]::view-transition-new(root) {
  mix-blend-mode: normal;
}

/* The old layer holds still under the reveal for every variant except the two
   that actually move or fade it (slide, flip). */
html[data-beui-vt]:not([data-beui-vt="slide"]):not([data-beui-vt="flip"])::view-transition-old(root) {
  animation: none;
}

html[data-beui-vt="rect"]::view-transition-new(root) {
  animation: beui-rect-reveal ${DUR} ease-out;
}
html[data-beui-vt="circle"]::view-transition-new(root) {
  animation: beui-circle-reveal ${DUR} ${STD};
}
html[data-beui-vt="circle-blur"]::view-transition-new(root) {
  animation: beui-circle-blur-reveal ${DUR} ${STD};
}

/* Slats: a masked band widens inside every tile, so the new theme opens across
   the page like a shutter. mask-size fixes the tile rather than letting a
   repeating gradient's last stop define it, which is what keeps the soft edge
   from dragging the tile wider than the slat and leaving a feathered gap that
   never closes; it also means both ends land clean, fully transparent at
   -28% and fully opaque at 100%. Because the band edge is a percentage of the
   tile, --beui-vt-tile alone resizes the slats. */
html[data-beui-vt="blinds"]::view-transition-new(root) {
  mask-image: linear-gradient(
    90deg,
    #000 0 var(--beui-vt-slat),
    transparent calc(var(--beui-vt-slat) + 28%)
  );
  mask-size: var(--beui-vt-tile, 72px) 100%;
  mask-repeat: repeat;
  animation: beui-blinds-reveal ${DUR} ${EASE_OUT_CSS};
}
html[data-beui-vt="blinds-horizontal"]::view-transition-new(root) {
  mask-image: linear-gradient(
    180deg,
    #000 0 var(--beui-vt-slat),
    transparent calc(var(--beui-vt-slat) + 28%)
  );
  mask-size: 100% var(--beui-vt-tile, 72px);
  mask-repeat: repeat;
  animation: beui-blinds-reveal ${DUR} ${EASE_OUT_CSS};
}

/* Curtain parts from the centre line outward. Feathering the two edges by 3%
   keeps the split from aliasing into a hard seam on low-DPI screens. */
html[data-beui-vt="curtain"]::view-transition-new(root) {
  mask-image: linear-gradient(
    90deg,
    transparent calc(50% - var(--beui-vt-curtain) - 3%),
    #000 calc(50% - var(--beui-vt-curtain)),
    #000 calc(50% + var(--beui-vt-curtain)),
    transparent calc(50% + var(--beui-vt-curtain) + 3%)
  );
  animation: beui-curtain-reveal ${DUR} ${EASE_OUT_CSS};
}

/* Dissolve grows a dot inside each 26px cell. The dot has to reach the cell's
   half-diagonal (~18.4px) to close the gaps at the corners, hence the 20px
   end value — stopping at 13px would leave a permanent lattice. */
html[data-beui-vt="dissolve"]::view-transition-new(root) {
  mask-image: radial-gradient(
    circle,
    #000 var(--beui-vt-dot),
    transparent calc(var(--beui-vt-dot) + 5px)
  );
  mask-size: 26px 26px;
  mask-repeat: repeat;
  animation: beui-dissolve-reveal ${DUR} ${STD};
}

html[data-beui-vt="fade"]::view-transition-new(root) {
  animation: beui-fade-reveal ${DUR} ${STD};
}

html[data-beui-vt="iris"]::view-transition-new(root) {
  animation: beui-iris-reveal ${DUR} ${STD};
}

/* Wipe is a single soft-edged band crossing the viewport at the angle the
   start corner implies. Unlike rect (a hard clip) the 18% feather makes it
   read as a sweep of light rather than a shutter. */
html[data-beui-vt="wipe"]::view-transition-new(root) {
  mask-image: linear-gradient(
    var(--beui-vt-angle, 0deg),
    #000 0 var(--beui-vt-wipe),
    transparent calc(var(--beui-vt-wipe) + 18%)
  );
  animation: beui-wipe-reveal ${DUR} ${EASE_OUT_CSS};
}

html[data-beui-vt="zoom"]::view-transition-new(root) {
  transform-origin: center;
  animation: beui-zoom-reveal ${DUR} ${EASE_OUT_CSS};
}

/* Slide pushes: the incoming theme travels its full offset while the outgoing
   one drifts a third of the way opposite, which is what sells depth. */
html[data-beui-vt="slide"]::view-transition-new(root) {
  animation: beui-slide-in ${DUR} ${EASE_OUT_CSS};
}
html[data-beui-vt="slide"]::view-transition-old(root) {
  animation: beui-slide-out ${DUR} ${EASE_OUT_CSS};
}

/* Flip needs the perspective on the pseudo-elements' parent, so it goes on the
   image pair. Where a browser ignores perspective on that box the rotation
   flattens into a horizontal squash — still a legible flip, just not a 3D one. */
html[data-beui-vt="flip"]::view-transition-group(root),
html[data-beui-vt="flip"]::view-transition-image-pair(root) {
  perspective: 1400px;
  transform-style: preserve-3d;
}
html[data-beui-vt="flip"]::view-transition-old(root) {
  backface-visibility: hidden;
  animation: beui-flip-out ${DUR} ${STD};
}
html[data-beui-vt="flip"]::view-transition-new(root) {
  backface-visibility: hidden;
  animation: beui-flip-in ${DUR} ${STD};
}

@keyframes beui-rect-reveal {
  from { clip-path: var(--beui-vt-from, inset(100% 0 0 0)); }
  to   { clip-path: inset(0 0 0 0); }
}
@keyframes beui-circle-reveal {
  from { clip-path: circle(0% at var(--beui-vt-origin, 50% 100%)); }
  to   { clip-path: circle(150% at var(--beui-vt-origin, 50% 100%)); }
}
@keyframes beui-circle-blur-reveal {
  from { clip-path: circle(0% at var(--beui-vt-origin, 50% 100%)); filter: blur(8px); }
  to   { clip-path: circle(150% at var(--beui-vt-origin, 50% 100%)); filter: blur(0px); }
}
@keyframes beui-blinds-reveal {
  from { --beui-vt-slat: -28%; }
  to   { --beui-vt-slat: 100%; }
}
@keyframes beui-curtain-reveal {
  from { --beui-vt-curtain: 0%; }
  to   { --beui-vt-curtain: 60%; }
}
@keyframes beui-dissolve-reveal {
  from { --beui-vt-dot: 0px; }
  to   { --beui-vt-dot: 20px; }
}
@keyframes beui-wipe-reveal {
  from { --beui-vt-wipe: -18%; }
  to   { --beui-vt-wipe: 100%; }
}
@keyframes beui-fade-reveal {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* A rhombus expanding from the origin. Both polygons carry four points in the
   same order so the shape interpolates instead of snapping. */
@keyframes beui-iris-reveal {
  from {
    clip-path: polygon(
      var(--beui-vt-ox, 50%) var(--beui-vt-oy, 100%),
      var(--beui-vt-ox, 50%) var(--beui-vt-oy, 100%),
      var(--beui-vt-ox, 50%) var(--beui-vt-oy, 100%),
      var(--beui-vt-ox, 50%) var(--beui-vt-oy, 100%)
    );
  }
  to {
    clip-path: polygon(
      var(--beui-vt-ox, 50%) calc(var(--beui-vt-oy, 100%) - 160%),
      calc(var(--beui-vt-ox, 50%) + 160%) var(--beui-vt-oy, 100%),
      var(--beui-vt-ox, 50%) calc(var(--beui-vt-oy, 100%) + 160%),
      calc(var(--beui-vt-ox, 50%) - 160%) var(--beui-vt-oy, 100%)
    );
  }
}
@keyframes beui-zoom-reveal {
  from { opacity: 0; transform: scale(1.12); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes beui-slide-in {
  from { transform: translate(var(--beui-vt-dx, 0%), var(--beui-vt-dy, 100%)); }
  to   { transform: translate(0, 0); }
}
@keyframes beui-slide-out {
  from { transform: translate(0, 0); }
  to {
    transform: translate(
      calc(var(--beui-vt-dx, 0%) * -0.35),
      calc(var(--beui-vt-dy, 100%) * -0.35)
    );
  }
}
@keyframes beui-flip-out {
  0%      { transform: rotateY(0deg);   opacity: 1; }
  49.99%  { transform: rotateY(-90deg); opacity: 1; }
  50%     { opacity: 0; }
  100%    { transform: rotateY(-180deg); opacity: 0; }
}
@keyframes beui-flip-in {
  0%      { transform: rotateY(180deg); opacity: 0; }
  49.99%  { transform: rotateY(90deg);  opacity: 0; }
  50%     { opacity: 1; }
  100%    { transform: rotateY(0deg);   opacity: 1; }
}
`;

const RECT_FROM: Record<RectStart, string> = {
  "top-left":    "inset(0 100% 100% 0)",
  "top-right":   "inset(0 0 100% 100%)",
  "bottom-left": "inset(100% 100% 0 0)",
  "bottom-right":"inset(100% 0 0 100%)",
  center:        "inset(50% 50% 50% 50%)",
  "bottom-up":   "inset(100% 0 0 0)",
};

const ORIGIN: Record<RectStart, readonly [x: string, y: string]> = {
  "top-left":    ["0%",   "0%"],
  "top-right":   ["100%", "0%"],
  "bottom-left": ["0%",   "100%"],
  "bottom-right":["100%", "100%"],
  center:        ["50%",  "50%"],
  "bottom-up":   ["50%",  "100%"],
};

// Gradient angle that puts the start corner at the 0% stop: a linear-gradient
// angle names the direction it travels, so it points away from the origin.
const WIPE_ANGLE: Record<RectStart, string> = {
  "top-left":    "135deg",
  "top-right":   "225deg",
  "bottom-left": "45deg",
  "bottom-right":"315deg",
  center:        "0deg",
  "bottom-up":   "0deg",
};

// Offset the incoming layer starts at, i.e. the edge it travels in from.
const SLIDE_OFFSET: Record<RectStart, readonly [dx: string, dy: string]> = {
  "top-left":    ["-100%", "-100%"],
  "top-right":   ["100%",  "-100%"],
  "bottom-left": ["-100%", "100%"],
  "bottom-right":["100%",  "100%"],
  center:        ["0%",    "100%"],
  "bottom-up":   ["0%",    "100%"],
};

/** Each variant's default duration in milliseconds, overridable per instance. */
export const DEFAULT_DURATION: Record<ThemeVariant, number> = {
  rectangle: 400,
  circle: 700,
  "circle-blur": 700,
  blinds: 700,
  "blinds-horizontal": 700,
  curtain: 650,
  dissolve: 750,
  fade: 320,
  flip: 800,
  iris: 700,
  slide: 600,
  wipe: 650,
  zoom: 500,
};

// The data attribute the stylesheet keys off. Only "rectangle" is renamed;
// the rest match their variant name.
const VT_ATTR: Record<ThemeVariant, string> = {
  rectangle: "rect",
  circle: "circle",
  "circle-blur": "circle-blur",
  blinds: "blinds",
  "blinds-horizontal": "blinds-horizontal",
  curtain: "curtain",
  dissolve: "dissolve",
  fade: "fade",
  flip: "flip",
  iris: "iris",
  slide: "slide",
  wipe: "wipe",
  zoom: "zoom",
};

interface ViewTransitionLike {
  finished: Promise<void>;
  ready: Promise<void>;
  skipTransition(): void;
}

type VTDocument = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => ViewTransitionLike;
};

export function useThemeToggle({
  variant = "rectangle",
  start = "bottom-up",
  duration,
}: {
  variant?: ThemeVariant;
  start?: RectStart;
  duration?: number;
} = {}) {
  const { setTheme, resolvedTheme } = useTheme();
  const reduce = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);

  // A transition in flight, plus the theme it is transitioning *to*. Rapid
  // clicks are the whole reason both exist: resolvedTheme only catches up
  // after React commits, so a second click within the same frame would read
  // the pre-click theme and "toggle" back to where it already is.
  const activeRef = useRef<ViewTransitionLike | null>(null);
  const pendingRef = useRef<string | null>(null);
  const runRef = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (document.getElementById(VT_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = VT_STYLE_ID;
    el.textContent = VT_CSS;
    document.head.appendChild(el);
  }, []);

  // A transition still running when the toggle unmounts would leave
  // data-beui-vt latched on <html>, and every later transition would inherit
  // this variant's styling.
  useEffect(
    () => () => {
      activeRef.current?.skipTransition();
      activeRef.current = null;
      delete document.documentElement.dataset.beuiVt;
    },
    [],
  );

  // resolvedTheme is the source of truth once React has caught up; dropping
  // the pending marker then keeps a stale target from surviving an external
  // theme change (system switch, another toggle, next-themes storage sync).
  useEffect(() => {
    if (pendingRef.current === resolvedTheme) pendingRef.current = null;
  }, [resolvedTheme]);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = useCallback(() => {
    const current = pendingRef.current ?? resolvedTheme;
    const next = current === "dark" ? "light" : "dark";
    pendingRef.current = next;

    const doc = document as VTDocument;

    // document.hidden matters here: a backgrounded tab never advances the
    // transition, so it would sit unresolved and the theme would appear stuck
    // until the tab is focused again.
    if (reduce || typeof doc.startViewTransition !== "function" || doc.hidden) {
      setTheme(next);
      return;
    }

    const root = document.documentElement;

    // Spam guard. Skipping jumps the outgoing transition to its end state
    // synchronously, so the next one snapshots a settled page instead of a
    // half-revealed one — which is where the torn frames come from.
    activeRef.current?.skipTransition();

    root.style.setProperty(
      "--beui-vt-dur",
      `${duration ?? DEFAULT_DURATION[variant]}ms`,
    );

    if (variant === "rectangle") {
      root.style.setProperty("--beui-vt-from", RECT_FROM[start]);
    } else if (variant === "wipe") {
      root.style.setProperty("--beui-vt-angle", WIPE_ANGLE[start]);
    } else if (variant === "slide") {
      const [dx, dy] = SLIDE_OFFSET[start];
      root.style.setProperty("--beui-vt-dx", dx);
      root.style.setProperty("--beui-vt-dy", dy);
    } else if (variant === "circle" || variant === "circle-blur" || variant === "iris") {
      const [x, y] = ORIGIN[start];
      root.style.setProperty("--beui-vt-origin", `${x} ${y}`);
      root.style.setProperty("--beui-vt-ox", x);
      root.style.setProperty("--beui-vt-oy", y);
    }
    // blinds, curtain, dissolve, fade, flip and zoom sweep or cover the whole
    // viewport, so there is no origin to place.

    root.dataset.beuiVt = VT_ATTR[variant];

    const run = ++runRef.current;
    const vt = doc.startViewTransition(() => {
      // The browser snapshots the "new" state the moment this callback
      // returns. React batches setTheme out of the current event, so without
      // flushSync the snapshot is taken *before* next-themes has swapped the
      // class and the transition animates one theme into itself.
      flushSync(() => setTheme(next));
    });
    activeRef.current = vt;

    const cleanup = () => {
      // A superseded run must not strip the attribute out from under the
      // transition that replaced it.
      if (run !== runRef.current) return;
      activeRef.current = null;
      delete root.dataset.beuiVt;
    };

    // finished rejects on skipTransition and on an aborted transition; an
    // unhandled rejection here would surface as a console error on every
    // interrupted click.
    vt.finished.then(cleanup, cleanup);
  }, [duration, reduce, resolvedTheme, setTheme, start, variant]);

  return { isDark, mounted, toggle };
}

export function ThemeToggle({
  variant = "rectangle",
  start = "bottom-up",
  duration,
  className,
  iconClassName,
  ...rest
}: ThemeToggleProps) {
  const { isDark, mounted, toggle } = useThemeToggle({ variant, start, duration });

  return (
    <button
      type="button"
      aria-label={mounted && isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={mounted ? isDark : undefined}
      onClick={toggle}
      className={cn("flex items-center justify-center", className)}
      {...rest}
    >
      {mounted ? (
        <ActionSwapIcon
          value={isDark ? "dark" : "light"}
          animation="blur"
          className={iconClassName}
        >
          {isDark ? (
            <Sun className={iconClassName} />
          ) : (
            <Moon className={iconClassName} />
          )}
        </ActionSwapIcon>
      ) : (
        <span className={iconClassName} aria-hidden="true" />
      )}
    </button>
  );
}
