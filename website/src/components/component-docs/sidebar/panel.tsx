"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, RefObject } from "react";
import { createPortal } from "react-dom";

import { useComponentSidebar } from "@/components/component-docs/sidebar/context";
import { ComponentSidebarNavContent } from "@/components/component-docs/sidebar/nav-content";
import { SidebarHoverPreview } from "@/components/component-docs/sidebar/hover-preview";
import { Sidebar001 } from "@/components/component-docs/sidebar/sidebar-001";
import { cn } from "@/components/workspace-ui/lib/utils";

const SIDEBAR_GAP = 8;

/**
 * The panel dissolves into the page at its top edge and its right edge.
 *
 * Both are eased rather than linear. A two-stop gradient changes slope
 * abruptly where it starts and where it lands, and the eye reads those two
 * kinks as edges even though nothing is actually clipped — which is the whole
 * problem a fade is meant to solve. These ramp in and out of the fade instead,
 * so opacity reaches 0 at 100% with its slope already flat and there is no
 * seam at either end.
 *
 * The right edge holds full strength across the first two thirds, so the nav
 * reads as a solid column rather than as a wash that fades under the labels,
 * then spends the remaining third dissolving.
 */
const TOP_DISSOLVE_MASK =
  "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.12) 5px, rgba(0,0,0,0.28) 9px, rgba(0,0,0,0.5) 14px, rgba(0,0,0,0.72) 20px, rgba(0,0,0,0.88) 26px, rgba(0,0,0,0.97) 32px, black 38px, black 100%)";

const RIGHT_MASK =
  "linear-gradient(to right, black 0%, black 62%, rgba(0,0,0,0.96) 68%, rgba(0,0,0,0.88) 73%, rgba(0,0,0,0.75) 78%, rgba(0,0,0,0.58) 83%, rgba(0,0,0,0.4) 88%, rgba(0,0,0,0.23) 92%, rgba(0,0,0,0.1) 96%, rgba(0,0,0,0.03) 98.5%, transparent 100%)";

/**
 * The panel's own surface: frosted glass over whatever it covers.
 *
 * `backdrop-filter` clamps its sampling at the filtered element's bounds and
 * repeats the outermost row of pixels outwards, so stacking filtered layers
 * inside a masked region compounds those repeated rows into vertical streaks.
 * Every filtered layer in the panel is therefore a full-bleed sibling — none
 * of them nests inside another, and none is boxed into a sub-region whose own
 * edges would clamp. The nav's fades are switched off for the same reason, and
 * `DocsEdgeBlur` already stands its blur down while the panel is open.
 */
