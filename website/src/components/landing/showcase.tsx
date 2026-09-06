"use client";

import * as React from "react";

import { getLandingAssetByFile } from "@/lib/landing-assets";
import { cn } from "#/lib/utils";
import { HoverGroup, useHoverItem } from "./hover-group";
import { Chars, Reveal } from "./primitives";

type Piece = {
  name: string;
  /** File name under the R2 bucket, without the extension. */
  clip: string;
  /**
   * Display aspect (width ÷ height). Two jobs: it is the media box's own
   * aspect-ratio, and it is the card's flex-grow weight — so every card in a
   * row lands on exactly the same media height (see `Row`).
   *
   * Where it differs from the source clip's aspect the difference is a
   * deliberate crop; the screen recordings carry a lot of dead black above or
   * below the component, and `object-cover` trims it.
   */
  aspect: number;
  /** Tunes which part of an over-tall clip survives that crop. */
  position?: string;
};

/**
 * The bucket URL for a clip, by its file name stem.
 *
 * Resolved through the generated catalogue rather than concatenated onto the
 * origin, because `bucketURL` carries the `?v=<hash>` of the file's contents.
 * The objects are served `Cache-Control: immutable`, so a URL without that
 * version would sit in visitors' browsers for a year with no way to replace a
 * re-recorded clip. A stem with no matching asset yields no source at all,
 * which leaves the poster box rather than a broken request.
 */
function clipSrc(stem: string) {
  return getLandingAssetByFile(stem)?.bucketURL;
}

/**
 * Rows are laid out justified-gallery style rather than on a fixed column
 * grid: within a row each card's width is proportional to its aspect, which
 * makes every media box in the row the same height with no letterboxing and no
 * stretched frames. Row shape carries the rhythm instead — a pair of wide
 * banners, then a tall row, then a run of squares.
 */
const ROWS: Piece[][] = [
  [
    // 858×320 and 862×308 — both near 2.7, so the row reads as a slim banner.
    {
      name: "Border Beam",
      clip: "border-beam-landing-page-asset",
      aspect: 2.68,
    },
    {
      name: "Gooey Search Tabs",
      clip: "gooey-search-tabs-landing-asset",
      aspect: 2.8,
    },
  ],
  [
    // 826×618, centred text — the 4% side crop costs nothing.
    { name: "Dia Text", clip: "dia-text-landing-page-asset", aspect: 1.4 },
    // 816×1340, but the menu lives in the top ~56%; anchor to the top edge.
    {
      name: "Fan Menu",
      clip: "fan-menu-landing-page-asset",
      aspect: 0.95,
      position: "center top",
    },
    // 838×1472 phone capture; the sheet sits at the bottom, so hold that edge.
    {
      name: "Tray",
      clip: "tray-landing-page-asset",
      aspect: 0.78,
      position: "center 92%",
    },
  ],
  [
    {
      name: "Bouncy Accordion",
      clip: "bouncy-accordion-landing-page-asset",
      aspect: 0.92,
    },
    { name: "Nebula Orb", clip: "nebula-orb-landing-page-asset", aspect: 1 },
    { name: "Liquid Metal", clip: "liquid-metal-landing-asset", aspect: 0.97 },
    {
      name: "Gooey Popover",
      clip: "gooey-popover-landing-asset",
      aspect: 0.95,
    },
  ],
];

export function Showcase() {
  // Stagger runs across the whole grid, not per row, so the reveal reads as
  // one sweep down the page.
  let index = 0;

  return (
    <section
      className="mx-auto w-full max-w-[68rem] px-5 pt-40 md:px-8 md:pt-56"
      id="showcase"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-ink leading-[1.05] tracking-[-0.025em]">
          <Chars>A few pieces in motion</Chars>
          <span className="text-brand">.</span>
        </h2>

        <Reveal
          className="mt-5 max-w-[44ch] text-[0.9rem] text-ink-faint leading-[1.75]"
          delay={0.08}
        >
          Recorded on a device, not rebuilt for the web. Every one of these runs
          its animation on the UI thread.
        </Reveal>
      </div>

      {/* One outline travels between the cards rather than nine of them
          lighting up and fading out against each other. */}
      <HoverGroup
        className="mt-16 flex flex-col gap-3.5"
        highlightClassName="rounded-[1.25rem] bg-white/[0.03] ring-1 ring-white/12 ring-inset"
      >
        {ROWS.map((row) => (
          <Row key={row[0].clip}>
            {row.map((piece) => (
              <Card
                delay={Math.min(index++, 6) * 0.05}
                key={piece.clip}
                piece={piece}
              />
            ))}
          </Row>
        ))}
      </HoverGroup>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                     row                                    */
/* -------------------------------------------------------------------------- */

/** Stacks on small screens; justifies into equal-height cells from `md` up. */
function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3.5 md:flex-row">{children}</div>;
}

/* -------------------------------------------------------------------------- */
/*                                    card                                    */
/* -------------------------------------------------------------------------- */

function Card({ piece, delay }: { piece: Piece; delay: number }) {
  const hover = useHoverItem();

  return (
    <Reveal
      // `flex-basis: 0` makes the whole row free space, so grow weights
      // distribute width in exact proportion to each card's aspect. Held to
      // `md` and up — below that the row is a column, where a zero basis would
      // size the card's *height*.
      className="min-w-0 md:grow-(--weight) md:basis-0"
      delay={delay}
      style={{ "--weight": piece.aspect } as React.CSSProperties}
    >
      <div
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[1.25rem]",
          // The clips are near-black to the pixel, so a recessed panel hides
          // the seam between video and card entirely.
          "bg-surface-sunken  ring-inset",
        )}
        {...hover}
      >
        <Clip piece={piece} />

        <p className="px-5 pt-3.5 pb-4 text-[0.8rem] text-ink-faint transition-colors duration-300 group-hover:text-ink-muted">
          {piece.name}
        </p>
      </div>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    clip                                    */
/* -------------------------------------------------------------------------- */

/**
 * Every clip fetches with the page rather than when it scrolls into view.
 * Waiting for the intersection meant the card you had just scrolled to was
 * still a black box while its first bytes were in flight; the nine files are
 * small, immutable and edge-cached, so paying for them up front is what makes
 * the grid feel already-there.
 *
 * The observer stays, but only to run the loop: a video that is off screen is
 * paused, so nine decoders are never live at once. `muted` is set on the
 * element before `play()` — autoplay is refused without it, and the React
 * attribute alone does not survive hydration reliably.
 */
function Clip({ piece }: { piece: Piece }) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.muted = true;

    if (typeof IntersectionObserver === "undefined") {
      el.play().catch(() => {});
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      aria-label={`${piece.name} preview`}
      className="w-full object-cover"
      loop
      muted
      playsInline
      preload="auto"
      ref={ref}
      src={clipSrc(piece.clip)}
      style={{ aspectRatio: piece.aspect, objectPosition: piece.position }}
    />
  );
}
