import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * An iPhone 16 Pro Max, with a screenshot inside it.
 *
 * The frame is the vector body from `inspo/telephone`, exported once to
 * `public/mockups/iphone-16-max.svg` and drawn as a plain `<img>` on top of the
 * screen rather than inlined per card. Nineteen copies of a 15 KB SVG is 19
 * copies of its gradients, filters and clip paths in the document — and every
 * one of them carries the same `id`s, so they would collide as well. As an
 * image it is one cached file however many phones the page holds.
 *
 * The status bar is not part of it: the exported frame drops the glyphs the
 * original draws over the screen, because these screenshots are real device
 * captures that already carry their own island and indicator. Two of each is
 * worse than one.
 */

/** The frame's own proportions — `viewBox="0 0 415 843"`. */
const FRAME_ASPECT = 415 / 843;

/**
 * Where the screen sits inside the frame, and how round its corners are.
 * Lifted verbatim from the `telephone` element's shadow styles, so the
 * screenshot lands exactly where the vector leaves a hole for it.
 *
 * The radius is a fraction of the frame's width, which `cqw` gives directly:
 * the container is the query root, so the corners stay right at any size
 * without a resize observer measuring the element the way the original does.
 */
const SCREEN_INSET = { x: "3.4%", y: "1.32%" };
const SCREEN_RADIUS = "12.2126cqw";

export function IPhoneMockup({
  src,
  alt,
  className,
  /** Passed through to the screenshot — cards lazy-load, a detail page does not. */
  loading = "lazy",
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative w-full [container-type:inline-size]", className)}
      style={{ aspectRatio: FRAME_ASPECT }}
    >
      {/* The screen, under the frame. The capture is a hair narrower than the
          hole it fills — 0.4603 against the frame's 0.4713 — so it is stretched
          to it rather than covered or contained. Two per cent of vertical
          stretch is invisible; the alternatives are not, since covering shaves
          ten points off the top and bottom of a full-device capture, which is
          exactly where a sheet's handle and a home indicator live. */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{
          borderRadius: SCREEN_RADIUS,
          inset: `${SCREEN_INSET.y} ${SCREEN_INSET.x}`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- the bucket
            serves these already sized; the optimiser would only re-encode a
            file that is one fetch from R2's edge. */}
        <img
          alt={alt}
          className="h-full w-full object-fill"
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          loading={loading}
          src={src}
        />
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element -- a static vector. */}
      <img
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        draggable={false}
        src="/mockups/iphone-16-max.svg"
      />
    </div>
  );
}
