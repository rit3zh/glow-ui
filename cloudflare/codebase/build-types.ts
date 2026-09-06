/**
 * Builds the `types/` folder the codebase sync uploads.
 *
 * Every other bucket folder mirrors a directory that someone authored. This one
 * does not: a component keeps its props wherever it likes — `types.ts`,
 * `types/index.ts`, `Shimmer.types.ts`, `ParallaxHeader.props.ts` — and the
 * docs should not have to know which. So each component's type file is copied
 * to `types-build/<slug>/index.ts`, giving the bucket one predictable key per
 * component:
 *
 *   types/<slug>/index.ts
 *
 * which is the same shape as `examples/<slug>/index.tsx`. That is what lets the
 * website resolve props from a slug alone, and what replaced the hand-maintained
 * `react-native-types/` copies it used to read from disk.
 *
 * The copy is verbatim — no re-export wrapper, no rewriting of imports — so what
 * the docs parse is exactly the source of truth in `src/components`.
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { config } from "./config";

/** Where the generated tree is written. Mirrors the `types` source dir. */
const OUTPUT_DIR = join(config.rootDir, "cloudflare/codebase/types-build");

/** The library's component groups live directly under here. */
const COMPONENTS_DIR = join(config.rootDir, "src/components");

/**
 * Groups whose components are compositions rather than props-driven building
 * blocks. They ship no documented API, so publishing types for them would put
 * ~100 unreachable objects in the bucket.
 */
const EXCLUDED_GROUPS = new Set(["screens", "templates"]);

/**
 * Groups that nest one level deeper — `blocks/<kind>/<variant>` rather than
 * `<group>/<component>` — because a block is one of several variants of the
 * same kind of surface (`blocks/bottom-sheet/airbnb-v1`). Their variants are
 * the components, so the walk descends past the intermediate directory.
 */
const NESTED_GROUPS = new Set(["blocks"]);

/**
 * A page in here is the exception that puts an excluded component back in.
 * `templates/parallax-header` is documented like any other component, so its
 * props have to be resolvable — deriving that from the docs rather than from a
 * hardcoded list is what stops the two from drifting apart.
 */
const DOCS_PAGES_DIR = join(config.rootDir, "website/content/components");

/**
 * Type file names, most canonical first.
 *
 * `types/index.ts` outranks the `<Pascal>.*` names deliberately: a component
 * that has both (parallax-header) keeps the barrel as its public surface and
 * leaves the older single file behind.
 */
function typeFileCandidates(dirName: string) {
  const pascal = toPascalCase(dirName);
  return [
    "types.ts",
    "types/index.ts",
    "types.tsx",
    `${pascal}.types.ts`,
    `${pascal}.props.ts`,
    `${dirName}.types.ts`,
  ];
}

/** `search-bar` -> `SearchBar`; `Shimmer` is already there. */
function toPascalCase(name: string) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * The bucket key a component goes by — the directory name in kebab case.
 *
 * A handful of directories are Pascal (`Toast`, `Shimmer`, `Pagination`) while
 * the docs slug is always kebab, so those have to be folded. Underscores are
 * left alone: `unstable_orb` is the directory name in `core/`, the folder name
 * in `examples/`, and the file name of its docs page, so `types/` matching it
 * keeps all four spellings the same. The website normalises both sides of the
 * lookup anyway, so either spelling resolves — this one just reads consistently.
 */
function toSlug(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

async function isFile(path: string) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function directoriesIn(path: string) {
  try {
    const entries = await readdir(path, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

/** Slugs the docs site has a page for. Empty when the website is not checked out. */
async function documentedSlugs() {
  try {
    const entries = await readdir(DOCS_PAGES_DIR, { withFileTypes: true });
    return new Set(
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
        .map((entry) => entry.name.slice(0, -".mdx".length)),
    );
  } catch {
    return new Set<string>();
  }
}

export interface BuiltType {
  slug: string;
  group: string;
  /** The type file that was copied, relative to the repo root. */
  from: string;
}

export interface BuildTypesResult {
  /** One entry per `types-build/<slug>/index.ts` written. */
  written: BuiltType[];
  /** Components pulled back in from an excluded group because a page documents them. */
  byException: BuiltType[];
  /** Human-readable descriptions of two components claiming the same slug. */
  collisions: string[];
}

/**
 * Absolute paths of the component directories in a group — one level down for
 * an ordinary group, two for a nested one.
 */
async function componentDirsIn(group: string) {
  const groupDir = join(COMPONENTS_DIR, group);
  const entries = await directoriesIn(groupDir);
  if (!NESTED_GROUPS.has(group)) {
    return entries.map((entry) => join(groupDir, entry));
  }

  const nested: string[] = [];
  for (const kind of entries) {
    const kindDir = join(groupDir, kind);
    for (const variant of await directoriesIn(kindDir)) {
      nested.push(join(kindDir, variant));
    }
  }
  return nested;
}

export async function buildTypes(): Promise<BuildTypesResult> {
  const documented = await documentedSlugs();

  const written: BuiltType[] = [];
  const byException: BuiltType[] = [];
  const collisions: string[] = [];

  /** slug -> the component that claimed it, so a second claim can be reported. */
  const claimed = new Map<string, BuiltType>();

  for (const group of await directoriesIn(COMPONENTS_DIR)) {
    for (const componentDir of await componentDirsIn(group)) {
      const dirName = basename(componentDir);
      const slug = toSlug(dirName);

      const excluded = EXCLUDED_GROUPS.has(group);
      if (excluded && !documented.has(slug)) continue;

      // Components without a type file simply have no props to document; that
      // is ordinary, not a problem worth warning about.
      let sourcePath: string | undefined;
      for (const candidate of typeFileCandidates(dirName)) {
        const full = join(componentDir, candidate);
        if (await isFile(full)) {
          sourcePath = full;
          break;
        }
      }
      if (!sourcePath) continue;

      const from = sourcePath.slice(config.rootDir.length + 1);
      const built: BuiltType = { slug, group, from };

      // First claim wins, and groups are walked in a stable order, so a
      // collision never silently flips which file the bucket serves.
      const existing = claimed.get(slug);
      if (existing) {
        collisions.push(
          `${slug}: keeping ${existing.from}, ignoring ${from}`,
        );
        continue;
      }
      claimed.set(slug, built);

      const destination = join(OUTPUT_DIR, slug, "index.ts");
      const contents = await readFile(sourcePath, "utf8");

      // Rewriting an unchanged file would be harmless — the sync hashes
      // contents, not mtimes — but skipping it keeps the tree quiet in a watch.
      const current = await readFile(destination, "utf8").catch(() => null);
      if (current !== contents) {
        await mkdir(join(OUTPUT_DIR, slug), { recursive: true });
        await writeFile(destination, contents, "utf8");
      }

      written.push(built);
      if (excluded) byException.push(built);
    }
  }

  // A component that was renamed or lost its type file leaves a directory
  // behind. Removing it here is what lets the sync's own stale detection see
  // the object as prunable instead of re-uploading it forever.
  for (const stale of await directoriesIn(OUTPUT_DIR)) {
    if (claimed.has(stale)) continue;
    await rm(join(OUTPUT_DIR, stale), { recursive: true, force: true });
  }

  return { written, byException, collisions };
}
