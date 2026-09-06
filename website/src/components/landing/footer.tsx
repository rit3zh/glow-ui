"use client";

import dynamic from "next/dynamic";

import { TWITTER } from "./data";
import { Reveal, useInView } from "./primitives";

// Client-only: the shader needs a WebGL2 context, which does not exist in the
// server render, and `ogl` has no business in that bundle either.
const Aurora = dynamic(() => import("@/components/landing/aurora"), {
  ssr: false,
});

/**
 * Ember ramp for the curtain, read left to right.
 *
 * Deep at the edges and brand-bright in the middle, so the band reads as one
 * light source rather than a stripe. `--color-brand` (#ff6a3d) is the centre
 * stop; the outer two are the same hue pushed darker and warmer.
 */
const AURORA_STOPS = ["#5c1c06", "#ff6a3d", "#ffb066"];

/**
 * The aurora curtain, rising out of the bottom edge.
 *
 * The shader draws its band against the *top* of its own viewport, so the
 * canvas is turned a half turn and pinned to the bottom of the page: what was
 * the top edge of the effect becomes the floor the light climbs out of. The
 * mask lives on the outer box, which is not rotated, so the fade always runs
 * from lit at the page bottom to nothing partway up regardless of the
 * transform — and the radial pass pulls the light off the left and right
 * edges, which is what keeps it a glow rather than a coloured stripe.
 *
 * Everything here is tuned soft: a high `blend` so the band has no edge, a
 * small amplitude so the wave barely moves, and a low opacity so it never
 * competes with the one line of text sitting on it.
 *
 * It only mounts once the footer is near the viewport: a shader running a
 * `requestAnimationFrame` loop for the entire scroll of the page is a lot of
 * GPU for something nobody has reached yet.
 */
function AuroraCurtain() {
  const [ref, inView] = useInView<HTMLDivElement>({
    margin: "0px 0px 40% 0px",
  });

  const fade =
    "linear-gradient(to top, #000 0%, rgba(0,0,0,0.55) 45%, transparent 92%), radial-gradient(110% 100% at 50% 100%, #000 25%, transparent 75%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[24rem]"
      ref={ref}
      style={{
        maskImage: fade,
        WebkitMaskImage: fade,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="h-[520px] w-full rotate-180 ">
        {inView ? (
          <Aurora
            amplitude={0.5}
            blend={0.3}
            colorStops={AURORA_STOPS}
            speed={2}
          />
        ) : null}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden">
      <AuroraCurtain />

      {/*
        Last element on the page: the default negative bottom margin would put
        it below the observation box even at full scroll, so it never reveals.
        The bottom padding clears the page's fixed 6rem blur band, which would
        otherwise dissolve the one line this footer has.
      */}
      <Reveal
        amount={0}
        className="mx-auto flex w-full max-w-[62rem] items-center justify-center px-5 pt-16 pb-24 md:px-8"
        margin="0px"
      >
        <p className="text-[0.8rem] text-ink-faint">
          Built by{" "}
          <a
            className="text-brand transition-opacity duration-200 hover:opacity-75"
            href={TWITTER}
            rel="noopener noreferrer"
            target="_blank"
          >
            rit3zh
          </a>
        </p>
      </Reveal>
    </footer>
  );
}