const PANEL_SURFACE_STYLE: CSSProperties = {
  WebkitMaskImage: `${TOP_DISSOLVE_MASK}, ${RIGHT_MASK}`,
  maskImage: `${TOP_DISSOLVE_MASK}, ${RIGHT_MASK}`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

/**
 * The progressive blur along the panel's top edge.
 *
 * Sitting above the nav, it takes the items scrolling up with it as well as
 * the page behind, so they soften into the edge instead of sliding out from
 * under a hard line.
 *
 * Tuning — these are the three dials worth touching:
 * - `height`    how far down the ramp reaches. Taller reads softer and lazier.
 * - `strength`  scales the whole ramp. The blur at the very top edge works out
 *               to `strength` rem, so `1.5` peaks at 24px. Turn this one first.
 * - `divCount`  how many layers the ramp is built from. More is smoother and
 *               costs one more composited layer each; below 4 it starts to band.
 *
 * Keep the peak clear of `SURFACE_BLUR` below — a ramp stacked on an already
 * heavily blurred backdrop has very little left to add, and reads as flat.
 */
const TOP_BLUR = { height: "3rem", strength: 1.5, divCount: 6 } as const;

/**
 * The flat blur across the body of the panel, under the tint.
 *
 * `md` is 12px against the ramp's 24px peak — enough that the page reads as
 * genuinely soft behind the whole panel rather than only under its top edge,
 * while still leaving the ramp somewhere to climb to.
 */
const SURFACE_BLUR = "backdrop-blur-md";

/**
 * Nav items dissolve at both ends of the scroll area instead of being clipped.
 *
 * With the surface translucent, the fades that used to do this cannot be
 * painted — a gradient to `background` would show up as an opaque block
 * floating over the page. Masking the content itself fades it to nothing at
 * all, which is what the tint was imitating.
 *
 * The top fade runs nearly the full height of `TOP_BLUR` on purpose. Held any
 * shorter, items reach full opacity while the ramp is still at its heaviest,
 * and blurred text at full strength reads as smeared rather than as receding —
 * so opacity and blur are spent together over the same stretch.
 */
const CONTENT_VERTICAL_MASK =
  "linear-gradient(to bottom, transparent 0px, rgba(0,0,0,0.06) 14px, rgba(0,0,0,0.2) 26px, rgba(0,0,0,0.42) 38px, rgba(0,0,0,0.66) 50px, rgba(0,0,0,0.86) 62px, rgba(0,0,0,0.97) 72px, black 80px, black calc(100% - 72px), rgba(0,0,0,0.85) calc(100% - 44px), rgba(0,0,0,0.3) calc(100% - 16px), transparent 100%)";

const CONTENT_MASK_STYLE: CSSProperties = {
  WebkitMaskImage: `${CONTENT_VERTICAL_MASK}, ${RIGHT_MASK}`,
  maskImage: `${CONTENT_VERTICAL_MASK}, ${RIGHT_MASK}`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

/**
 * `gradualblur`'s "bezier" curve — smoothstep.
 *
 * The `3` is load-bearing: at `2` the curve flatlines at the top of its range,
 * and anything lower drives it negative, which sends the last and heaviest
 * layer to `2 ** -4` and quietly flattens the whole ramp.
 */
const smoothstep = (progress: number) =>
  progress * progress * (3 - 2 * progress);

/**
 * The progressive blur along the panel's top edge.
 *
 * This is `gradualblur`'s layer maths inlined rather than imported, for one
 * reason: the right-edge dissolve has to composite onto the same elements that
 * carry `backdrop-filter`. Hung on an ancestor instead — the container the
 * package renders around its layers — a `mask-image` makes that ancestor a
 * backdrop root, and a `backdrop-filter` beneath one samples an empty backdrop
 * and does nothing at all. `isolation`, `filter` and `opacity` below 1 all do
 * the same, so the layers hang directly off the panel with nothing in between.
 *
 * They also span the whole panel rather than sitting in a strip the height of
 * the ramp, which is the second reason not to use the package here. A
 * `backdrop-filter` samples only within its own element and repeats the
 * outermost row of pixels beyond it, so a layer boxed into a short strip
 * smears that row down its lower edge — six stacked layers turn it to mush.
 * Full-bleed layers put the only clamp at the panel's own bounds, and the band
 * masks below limit what is *shown* instead of what is sampled.
 *
 * The progression itself is the package's: same bezier curve, same exponential
 * ramp, same overlapping bands, so `TOP_BLUR` tunes it as the package would.
 */
function TopBlurRamp() {
  const { height, strength, divCount } = TOP_BLUR;
  const feather = `calc(${height} / ${divCount})`;

  return (
    <>
      {Array.from({ length: divCount }, (_, index) => {
        const layer = index + 1;
        const blur =
          2 ** (smoothstep(layer / divCount) * 2) * 0.0625 * strength;

        // Later layers blur harder and stop shorter, so the radii accumulate
        // towards the top edge. Each holds full strength down to one feather
        // short of its reach, then reaches zero, so neighbours overlap into a
        // continuous ramp rather than stepping.
        const reach = `calc(${height} * ${(divCount - layer + 1) / divCount})`;
        const band = `linear-gradient(to bottom, black 0px, black calc(${reach} - ${feather}), transparent ${reach})`;

        // The blur takes both of the panel's dissolves too. Fading only the
        // tint leaves the filter itself running at full strength up to the
        // element bounds, where it stops dead — a hard line along the very
        // edge the dissolve exists to soften.
        const mask = `${band}, ${TOP_DISSOLVE_MASK}, ${RIGHT_MASK}`;

        return (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            key={layer}
            style={{
              backdropFilter: `blur(${blur.toFixed(3)}rem)`,
              WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
              WebkitMaskImage: mask,
              maskImage: mask,
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect",
            }}
          />
        );
      })}
    </>
  );
}

/**
 * Hang the panel off the trigger rather than off the viewport, so it starts
 * under the row it was opened from and runs to the bottom of the window.
 */
function useSidebarLayout(
  anchorRef: RefObject<HTMLDivElement | null>,
  isOpen: boolean,
) {
  const [layout, setLayout] = useState<{ top: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!(anchor && isOpen)) {
      setLayout(null);
      return;
    }

    const updateLayout = () => {
      const rect = anchor.getBoundingClientRect();
      const top = rect.bottom + SIDEBAR_GAP;
      setLayout({ top, height: Math.max(0, window.innerHeight - top) });
    };

    updateLayout();

    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, true);

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
    };
  }, [anchorRef, isOpen]);

  return layout;
}

