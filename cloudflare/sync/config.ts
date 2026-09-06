import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CLOUDFLARE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT_DIR = join(CLOUDFLARE_DIR, "..");

export const config = {
  /** R2 bucket that holds every landing page video. */
  bucket: "reacticx-landing-assets",

  /**
   * Public origin (no trailing slash).
   *
   * A custom domain rather than the bucket's `pub-*.r2.dev` URL: that one is
   * rate-limited by design, takes no cache rules, and never showed a
   * `cf-cache-status` at all — every request went to the bucket. On this domain
   * the objects are edge-cached, which took cold TTFB from ~400ms to ~37ms.
   */
  publicOrigin: "https://cdn.reacticx.com",

  /** Where the local .mp4 files live. */
  sourceDir: join(CLOUDFLARE_DIR, "landing-assets"),

  /** Local ledger of what has already been uploaded (hash based). */
  manifestPath: join(CLOUDFLARE_DIR, "sync", "manifest.json"),

  /**
   * Auto-generated TypeScript, written to every target so each consumer stays
   * self-contained (the website is built for Workers and cannot reach outside
   * its own directory).
   */
  generatedTargets: [
    join(CLOUDFLARE_DIR, "generated", "landing-assets.ts"),
    join(ROOT_DIR, "website", "src", "lib", "landing-assets.generated.ts"),
  ],

  /**
   * Every file type the sync accepts, mapped to the content type R2 serves it
   * with. Anything not listed here is ignored in the source folder.
   */
  mediaTypes: {
    ".mp4": { contentType: "video/mp4", kind: "video" },
    ".webm": { contentType: "video/webm", kind: "video" },
    ".mov": { contentType: "video/quicktime", kind: "video" },
    ".png": { contentType: "image/png", kind: "image" },
    ".jpg": { contentType: "image/jpeg", kind: "image" },
    ".jpeg": { contentType: "image/jpeg", kind: "image" },
    ".webp": { contentType: "image/webp", kind: "image" },
    ".avif": { contentType: "image/avif", kind: "image" },
    ".gif": { contentType: "image/gif", kind: "image" },
  },

  /**
   * Suffixes stripped off a file name to derive the component name.
   * Longest first — order matters.
   */
  nameSuffixes: ["-landing-page-asset", "-landing-asset", "-landing-page", "-asset"],

  /**
   * `Cache-Control` written onto every uploaded object.
   *
   * Without this R2 sends no caching directive at all, so a browser falls back
   * to heuristic freshness and revalidates the clips on essentially every
   * navigation — a round trip per video before a single byte of it is reused.
   *
   * `immutable` is only honest because the generated `bucketURL` carries a
   * `?v=<hash>` of the file's own contents (see `lib/generate.ts`): re-recording
   * a clip changes the hash, which changes the URL, which is a cache miss. The
   * object key itself is stable, so without that query this would pin a stale
   * clip in every visitor's browser for a year.
   */
  cacheControl: "public, max-age=31536000, immutable",

  /** How many uploads / remote checks run at once. */
  concurrency: 6,

  rootDir: ROOT_DIR,
} as const;

export type Config = typeof config;
export type MediaKind = (typeof config.mediaTypes)[keyof typeof config.mediaTypes]["kind"];

export const mediaExtensions = Object.keys(config.mediaTypes);

/** Returns the media descriptor for a file name, or undefined if unsupported. */
export function mediaTypeFor(fileName: string) {
  const match = /\.[a-z0-9]+$/i.exec(fileName);
  if (!match) return undefined;

  const table = config.mediaTypes as Record<
    string,
    { contentType: string; kind: MediaKind } | undefined
  >;
  return table[match[0].toLowerCase()];
}
