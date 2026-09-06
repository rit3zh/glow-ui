"use client";

import * as React from "react";
import { cn } from "#/lib/utils";
import { DURATION, EASE_NUMERIC } from "./motion";
import { Chars, Reveal } from "./primitives";
import { SwapText } from "./swap-text";

type Testimonial = {
  name: string;
  /** X handle — also the key the avatar proxy resolves. */
  handle: string;
  quote: string;
  date: string;
  verified?: boolean;
};

/**
 * All real posts. Avatars are resolved from the handle at request time, so no
 * image URLs are stored here — they rot as soon as someone changes their photo.
 *
 * Order feeds a masonry layout: short quotes first so the columns balance
 * around the long one.
 */
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Expo",
    handle: "expo",
    quote: "These are pretty 🤩",
    date: "Feb 6, 2026",
    verified: true,
  },
  {
    name: "Fernando Herrera",
    handle: "Fernando_Her85",
    quote: "I have to try this :)",
    date: "Feb 7, 2026",
    verified: true,
  },
  {
    name: "Thomino",
    handle: "ThominoDesign",
    quote: "wow! thanks a lot for sharing. amazing!",
    date: "Feb 2, 2026",
  },
  {
    name: "Alejo Castaño",
    handle: "drskantus",
    date: "May 7, 2026",
    verified: true,
    quote: `At first glance, it looks like SwiftUI, but it’s not.

Last few days I’ve been building my own Ad-free music, radio & podcast app.

Shipped straight to production on the App Store. No friction. Only one rejection due to Music API licensing, but I was impressed that Apple didn't push back in general terms.

The entire app runs on React Native + Skia + Reanimated at 60fps.

Built with:
• React Native 0.83
• Skia
• Reanimated 4
• Expo 55
• Reacticx`,
  },
  {
    name: "c9",
    handle: "adorivisuals",
    date: "Feb 9, 2026",
    quote:
      "I adapted the Cinematic Carousel for my journal app Saradays (next release 🤞) beautiful job!",
  },
  {
    name: "Volodymyr",
    handle: "v_serbulenko",
    quote: "This is huge 💪",
    date: "Feb 2, 2026",
  },
  {
    name: "Matheus Gobbi ➔ fitfolio app",
    handle: "matheusgobbidev",
    date: "Feb 8, 2026",
    verified: true,
    quote: "insano",
  },
];

/**
 * Every avatar goes through the proxy, which caches at the edge. The version
 * bumps the URL past any placeholder a browser cached from an earlier failed
 * lookup — raise it if the proxy ever serves bad images again.
 */
const AVATAR_VERSION = 2;

function avatarSrc(handle: string) {
  return `/api/avatar/${handle}?v=${AVATAR_VERSION}`;
}

function postUrl(handle: string) {
  return `https://x.com/${handle}`;
}

