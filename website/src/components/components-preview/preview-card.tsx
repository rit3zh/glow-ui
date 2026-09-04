"use client";

import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { aspectOf } from "@/components/components-preview/rows";
import { useHoverItem } from "@/components/landing/hover-group";
import type { GeneratedComponent } from "@/lib/components.generated";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * How far outside the viewport a card starts loading.
 *
 * Roughly one screen of lead time: far enough that a clip is decoded before it
 * scrolls in, near enough that a grid of a hundred never has more than a dozen
 * files in flight. A phone gets a shorter run-up — the rows collapse to one
 * column there, so the same margin in pixels covers several more cards.
 */
const LOAD_MARGIN = "600px";
const LOAD_MARGIN_MOBILE = "250px";

/**
 * How far a card may drift before its clip is torn down again.
 *
 * Wider than the load margin on purpose. If a card mounted and unmounted at
 * the same boundary, resting the scroll exactly on it would thrash the element
 * in and out; the gap between the two is the hysteresis that stops that.
 */
const KEEP_MARGIN = "1400px";
const KEEP_MARGIN_MOBILE = "700px";

/** Clips only run while actually on screen. */
const PLAY_MARGIN = "80px";

const IMAGE_FILE = /\.(png|jpe?g|webp|avif|gif)(\?|$)/i;

/** Recently released, by the page's own `lastModified`. */
const NEW_WINDOW_DAYS = 45;

function isRecent(lastModified: string) {
  const at = Date.parse(lastModified);
  if (Number.isNaN(at)) return false;
  return Date.now() - at < NEW_WINDOW_DAYS * 86_400_000;
}

/**
 * Three observers rather than one: load, keep, play.
 *
 * Loading and playing want different margins — a clip should be fetched well
 * before it appears and stopped the moment it leaves — and collapsing them into
 * a single threshold means either loading too late or decoding frames nobody is
 * looking at.
 *
 * The third exists because loading used to be a one-way door: the loader
 * disconnected on first intersection and the `<video>` it mounted stayed for
 * the life of the page. One scroll to the foot of the components catalogue
 * therefore left 112 video elements alive at once, every one holding a decoder,
 * a texture and its buffered frames. Desktop absorbs that; a phone has a hard
 * cap on concurrent hardware decoders, falls back to software decoding past it,
 * and starts evicting under memory pressure — which is the page grinding, and
 * eventually the tab reloading itself. So a card that drifts far enough away
 * now gives its clip back.
 */
function useVisibility(
  ref: React.RefObject<HTMLElement | null>,
  mobile: boolean,
) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: mobile ? LOAD_MARGIN_MOBILE : LOAD_MARGIN },
    );

    const keeper = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) setShouldLoad(false);
      },
      { rootMargin: mobile ? KEEP_MARGIN_MOBILE : KEEP_MARGIN },
    );

    const player = new IntersectionObserver(
      ([entry]) => setIsVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: PLAY_MARGIN, threshold: 0 },
    );

    loader.observe(element);
    keeper.observe(element);
    player.observe(element);

    return () => {
      loader.disconnect();
      keeper.disconnect();
      player.disconnect();
    };
  }, [ref, mobile]);

  return { shouldLoad, isVisible };
}

/**
 * Target media height for a card standing alone in its row.
 *
 * Matches the `containIntrinsicSize` fallback below, so an off-screen
 * standalone card reserves the same height it will actually render at.
 */
const STANDALONE_HEIGHT = 320;