function useCloseOnClickOutside(
  isOpen: boolean,
  close: () => void,
  panelRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;

      close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [anchorRef, close, isOpen, panelRef]);
}

export function FloatingSidebarPanel() {
  const { isOpen, close, anchorRef, catalogue, entries } = useComponentSidebar();
  const panelRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  /**
   * Whether the panel has finished sliding in.
   *
   * The surface is three stacked `backdrop-filter` layers plus a six-layer
   * blur ramp. Translating an element that carries those forces the compositor
   * to re-sample and re-blur everything behind it on every frame, which is what
   * made the entrance stutter. So the slide runs against a plain opaque
   * surface, and the blurs are mounted once it lands — by which point nothing
   * is moving and they cost nothing per frame.
   */
  const [settled, setSettled] = useState(false);
  const layout = useSidebarLayout(anchorRef, isOpen);

  useEffect(() => {
    if (!isOpen) setSettled(false);
  }, [isOpen]);

  useCloseOnClickOutside(isOpen, close, panelRef, anchorRef);

  const handleNavigate = useCallback(() => close(), [close]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {isOpen && layout ? (
        <motion.aside
          animate={{ x: 0 }}
          aria-label={`${catalogue.label} navigation`}
          // `ux` is the docs palette scope. The panel is portaled to the body,
          // which lands it outside the section layout that would otherwise
          // carry it, so it has to opt back in — without this the tokens fall
          // back to the root theme and the panel greys off against the page.
          className="ux fixed left-0 z-50 w-[min(20rem,88vw)] sm:w-80"
          exit={{ x: "-100%" }}
          initial={{ x: "-100%" }}
          onAnimationComplete={() => setSettled(true)}
          ref={panelRef}
          style={{
            top: layout.top,
            height: layout.height,
            willChange: "transform",
          }}
          transition={{ type: "spring", duration: 0.38, bounce: 0 }}
        >
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 backdrop-saturate-150",
              // Opaque while moving, translucent once still: the panel reads
              // the same either way, but only one of them costs a re-blur per
              // frame.
              settled ? `bg-background/75 ${SURFACE_BLUR}` : "bg-background",
            )}
            style={PANEL_SURFACE_STYLE}
          />

          <div
            className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden"
            style={CONTENT_MASK_STYLE}
          >
            <Sidebar001
              className="bg-transparent! h-full min-h-0 [&>div:last-child]:hidden"
              defaultWidth={320}
              maxWidth={320}
              minWidth={280}
            >
              <ComponentSidebarNavContent
                // Clears `TOP_BLUR.height`, so the first section label starts
                // below the ramp rather than opening inside it. Anything
                // shorter and the panel's own heading is what the blur lands
                // on, which reads as a smudge rather than as a fade.
                contentClassName="pt-12!"
                edgeFades={false}
                entries={entries}
                onNavigate={handleNavigate}
              />

              {/* Inside `Sidebar001` for its hover context, but portaled out —
                  the panel masks and clips its own right edge. */}
              <SidebarHoverPreview />
            </Sidebar001>
          </div>

          {settled ? <TopBlurRamp /> : null}
        </motion.aside>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