export function Community() {
  return (
    <section
      className="mx-auto w-full max-w-[68rem] px-5 pt-40 md:px-8 md:pt-56"
      id="community"
    >
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <AvatarStack />
        </Reveal>

        <h2 className="mt-8 font-serif text-[clamp(2rem,4vw,3.2rem)] text-ink leading-[1.05] tracking-[-0.025em]">
          <Chars>Kind words from the community</Chars>
          <span className="text-brand">.</span>
        </h2>

        <Reveal
          className="mt-5 max-w-[44ch] text-[0.9rem] text-ink-faint leading-[1.75]"
          delay={0.08}
        >
          Unprompted posts from people shipping React Native apps with Reacticx.
        </Reveal>
      </div>
      <div className="mt-16 gap-4 sm:columns-2 lg:columns-3 [&:hover>a:not(:hover)]:opacity-50">
        {TESTIMONIALS.map((testimonial, index) => (
          <TweetCard
            delay={Math.min(index, 3) * 0.05}
            key={testimonial.handle}
            testimonial={testimonial}
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    card                                    */
/* -------------------------------------------------------------------------- */

function TweetCard({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: number;
}) {
  return (
    <a
      className="group mb-4 block break-inside-avoid rounded-2xl bg-surface-raised p-5 transition-[opacity,background-color] duration-300 hover:bg-surface-raised"
      href={postUrl(testimonial.handle)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Reveal delay={delay}>
        <div className="flex items-center gap-3">
          <Avatar
            className="size-10"
            handle={testimonial.handle}
            name={testimonial.name}
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[0.95rem] text-ink">
              <span className="truncate">{testimonial.name}</span>
              {testimonial.verified ? (
                <VerifiedMark className="size-3.5 shrink-0 text-ink-faint" />
              ) : null}
            </p>
            <p className="truncate text-[0.8rem] text-ink-faint">
              @{testimonial.handle}
            </p>
          </div>
          <XMark className="size-4 shrink-0 text-ink-faint transition-colors duration-300 group-hover:text-ink-muted" />
        </div>

        <p className="mt-4 whitespace-pre-line text-[0.95rem] text-ink-muted leading-[1.65]">
          {testimonial.quote}
        </p>

        <p className="mt-4 text-[0.75rem] text-ink-faint">{testimonial.date}</p>
      </Reveal>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   avatars                                  */
/* -------------------------------------------------------------------------- */

/** How much the faces overlap, and how far they part to clear a raised one. */
const AVATAR_OVERLAP = 10;
const AVATAR_SPREAD = 8;

/**
 * Faces sit on top of each other by design, so raising one on its own just
 * buries it in its neighbours. The rest of the row steps aside instead — the
 * ones before it left, the ones after it right — which opens a clean gap
 * around the raised face without needing a ring to cut it out of the stack.
 */
function faceTransform(active: number | null, index: number) {
  if (active === null) return "none";
  if (index === active) return "translateY(-3px) scale(1.16)";
  return `translateX(${index < active ? -AVATAR_SPREAD : AVATAR_SPREAD}px)`;
}

/**
 * Overlapping avatars with a single name plate above them. The plate is shared
 * rather than one tooltip per avatar: it slides to whichever face the pointer
 * is on and swaps its text with numeric-text's content transition, so moving
 * along the row reads as one label being handed between them.
 */
function AvatarStack() {
  const shown = TESTIMONIALS.slice(0, 5);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const linkRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  /** Row-relative centres of the untransformed links, cached per pointer pass. */
  const centres = React.useRef<number[]>([]);

  const [active, setActive] = React.useState<number | null>(null);
  // Name and position outlive `active` so the plate keeps its content while it
  // fades out, instead of emptying and collapsing first. `settled` likewise
  // holds the last face on top through its own scale-down.
  const [label, setLabel] = React.useState("");
  const [settled, setSettled] = React.useState(0);
  const [x, setX] = React.useState(0);

  const measure = React.useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    const rowLeft = row.getBoundingClientRect().left;
    centres.current = linkRefs.current.map((link) => {
      if (!link) return 0;
      const box = link.getBoundingClientRect();
      return box.left - rowLeft + box.width / 2;
    });
  }, []);

  const select = React.useCallback(
    (index: number) => {
      setActive(index);
      setSettled(index);
      setLabel(shown[index].name);
      setX(centres.current[index] ?? 0);
    },
    [shown],
  );

  /**
   * Hover is resolved from the pointer's position against fixed geometry
   * rather than from per-avatar enter/leave. A lifted avatar overlaps its
   * neighbours, so with enter/leave the pointer ends up inside whichever
   * avatar just grew under it and the two trade the hover back and forth —
   * that flip-flopping is what makes the row judder. Nothing here moves the
   * hit targets: the transform sits on an inner span, the links never scale.
   */
  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row) return;

    if (centres.current.length !== shown.length) measure();

    const x = event.clientX - row.getBoundingClientRect().left;
    let nearest = 0;
    for (let index = 1; index < centres.current.length; index++) {
      const closer =
        Math.abs(centres.current[index] - x) <
        Math.abs(centres.current[nearest] - x);
      if (closer) nearest = index;
    }

    if (nearest !== active) select(nearest);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" ref={rowRef}>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-full left-0 mb-3 whitespace-nowrap rounded-lg bg-[#1c1c1c] px-2.5 py-1 text-[0.75rem] text-ink ring-1 ring-white/10 ring-inset"
          style={{
            opacity: active === null ? 0 : 1,
            transform: `translateX(${x}px) translateX(-50%)`,
            transition: `transform ${DURATION}s ${EASE_NUMERIC}, opacity 0.16s linear`,
          }}
        >
          <SwapText value={label} />
        </span>

        <div
          className="flex"
          onPointerLeave={() => {
            centres.current = [];
            setActive(null);
          }}
          onPointerMove={track}
        >
          {shown.map((testimonial, index) => (
            <a
              aria-label={testimonial.name}
              className="relative rounded-full focus-visible:outline-none"
              href={postUrl(testimonial.handle)}
              key={testimonial.handle}
              onBlur={() => setActive(null)}
              onFocus={() => {
                measure();
                select(index);
              }}
              ref={(node) => {
                linkRefs.current[index] = node;
              }}
              rel="noopener noreferrer"
              // Raised for as long as it is the most recent face, so it stays
              // in front while it scales back down rather than snapping behind.
              style={{
                marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP,
                zIndex: settled === index ? shown.length : index,
              }}
              target="_blank"
            >
              <span
                className="block"
                style={{
                  transform: faceTransform(active, index),
                  // Shorter than the page's base duration: a hover that tracks
                  // the pointer has to land before the pointer has moved on.
                  transition: `transform 0.45s ${EASE_NUMERIC}`,
                  transformOrigin: "center bottom",
                  willChange: "transform",
                }}
              >
                <Avatar
                  className="size-8"
                  handle={testimonial.handle}
                  name={testimonial.name}
                />
              </span>
            </a>
          ))}
        </div>
      </div>

      <span className="text-[0.8rem] text-ink-faint">
        and {TESTIMONIALS.length - shown.length} more
      </span>
    </div>
  );
}

/**
 * Avatars come from `/api/avatar/<handle>`, which proxies unavatar.io and is
 * cached at the edge. The route already falls back to a monogram, so `onError`
 * only covers the network failing outright.
 */
function Avatar({
  handle,
  name,
  className,
}: {
  handle: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-white/8 text-[0.7rem] text-ink-faint uppercase",
          className,
        )}
      >
        {name.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      alt=""
      aria-hidden
      className={cn("shrink-0 rounded-full bg-white/8 object-cover", className)}
      decoding="async"
      loading="lazy"
      onError={() => setFailed(true)}
      src={avatarSrc(handle)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                    marks                                   */
/* -------------------------------------------------------------------------- */

function XMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
  );
}
