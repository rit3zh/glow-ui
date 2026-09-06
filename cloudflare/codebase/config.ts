import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CODEBASE_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(CODEBASE_DIR, "..", "..");

export type SourceId = "core" | "examples" | "helpers" | "shared" | "types";

export interface Source {
  id: SourceId;
  /** Shown in the CLI output. */
  label: string;
  /** Directory walked, relative to the repo root. */
  dir: string;
  /** Key prefix inside the bucket. */
  prefix: string;
}

export const config = {
  /** R2 bucket that mirrors the library source. */
  bucket: "reacticx-codebase",

  /**
   * Public r2.dev origin (no trailing slash). Swap for a custom domain later.
   * Also what the remote verification pass HEADs against, and what the website
   * reads source from at build time.
   */
  publicOrigin: "https://pub-028ac77ff44d4123aed5b9b6592ec08d.r2.dev",

  /**
   * `Cache-Control` written onto every uploaded object.
   *
   * R2 sends no caching directive of its own, which left the docs re-fetching
   * `index.json` — a quarter of a megabyte — on essentially every component
   * page view. These keys are unversioned and a release rewrites them in place,
   * so freshness is deliberately short; `stale-while-revalidate` is what does
   * the real work, serving the cached copy instantly while the update lands in
   * the background.
   */
  cacheControl: "public, max-age=3600, stale-while-revalidate=604800",

  /**
   * The top-level folders in the bucket. Each one mirrors a local directory
   * verbatim — `dir/a/b.tsx` becomes `prefix/a/b.tsx`.
   *
   * `types` is the one whose directory is generated rather than authored:
   * `build-types.ts` collects each component's type file into a single
   * `types/<component>/index.ts`, which the sync then walks like any other.
   */
  sources: [
    {
      id: "core",
      label: "core components",
      dir: "src/components",
      prefix: "core",
    },
    {
      id: "examples",
      label: "example screens",
      dir: "app/components",
      prefix: "examples",
    },
    {
      id: "helpers",
      label: "helpers",
      dir: "src/utils/create-compound-component",
      prefix: "helpers/create-compound-component",
    },
    {
      id: "shared",
      label: "shared hooks",
      dir: "src/helpers",
      prefix: "shared",
    },
    {
      id: "types",
      label: "component types",
      dir: "cloudflare/codebase/types-build",
      prefix: "types",
    },
  ] satisfies readonly Source[],

  /** Local ledger of what has already been uploaded (sha256 based). */
  manifestPath: join(CODEBASE_DIR, "manifest.json"),

  /**
   * A listing of every object, uploaded alongside the source. The bucket is not
   * public and wrangler cannot list objects, so this is how a consumer
   * discovers what is in there.
   */
  indexKey: "index.json",

  /** File and directory names that are never uploaded. */
  ignoreNames: new Set([
    ".DS_Store",
    "Thumbs.db",
    ".git",
    "node_modules",
    "__snapshots__",
    "__tests__",
  ]),

  /** Anything above this is almost certainly not source — skipped with a warning. */
  maxFileSize: 5 * 1024 * 1024,

  /** How many remote HEAD checks run at once during --verify. */
  verifyConcurrency: 32,

  /** How many uploads run at once, per backend. */
  concurrency: {
    /** Each wrangler call is a ~3s process spawn, so parallelism carries it. */
    wrangler: 10,
    /** Direct S3 PUTs are cheap. */
    s3: 32,
  },

  /**
   * Content type per extension. Code is served as text/plain so it renders in a
   * browser instead of downloading. Unlisted extensions fall back below.
   */
  contentTypes: {
    ".ts": "text/plain; charset=utf-8",
    ".tsx": "text/plain; charset=utf-8",
    ".js": "text/plain; charset=utf-8",
    ".jsx": "text/plain; charset=utf-8",
    ".mjs": "text/plain; charset=utf-8",
    ".cjs": "text/plain; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".md": "text/markdown; charset=utf-8",
    ".mdx": "text/markdown; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  } as Record<string, string | undefined>,

  defaultContentType: "application/octet-stream",

  rootDir: ROOT_DIR,
} as const;

export const sourceIds = config.sources.map((source) => source.id);

export function publicUrlFor(objectKey: string) {
  return `${config.publicOrigin}/${objectKey.split("/").map(encodeURIComponent).join("/")}`;
}

export function contentTypeFor(fileName: string) {
  const match = /\.[a-z0-9]+$/i.exec(fileName);
  if (!match) return config.defaultContentType;
  return config.contentTypes[match[0].toLowerCase()] ?? config.defaultContentType;
}
