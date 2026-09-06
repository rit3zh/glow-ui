import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PREVIEWS_DIR = dirname(fileURLToPath(import.meta.url));
const CLOUDFLARE_DIR = join(PREVIEWS_DIR, "..");
const ROOT_DIR = join(CLOUDFLARE_DIR, "..");

export const config = {
  /** R2 bucket holding the transparent page previews. */
  bucket: "reacticx-v2-previews",

  /** Public r2.dev origin (no trailing slash). */
  publicOrigin: "https://pub-364cfe31d5bf415e989f772c3ea4bbaf.r2.dev",

  /**
   * The two encodings every preview ships as.
   *
   * The masters are QuickTime with an alpha channel and are uploaded byte for
   * byte under an `.mp4` key served as `video/mp4` — see the note at the top of
   * `index.ts`, that pairing is load-bearing for Safari. The WebM copies are
   * built from them by `encode.ts`.
   */
  sources: [
    {
      id: "master",
      label: "QuickTime masters",
      dir: join(CLOUDFLARE_DIR, "v2-preview"),
      ext: ".mp4",
      contentType: "video/mp4",
    },
    {
      id: "webm",
      label: "VP9 + alpha copies",
      dir: join(CLOUDFLARE_DIR, "v2-preview-webm"),
      ext: ".webm",
      contentType: "video/webm",
    },
  ],

  /**
   * `Cache-Control` written onto every uploaded preview.
   *
   * Deliberately weaker than the landing bucket's `immutable`. These URLs are
   * written by hand into MDX front matter with no `?v=` on them, so the key is
   * the only identity a preview has — pinning one for a year would mean a
   * re-recorded clip never reaching anyone who had seen the old one. A week of
   * freshness still removes the per-navigation revalidation that was costing a
   * round trip per video, and `stale-while-revalidate` keeps the swap silent.
   */
  cacheControl: "public, max-age=604800, stale-while-revalidate=86400",

  /** Local ledger of what has been uploaded (committed; the media is not). */
  manifestPath: join(PREVIEWS_DIR, "manifest.json"),

  /**
   * Local file names that never matched the docs.
   *
   * The bucket and the MDX pages agree on the spelling; only these files on
   * disk disagree, so they are renamed on the way up rather than left to 404.
   */
  nameFixes: {
    "chroma-backdrop": "chrome-backdrop",
    "curved-maruqee": "curved-marquee",
    "morphing-fab": "morph-fab",
  } as Record<string, string>,

  concurrency: { s3: 16, wrangler: 8 },

  rootDir: ROOT_DIR,
} as const;

export type PreviewSourceId = (typeof config.sources)[number]["id"];

export const previewSourceIds = config.sources.map((source) => source.id);

export const bucketSpec = { bucket: config.bucket, publicOrigin: config.publicOrigin };