export const PreviewCard = memo(function PreviewCard({
  component,
  reducedMotion,
  mobile,
  standalone,
}: {
  component: GeneratedComponent;
  reducedMotion: boolean;
  /**
   * Resolved once by the gallery and handed down. Asking each card would mean
   * a `matchMedia` listener per card — 112 of them for one boolean.
   */
  mobile: boolean;
  /**
   * True when this card is the only one in its row — a filtered search, or
   * a catalogue that happens to end on a single card. `md:grow-(--weight)`
   * assumes at least one sibling to divide the row with; alone, it stretches
   * the card to the full row width no matter how narrow its aspect is. A
   * fixed max-width in its place keeps it sized like any other card.
   */
  standalone?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Registers the card with the section's shared highlight, so one plate
  // travels across the grid rather than each card fading its own in and out.
  const hover = useHoverItem();
  const { shouldLoad, isVisible } = useVisibility(ref, mobile);
  const [ready, setReady] = useState(false);

  // The placeholder comes back with the clip, so a card that scrolled away and
  // returned does not flash its last decoded frame before the new one arrives.
  useEffect(() => {
    if (!shouldLoad) setReady(false);
  }, [shouldLoad]);

  const src = component.hoverVideo ?? component.previewVideo;
  const isImage = src ? IMAGE_FILE.test(src) : false;
  const aspect = aspectOf(component);

  // Playback follows visibility, so the browser only ever decodes the handful
  // of clips actually on screen no matter how long the page gets.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isImage) return;

    if (isVisible && !reducedMotion) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isImage, isVisible, reducedMotion]);

  /**
   * Hands the decoder back when the clip is torn down.
   *
   * Dropping the element is not enough on its own: a detached `<video>` that
   * still has a `src` can hold its buffered data and its decoder until the
   * collector gets to it, which on a long scroll is exactly the pressure this
   * is meant to relieve. Clearing the source and calling `load()` releases both
   * immediately.
   */
  useEffect(() => {
    if (!shouldLoad) return;

    // Captured now, while the element is still mounted. React detaches refs
    // during the commit that removes the node, which lands before this
    // effect's cleanup — reading `videoRef.current` in there would find null
    // and release nothing.
    const video = videoRef.current;
    if (!video) return;

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [shouldLoad]);

  return (
    <Link
      className={cn(
        "group relative z-1 flex min-w-0 flex-col gap-3 rounded-[18px] p-2.5",
        // Below `md` the row is a column, where every card — standalone or
        // not — is meant to run full width, so the cap only ever applies
        // from `md` up, same as the grow/basis pair it stands in for.
        standalone ? "md:max-w-(--standalone-max-w)" : "md:grow-(--weight) md:basis-0",
        // The surface is the travelling highlight behind it, so the card holds
        // no background of its own — two plates would double up in transit.
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pro/50",
      )}
      href={component.href}
      ref={ref}
      {...hover}
      style={{
        // `flex-basis: 0` hands the whole row to the grow weights, so width is
        // distributed in exact proportion to each card's aspect and every media
        // box in the row resolves to the same height. Skipped for a standalone
        // card, which has no sibling to divide the row with — `md:max-w`
        // above caps it instead of letting it grow to fill all that space.
        ...(standalone
          ? { "--standalone-max-w": `${aspect * STANDALONE_HEIGHT}px` }
          : { "--weight": aspect }),
        // Offscreen cards skip layout and paint entirely; the intrinsic size
        // keeps the scrollbar honest while they are skipped.
        contentVisibility: "auto",
        containIntrinsicSize: "auto 320px",
      } as CSSProperties}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[14px]",
          "bg-white/[0.02] ring-[0.5px] ring-inset ring-white/8",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          !reducedMotion && "group-hover:-translate-y-0.5",
        )}
        // The box is the clip's own shape, so nothing is letterboxed and
        // nothing is cropped — the component is shown whole.
        style={{ aspectRatio: aspect }}
      >
        {!ready && (
          <div aria-hidden className="absolute inset-0 animate-pulse bg-white/[0.04]" />
        )}

        {shouldLoad && src ? (
          isImage ? (
            <img
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              decoding="async"
              loading="lazy"
              onLoad={() => setReady(true)}
              src={src}
            />
          ) : (
            <video
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain"
              loop
              muted
              onLoadedData={() => setReady(true)}
              playsInline
              // Metadata only. The element does not exist until the card is
              // within `LOAD_MARGIN`, and `play()` streams the rest — fetching
              // every clip whole would mean tens of megabytes for one scroll
              // through the page.
              preload="metadata"
              ref={videoRef}
              src={src}
            />
          )
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 px-1.5 pb-1">
        <span className="truncate text-[15px] text-ink/85 transition-colors duration-200 group-hover:text-accent-pro">
          {component.title}
        </span>

        {isRecent(component.lastModified) ? (
          <span className="flex shrink-0 items-center gap-1.5 text-[13px] text-ink/45">
            <span className="size-1.5 rounded-full bg-accent-pro" />
            New
          </span>
        ) : null}
      </div>
    </Link>
  );
});
