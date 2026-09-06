"use client";

import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  useSidebarEffects,
  useSidebarHover,
} from "@/components/component-docs/sidebar/sidebar-001";
import { getComponent } from "@/lib/components.generated";

/** Gap between the panel's right edge and the card. */
const GAP = 14;

/** The card grows to whichever of these the clip's own aspect reaches first. */
const MAX_HEIGHT = 220;
const MAX_WIDTH = 360;

/** Shape held until the clip reports its own, so the first frame has a box. */
const DEFAULT_ASPECT = 16 / 10;

/** Keeps the card clear of the viewport edges when an item is near one. */
const VIEWPORT_MARGIN = 12;

/**
 * How long the pointer has to rest on an item before its clip is shown.
 *
 * Sweeping down a list of a hundred rows crosses every one of them; without
 * this each would mount a clip for a few milliseconds, and the card would
 * strobe. Long enough to mean intent, short enough not to feel gated.
 */
const INTENT_DELAY = 90;

/**
 * How many clips stay mounted behind the visible one.
 *
 * Every resident is a live `<video>` holding a decoder and a buffer. Three
 * covers the pattern this exists for — glancing back at the last couple of rows
 * — without keeping a wall of decoders alive while the pointer wanders.
 */
const CACHE_SIZE = 3;

/** Position and size settle together, so the card reads as one object moving. */
const CARD_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

type MediaKind = "video" | "image";

interface Preview {
  slug: string;
  title: string;
  src: string;
  kind: MediaKind;
}

const IMAGE_FILE = /\.(png|jpe?g|webp|avif|gif)(\?|$)/i;

