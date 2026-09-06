import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadEnv } from "../lib/env";

const MOCKUPS_DIR = dirname(fileURLToPath(import.meta.url));
const CLOUDFLARE_DIR = join(MOCKUPS_DIR, "..");
const ROOT_DIR = join(CLOUDFLARE_DIR, "..");

loadEnv();

/**
 * The block categories, in the order the docs list them.
 *
 * A mockup is filed under exactly one of these, and the id is a path segment in
 * the object key — `blocks/<category>/<slug>.png` — so the bucket browses the
 * same way the docs do, and a category can be fetched with a single prefixed
 * list rather than by filtering every object in the bucket.
 */
export const categories = [
  {
    id: "bottom-sheet",
    title: "Bottom Sheet",
    description: "Sheets that rise over a dimmed screen — forms, offers, payment and auth.",
  },
  {
    id: "empty-state",
    title: "Empty State",
    description: "What a list, inbox or gallery shows before it has anything in it.",
  },
  {
    id: "settings",
    title: "Settings",
    description: "Profile and preference screens built from grouped rows.",
  },
  {
    id: "welcome-screen",
    title: "Welcome Screen",
    description: "First-run and onboarding screens — the app's opening frame.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const categoryIds = categories.map((category) => category.id);

export const isCategoryId = (value: string): value is CategoryId =>
  (categoryIds as readonly string[]).includes(value);

/**
 * Category fallback for a mockup with no block behind it yet.
 *
 * Normally the category is read straight off the blocks tree — a mockup named
 * `welcome-v2` is a welcome-screen because `blocks/welcome-screen/welcome-v2/`
 * is where its code lives, and nothing here has to say so. This table only
 * catches a screenshot that has landed before its block has, and a subfolder in
 * the source directory overrides both.
 *
 * A mockup matching none of the three is a hard error rather than a guess — an
 * uncategorised block is invisible in every listing.
 */
export const categoryOf = {} satisfies Record<string, CategoryId>;

/**
 * Mockups whose file name never matched their block's directory.
 *
 * Renaming either side is the better fix; until then this is what keeps the
 * screenshot attached to the code it is a screenshot of.
 */
export const blockDirFixes: Record<string, string | undefined> = {
  "airbnb-v2": "air-bnb-v2",
};

/**
 * Attribution is read from each block's own header comment, not from a table
 * here — see `blocks.ts`. Nothing to configure.
 */

/** Titles the slug does not produce on its own. */
export const titleFixes = {
  "add-address-new": "Add New Address",
  "airbnb-v1": "Airbnb Promo",
  "airbnb-v2": "Airbnb Promo · Alt",
  "apple-v1": "Apple Pay",
  "billing-v1": "Subscriptions",
  "empty-gallary-v1": "Empty Gallery",
} as Record<string, string>;

export const config = {
  /** R2 bucket holding the v2 block mockups. */
  bucket: "reacticx-v2-mockups",

  /**
   * Every key is namespaced under this, so the bucket can hold more than
   * blocks later without a migration.
   */
  keyPrefix: "blocks",

  /** Flat folder of PNGs; subfolders are read as category names. */
  sourceDir: join(CLOUDFLARE_DIR, "v2-mockups"),

  /** The blocks tree each mockup is a screenshot of. */
  blocksDir: join(ROOT_DIR, "src", "components", "blocks"),

  /** Local ledger of what has been uploaded (committed; the images are not). */
  manifestPath: join(MOCKUPS_DIR, "manifest.json"),

  /**
   * Auto-generated TypeScript. Two copies, written from the same pass: the
   * repo's own, and the website's — `/blocks` reads its categories, titles and
   * image URLs straight off it at build time, so a re-export that never reached
   * the site would show the docs a stale screenshot.
   */
  generatedTargets: [
    join(CLOUDFLARE_DIR, "generated", "v2-mockups.ts"),
    join(ROOT_DIR, "website", "src", "lib", "v2-mockups.generated.ts"),
  ],

  /** File types accepted in the source folder, and how R2 serves them. */
  mediaTypes: {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
  } as Record<string, string | undefined>,

  /**
   * `Cache-Control` written onto every uploaded mockup.
   *
   * `immutable` is honest here for the same reason it is on the landing bucket:
   * the generated `bucketURL` carries a `?v=<hash>` of the file's own bytes, so
   * a re-exported mockup gets a different URL and every cache treats it as a
   * new object. The key itself never moves.
   */
  cacheControl: "public, max-age=31536000, immutable",

  concurrency: { s3: 16, wrangler: 8 },

  rootDir: ROOT_DIR,
} as const;

/**
 * The bucket's public origin.
 *
 * The r2.dev URL, not the S3 API endpoint the bucket was created with — that
 * one is signed-only and serves a browser nothing, so linking the registry at
 * it would generate 19 URLs that 403 for every visitor. Overridable with
 * `R2_MOCKUPS_PUBLIC_ORIGIN` for when this moves to a custom domain.
 */
export function publicOrigin() {
  const override = process.env.R2_MOCKUPS_PUBLIC_ORIGIN?.trim().replace(/\/+$/, "");
  return override || "https://pub-011895838bd549b3b6311d0df5257626.r2.dev";
}

export const bucketSpec = () => ({
  bucket: config.bucket,
  publicOrigin: publicOrigin(),
});
