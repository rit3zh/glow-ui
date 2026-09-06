import { getComponent } from "@/lib/components.generated";
import { loadHighlightedSource } from "@/components/component-docs/source-code";
import { PreviewTabs } from "@/components/primitives-docs/preview-tabs";

/**
 * The recording at the head of a primitive's page, with its source behind a
 * tab.
 *
 * Unlumen renders the real component here, which a web component library can
 * do. These are React Native — Skia, Reanimated, Gesture Handler — so the
 * preview is the recording made on a device, and the Code tab carries the file
 * you would actually paste.
 *
 * The recording sits on a plate that is dark in both themes, because it is:
 * the clips are captured on black, and a black rectangle bleeding into a white
 * page reads as a broken image. Framed deliberately — inset, rounded, with the
 * dashed guides either side — it reads as a device instead.
 */

/** Tallest a recording may stand, in px. Portraits are capped by width to it. */
const MAX_MEDIA_HEIGHT = 384;

/** What the plate falls back to when there is nothing to show. */
const EMPTY_PLATE_HEIGHT = "12rem";

export async function ComponentPreview({ name }: { name: string }) {
  const component = getComponent(name);
  const media = component?.previewVideo ?? component?.hoverVideo ?? null;
  // The `(\?|$)` tail matters: landing-asset URLs carry a `?v=<hash>` cache
  // buster, so an extension test anchored to the end of the string never
  // matches one and a still gets handed to a `<video>`, which renders nothing.
  const isImage = media ? /\.(png|jpe?g|webp|avif|gif)(\?|$)/i.test(media) : false;

  /**
   * The recording's real shape, from the registry.
   *
   * This is the whole fix for the plate's dead space. A fixed `min-height` has
   * to be tall enough for the portraits, which left the wide ones — `icon-tile`
   * is 2.85:1 — floating in a band of empty plate half again their own height.
   * Reserving the exact box instead means the plate is only ever as tall as
   * what is in it, and that it is that tall from the first frame: the box is
   * laid out before the video has loaded a single byte, so nothing reflows when
   * it arrives and the container's spring has nothing to correct.
   */
  const aspect = component?.hoverAspect ?? 1;

  const source = await loadHighlightedSource(
    "component",
    name,
    // Padding and the scroll cap belong on the `pre` itself: a long file would
    // otherwise make the pane thousands of pixels tall, and the tab container
    // springs to whatever the pane reports.
    "no-scrollbar max-h-[26rem] overflow-auto px-6 py-6 font-mono text-[13.5px] leading-[1.7]",
  );

  return (
    <PreviewTabs
      code={source?.rendered}
      preview={
        <div
          className="flex items-center justify-center rounded-xl bg-[#0b0b0b] p-6"
          style={media ? undefined : { minHeight: EMPTY_PLATE_HEIGHT }}
        >
          {media ? (
            <div
              className="w-full overflow-hidden rounded-lg"
              style={{
                aspectRatio: aspect,
                // Capping the width rather than the height is what keeps a
                // portrait from being letterboxed: at this width its own
                // aspect already puts it exactly at `MAX_MEDIA_HEIGHT`.
                maxWidth: `${Math.round(aspect * MAX_MEDIA_HEIGHT)}px`,
              }}
            >
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={`${component?.title ?? name} preview`}
                  className="size-full object-contain"
                  src={media}
                />
              ) : (
                <video
                  autoPlay
                  className="size-full object-contain"
                  loop
                  muted
                  playsInline
                  src={media}
                />
              )}
            </div>
          ) : (
            <p className="text-[13.5px] text-white/40">
              No recording yet for {name}.
            </p>
          )}
        </div>
      }
    />
  );
}