/** `/components/button` -> `button`. Anything else is not a component row. */
function slugFromHref(href: string | null) {
  if (!href) return null;
  return /^\/components\/([^/?#]+)$/.exec(href)?.[1] ?? null;
}

/**
 * Resolved once per slug and held for the session.
 *
 * `getComponent` is a map lookup, but the object built around it is what the
 * render tree diffs against — memoising it here keeps a re-hover of an already
 * seen component from producing a new object and remounting its media.
 */
const previewCache = new Map<string, Preview | null>();

function resolvePreview(slug: string): Preview | null {
  const cached = previewCache.get(slug);
  if (cached !== undefined) return cached;

  const component = getComponent(slug);
  // The hover clip is the short loop meant for exactly this; the page's own
  // preview stands in for components that have not had one recorded yet.
  const src = component?.hoverVideo ?? component?.previewVideo ?? null;

  const preview =
    component && src
      ? {
          slug,
          title: component.title,
          src,
          // Not every asset is a video — some components are captured as a
          // still, and an <img> in a <video> tag renders nothing at all.
          kind: IMAGE_FILE.test(src) ? ("image" as const) : ("video" as const),
        }
      : null;

  previewCache.set(slug, preview);
  return preview;
}

/**
 * Natural aspect per source, learned on first load.
 *
 * Kept module-level so a second hover sizes the card correctly on the first
 * frame instead of resizing once the media reports in.
 */
const aspectCache = new Map<string, number>();

function sizeFor(aspect: number) {
  const height = MAX_HEIGHT;
  const width = height * aspect;

  return width > MAX_WIDTH
    ? { width: MAX_WIDTH, height: MAX_WIDTH / aspect }
    : { width, height };
}

/**
 * A floating preview of whichever component the sidebar pointer is resting on.
 *
 * Mounted beside the panel rather than inside it: the panel masks its own right
 * edge and clips its content, both of which would eat the card.
 */
export function SidebarHoverPreview() {
  const { hovered, hoverRect, containerRef } = useSidebarHover();
  const { enabled } = useSidebarEffects();

  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  /**
   * The card needs both a hovering pointer and room beside the panel to land
   * in, so it is off on touch and on narrow viewports rather than being
   * squeezed or triggered by a tap.
   */
  const [affordable, setAffordable] = useState(false);

  /** The slug actually being shown — `hovered` after the intent delay. */
  const [settled, setSettled] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(
    null,
  );

  /**
   * Recently hovered slugs, most recent last.
   *
   * Everything in here stays mounted with its buffered media intact, so moving
   * back up a list re-shows a clip instantly instead of refetching it. Bounded
   * because a hundred live `<video>` elements is not a cache, it is a leak.
   */
  const [resident, setResident] = useState<Preview[]>([]);

  /** Bumped when a clip reports its dimensions, to re-read the aspect cache. */
  const [measured, setMeasured] = useState(0);

  const hoveredSlug = slugFromHref(hovered);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia(
      "(pointer: fine) and (min-width: 1024px)",
    );

    const update = () => {
      setReducedMotion(motionQuery.matches);
      setAffordable(pointerQuery.matches);
    };

    update();
    motionQuery.addEventListener("change", update);
    pointerQuery.addEventListener("change", update);

    return () => {
      motionQuery.removeEventListener("change", update);
      pointerQuery.removeEventListener("change", update);
    };
  }, []);

  // Leaving the list clears immediately; arriving waits out the intent delay,
  // so a pointer crossing the whole list settles once rather than per row.
  useEffect(() => {
    if (!hoveredSlug) {
      setSettled(null);
      return;
    }

    const timer = window.setTimeout(() => setSettled(hoveredSlug), INTENT_DELAY);
    return () => window.clearTimeout(timer);
  }, [hoveredSlug]);

  const preview = useMemo(
    () => (settled ? resolvePreview(settled) : null),
    [settled],
  );

  const onMeasured = useCallback((src: string, aspect: number) => {
    if (aspectCache.get(src) === aspect) return;
    aspectCache.set(src, aspect);
    setMeasured((count) => count + 1);
  }, []);

  // Position is read when the shown item changes rather than on every pointer
  // move: `hoverRect` is already the settled item's box by then.
  useEffect(() => {
    if (!preview || !hoverRect) return;

    const container = containerRef.current;
    if (!container) return;

    const panel = container.closest("aside") ?? container;
    const panelRect = panel.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setAnchor({
      left: panelRect.right + GAP,
      top: containerRect.top + hoverRect.top + hoverRect.height / 2,
    });
  }, [containerRef, hoverRect, preview]);

  // Promote the current preview to the front of the residency list.
  useEffect(() => {
    if (!preview) return;

    setResident((current) => {
      const without = current.filter((item) => item.slug !== preview.slug);
      return [...without, preview].slice(-CACHE_SIZE);
    });
  }, [preview]);

  const size = useMemo(
    () =>
      sizeFor(
        preview ? (aspectCache.get(preview.src) ?? DEFAULT_ASPECT) : DEFAULT_ASPECT,
      ),
    // `preview` changes per component; `measured` is what re-runs this once a
    // clip has reported its real aspect, so the card springs to the right
    // shape instead of holding the placeholder box.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preview, measured],
  );

  if (!mounted || !enabled || !affordable) return null;

  // Centre the card on the row, then keep it inside the viewport. Resolved to
  // the card's own top edge because the transform replaces the -50% shift a
  // `top`-positioned element would have used.
  const top = anchor
    ? Math.min(
        Math.max(anchor.top - size.height / 2, VIEWPORT_MARGIN),
        window.innerHeight - size.height - VIEWPORT_MARGIN,
      )
    : 0;

  return createPortal(
    <AnimatePresence>
      {preview && anchor ? (
        <motion.div
          // Position travels as a transform, never as `left`/`top`: those are
          // layout properties, and animating them at 60fps re-lays-out the page
          // on every frame the pointer is moving. `x`/`y` stay on the
          // compositor. Size still animates — the card is a portaled leaf, so
          // that relayout is confined to itself and its one child.
          animate={{
            opacity: 1,
            scale: 1,
            x: anchor.left,
            y: top,
            width: size.width,
            height: size.height,
          }}
          aria-hidden
          // No border and no surface of its own: the media fills the card
          // exactly, so a frame would only ever show as a grey seam around it.
          className="ux pointer-events-none fixed top-0 left-0 z-40 origin-left overflow-hidden rounded-xl shadow-2xl shadow-black/40 will-change-transform"
          exit={{ opacity: 0, scale: 0.96 }}
          initial={{
            opacity: 0,
            scale: 0.96,
            x: anchor.left,
            y: top,
            width: size.width,
            height: size.height,
          }}
          key="sidebar-hover-preview"
          transition={reducedMotion ? { duration: 0 } : CARD_SPRING}
        >
          {/* Every resident clip stays in the tree; only the settled one is
              visible. Switching back to one already seen is then a crossfade
              rather than a fresh network request and decode. */}
          {resident.map((item) => (
            <PreviewMedia
              active={item.slug === preview.slug}
              key={item.slug}
              onMeasured={onMeasured}
              preview={item}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/**
 * Memoised: the card re-renders whenever the pointer moves to a new row, but a
 * resident clip only cares whether it just became the active one. Without this
 * every move re-rendered all three `<video>` elements.
 */
const PreviewMedia = memo(function PreviewMedia({
  preview,
  active,
  reducedMotion,
  onMeasured,
}: {
  preview: Preview;
  active: boolean;
  reducedMotion: boolean;
  onMeasured: (src: string, aspect: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // Only the visible clip runs. A paused resident keeps its buffer, so
  // resuming it is instant, but costs nothing while it is hidden.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (active && !reducedMotion) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active, reducedMotion]);

  // The card is sized to this aspect, so `cover` crops nothing — it is here to
  // absorb the sub-pixel rounding that would otherwise show as a hairline.
  const className = "absolute inset-0 h-full w-full object-cover";

  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0 }}
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      {preview.kind === "image" ? (
        <img
          alt=""
          className={className}
          decoding="async"
          onLoad={(event) => {
            const image = event.currentTarget;
            if (image.naturalHeight > 0) {
              onMeasured(preview.src, image.naturalWidth / image.naturalHeight);
            }
          }}
          src={preview.src}
        />
      ) : (
        <video
          autoPlay={active && !reducedMotion}
          className={className}
          loop
          muted
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            if (video.videoHeight > 0) {
              onMeasured(preview.src, video.videoWidth / video.videoHeight);
            }
          }}
          playsInline
          preload="metadata"
          ref={ref}
          src={preview.src}
        />
      )}
    </motion.div>
  );
});
