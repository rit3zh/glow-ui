import { existsSync, readdirSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, sep } from "node:path";

import {
  LANDING_ASSETS_ORIGIN,
  landingAssets,
} from "../../../src/lib/landing-assets.generated";

import {
  categories,
  categoryTypes,
  config,
  contentDirFor,
  fallbackCategory,
  labelFor,
  sectionForGroup,
  type CategoryType,
  type GroupId,
  type Section,
} from "../config";
import { parseFrontMatter } from "./frontmatter";

export interface ComponentEntry {
  categoryType: CategoryType;
  name: string;
  title: string;
  description: string;
  icon: string;
  /** Short loop for a card on hover. */
  hoverVideo: string | null;
  /** Full demo shown on the page. */
  previewVideo: string | null;
  /** width ÷ height of the hover clip, for the gallery's row layout. */
  hoverAspect: number | null;
  /** Which catalogue page the component appears on. */
  group: GroupId;
  lastModified: string;
  /** Where the category came from — drives what the CLI reports and backfills. */
  origin: "frontmatter" | "folder" | "meta" | "fallback";
  /** Where the component's source still lives. Empty means the page is orphaned. */
  sourceIn: ("core" | "examples")[];
  filePath: string;
}

const REPO_ROOT = join(config.siteDir, "..");

/**
 * Which source trees still hold this component.
 *
 * A page whose component is in neither is orphaned: it documents something that
 * has been deleted, and `--prune` is what removes it. `core` is nested by
 * category, so it takes a bounded walk rather than a direct path check.
 */
function sourceRootsFor(name: string): ("core" | "examples")[] {
  const found: ("core" | "examples")[] = [];

  if (hasCoreDir(join(REPO_ROOT, config.sourceDirs.core), name, 0)) found.push("core");
  if (existsSync(join(REPO_ROOT, config.sourceDirs.examples, name))) found.push("examples");

  return found;
}

function hasCoreDir(dir: string, name: string, depth: number): boolean {
  return findCoreDir(dir, name, depth) !== null;
}

/** The component's directory under `src/components`, or null. */
function findCoreDir(dir: string, name: string, depth: number): string | null {
  if (depth > 3) return null;

  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    if (entry.name === name) return join(dir, entry.name);

    const nested = findCoreDir(join(dir, entry.name), name, depth + 1);
    if (nested) return nested;
  }

  return null;
}

/**
 * The folder a component sits in, directly under `src/components`.
 *
 * `charts/component-name` -> `charts`. Undefined when the component has no
 * source in the tree at all, which is what makes a docs page orphaned.
 */
function coreFolderFor(name: string): string | undefined {
  const root = join(REPO_ROOT, config.sourceDirs.core);
  const found = findCoreDir(root, name, 0);
  if (!found) return undefined;

  return found.slice(root.length + 1).split(sep)[0];
}

/**
 * Which catalogue a component belongs to.
 *
 * Read off the source location rather than out of front matter: a chart lives
 * in `charts/`, a piece in `pieces/`, and moving one between folders should be
 * the entire change rather than a move plus an edit somewhere else that is easy
 * to forget.
 */
export function groupFor(name: string): GroupId {
  const folder = coreFolderFor(name);
  const group = config.groups.find((candidate) => candidate.dir === folder);

  return (group?.id ?? config.fallbackGroup) as GroupId;
}

/**
 * The docs section a component's folder demands, when its folder demands one.
 *
 * `charts/` and `primitives/` are sections in their own right, so the tree is
 * the answer and the front matter follows it.
 */
export function categoryFromFolder(name: string): CategoryType | undefined {
  const folder = coreFolderFor(name);
  return folder ? config.categoryByDir[folder] : undefined;
}

/** `accordion` -> the landing-asset clip, when one has been recorded. */
const landingByName = new Map<string, (typeof landingAssets)[number]>(
  landingAssets.map((asset) => [asset.name, asset]),
);

/**
 * The aspect of a component's hover clip, when one has been measured.
 *
 * The gallery lays its cards out in justified rows weighted by this, so every
 * card in a row shares a media height and none of them crops. Measured by
 * ffprobe during `assets:sync`, so the layout is settled at build time rather
 * than reflowing as clips load.
 */
export function hoverAspectFor(name: string): number | null {
  const asset =
    landingByName.get(name) ?? landingByName.get(name.replace(/_/g, "-"));

  return asset?.aspect ?? null;
}

export function hoverVideoFor(name: string): string | null {
  // The asset sync derives its names from file names and normalises `_` to
  // `-`; a slug like `unstable_orb` keeps the underscore. Try both rather than
  // renaming files to paper over it.
  const asset =
    landingByName.get(name) ?? landingByName.get(name.replace(/_/g, "-"));

  // `bucketURL` rather than origin + key: it carries the `?v=<hash>` the asset
  // sync stamps on, which is what makes the object's `immutable` Cache-Control
  // safe to trust. Rebuilding the URL by hand here would drop the version and
  // leave hover clips revalidating on every navigation.
  return asset ? asset.bucketURL : null;
}

/**
 * The category each page sits under in the *current* meta.json.
 *
 * This is the bridge for pages written before `category:` existed in front
 * matter: the first run reads the section a page already lives in and writes it
 * back into the file, after which meta.json is a pure output.
 */
export async function readCategoriesFromMeta(): Promise<Map<string, CategoryType>> {
  const found = new Map<string, CategoryType>();

  let meta: { pages?: string[] };
  try {
    meta = JSON.parse(await readFile(config.metaPath, "utf8")) as { pages?: string[] };
  } catch {
    return found;
  }

  let current: CategoryType | undefined;

  for (const page of meta.pages ?? []) {
    const separator = /^---(.+)---$/.exec(page);

    if (separator) {
      const label = separator[1]!.trim();
      current = categories.find((category) => category.label === label)?.type;
      continue;
    }

    if (current) found.set(page, current);
  }

  return found;
}

export async function collectComponents() {
  const fromMeta = await readCategoriesFromMeta();

  // Every section's folder, not just `content/components` — a page is found
  // wherever it currently sits, and the section it *belongs* in is decided
  // below by its catalogue. That is what lets a component move between the two
  // by being moved between folders under `src/components`.
  const found: { file: string; dir: string }[] = [];
  for (const section of config.sections) {
    const dir = contentDirFor(section);
    if (!existsSync(dir)) continue;

    for (const file of await readdir(dir)) {
      if (file.endsWith(".mdx")) found.push({ file, dir });
    }
  }
  const files = found.sort((a, b) => a.file.localeCompare(b.file));

  const entries: ComponentEntry[] = [];
  const problems: string[] = [];

  for (const { file, dir } of files) {
    const name = file.replace(/\.mdx$/, "");
    const filePath = join(dir, file);
    const parsed = parseFrontMatter(await readFile(filePath, "utf8"));

    if (!parsed) {
      problems.push(`${file} — no front matter block, skipped`);
      continue;
    }

    const declared = parsed.values[config.categoryKey];
    const fromFolder = categoryFromFolder(name);

    let categoryType: CategoryType;
    let origin: ComponentEntry["origin"];

    if (fromFolder) {
      // The folder is the answer for these; the front matter is backfilled to
      // match, so a chart moved out of `charts/` re-files itself on the next run.
      categoryType = fromFolder;
      origin = declared === fromFolder ? "frontmatter" : "folder";
    } else if (declared && categoryTypes.includes(declared as CategoryType)) {
      categoryType = declared as CategoryType;
      origin = "frontmatter";
    } else {
      if (declared) {
        problems.push(
          `${file} — unknown category "${declared}", expected ${categoryTypes.join(", ")}`,
        );
      }
      const inherited = fromMeta.get(name);
      categoryType = inherited ?? fallbackCategory;
      origin = inherited ? "meta" : "fallback";
    }

    if (!parsed.values.title) problems.push(`${file} — no title in front matter`);

    // The hover clip is derived, not authored: it exists exactly when a landing
    // asset has been recorded for the component, so the front matter follows
    // the bucket rather than the other way round.
    const hoverVideo =
      hoverVideoFor(name) ?? parsed.values[config.videoKeys.hover] ?? null;

    // `previewVideo` split out of the original `video:`, so an unmigrated page
    // still resolves to the URL it always had.
    const previewVideo =
      parsed.values[config.videoKeys.preview] ||
      parsed.values[config.legacyVideoKey] ||
      null;

    entries.push({
      categoryType,
      name,
      title: parsed.values.title ?? name,
      description: parsed.values.description ?? "",
      icon: parsed.values.icon ?? "",
      hoverVideo: hoverVideo || null,
      previewVideo,
      hoverAspect: hoverAspectFor(name),
      group: groupFor(name),
      lastModified: parsed.values.lastModified ?? "",
      origin,
      sourceIn: sourceRootsFor(name),
      filePath,
    });
  }

  // A page whose catalogue no longer matches the folder it sits in. The move
  // is not done here — deleting and rewriting .mdx would lose git history — so
  // it is reported for `git mv` instead.
  for (const entry of entries) {
    const belongs = sectionForGroup(entry.group);
    if (!entry.filePath.startsWith(contentDirFor(belongs))) {
      problems.push(
        `${entry.name} — is a ${entry.group}, so its page belongs in content/${belongs.dir}/`,
      );
    }
  }

  // Category order first, then alphabetical inside it — the same order the
  // sidebar and the generated array both use.
  const rank = new Map(categories.map((category, index) => [category.type, index]));
  entries.sort(
    (a, b) =>
      rank.get(a.categoryType)! - rank.get(b.categoryType)! ||
      a.name.localeCompare(b.name),
  );

  return { entries, problems };
}

/**
 * One section's fumadocs sidebar: a flat page list with `---Label---`
 * separators.
 *
 * Catalogue first, docs section second. Only the component catalogue is split
 * into sections — Shaders, Texts, Micro Interactions, Components — because it
 * is the only one big enough to need them. Pieces and charts each land in one
 * section named after the catalogue, so a piece is never filed under
 * `---Components---` next to a carousel it has nothing in common with.
 *
 * A section only ever lists the catalogues it holds, so every page in the
 * collection appears in exactly one sidebar.
 */
export function buildMeta(entries: readonly ComponentEntry[], section: Section) {
  const groups = section.groups as readonly string[];
  const inSection = entries.filter((entry) => groups.includes(entry.group));
  const pages: string[] = [];

  for (const category of categories) {
    const inCategory = inSection.filter(
      (entry) =>
        entry.group === config.fallbackGroup && entry.categoryType === category.type,
    );
    if (inCategory.length === 0) continue;

    pages.push(`---${category.label}---`);
    pages.push(...inCategory.map((entry) => entry.name));
  }

  for (const group of config.groups) {
    if (!groups.includes(group.id)) continue;

    const inGroup = inSection.filter((entry) => entry.group === group.id);
    if (inGroup.length === 0) continue;

    pages.push(`---${group.label}---`);
    pages.push(...inGroup.map((entry) => entry.name));
  }

  return `${JSON.stringify({ ...section.meta, pages }, null, 2)}\n`;
}

const BANNER = `// AUTO-GENERATED by \`bun run components:sync\` — do not edit.
// Source of truth: the \`category\` front matter in content/components/*.mdx.
`;

export function buildGenerated(entries: readonly ComponentEntry[]) {
  const rows = entries
    .map((entry) =>
      [
        "  {",
        `    categoryType: ${JSON.stringify(entry.categoryType)},`,
        `    name: ${JSON.stringify(entry.name)},`,
        `    title: ${JSON.stringify(entry.title)},`,
        `    description: ${JSON.stringify(entry.description)},`,
        `    icon: ${JSON.stringify(entry.icon)},`,
        `    hoverVideo: ${entry.hoverVideo ? JSON.stringify(entry.hoverVideo) : "null"},`,
        `    previewVideo: ${entry.previewVideo ? JSON.stringify(entry.previewVideo) : "null"},`,
        `    hoverAspect: ${entry.hoverAspect ?? "null"},`,
        `    group: ${JSON.stringify(entry.group)},`,
        `    lastModified: ${JSON.stringify(entry.lastModified)},`,
        `    href: ${JSON.stringify(`/${sectionForGroup(entry.group).dir}/${entry.name}`)},`,
        "  },",
      ].join("\n"),
    )
    .join("\n");

  const counts = categories
    .map(
      (category) =>
        `//   ${category.label.padEnd(20)} ${String(
          entries.filter((entry) => entry.categoryType === category.type).length,
        ).padStart(3)}`,
    )
    .join("\n");

  const groupCounts = [
    { id: config.fallbackGroup, label: "Components" },
    ...config.groups.map((group) => ({ id: group.id, label: group.label })),
  ]
    .map(
      (group) =>
        `//   ${group.label.padEnd(20)} ${String(
          entries.filter((entry) => entry.group === group.id).length,
        ).padStart(3)}`,
    )
    .join("\n");

  return `${BANNER}//
// ${entries.length} components, by docs section
${counts}
//
// by catalogue
${groupCounts}

export const componentCategories = [
${categories
  .map(
    (category) =>
      `  { type: ${JSON.stringify(category.type)}, label: ${JSON.stringify(category.label)} },`,
  )
  .join("\n")}
] as const;

export type ComponentCategoryType = (typeof componentCategories)[number]["type"];

/** The catalogues, and where each one browses. */
export const componentGroups = [
${[
  `  { id: ${JSON.stringify(config.fallbackGroup)}, label: "Components", href: "/components-preview" },`,
  ...config.groups.map(
    (group) =>
      `  { id: ${JSON.stringify(group.id)}, label: ${JSON.stringify(group.label)}, href: ${JSON.stringify(group.href)} },`,
  ),
].join("\n")}
] as const;

export type ComponentGroup = (typeof componentGroups)[number]["id"];

export interface GeneratedComponent {
  /** Which docs section the component sits under. */
  categoryType: ComponentCategoryType;
  /** Slug — the .mdx file name, and the key used everywhere else. */
  name: string;
  title: string;
  description: string;
  /** lucide icon name, as used by the docs sidebar. */
  icon: string;
  /** Short loop a card plays on hover. Null when none has been recorded. */
  hoverVideo: string | null;
  /** The full demo shown on the component's own page. */
  previewVideo: string | null;
  /** width ÷ height of the hover clip. Null when no clip has been measured. */
  hoverAspect: number | null;
  /**
   * Which catalogue the component browses on, read off its folder under
   * src/components — "piece" for the finished objects in pieces/, "chart" for
   * charts/, "primitive" for primitives/, "component" for everything else.
   * Each has its own page.
   */
  group: ComponentGroup;
  lastModified: string;
  href: string;
}

export const components = [
${rows}
] as const satisfies readonly GeneratedComponent[];

export type ComponentName = (typeof components)[number]["name"];

const byName = new Map(components.map((component) => [component.name, component]));

export function getComponent(name: string): GeneratedComponent | undefined {
  return byName.get(name as ComponentName);
}

export function componentsIn(
  categoryType: ComponentCategoryType,
): readonly GeneratedComponent[] {
  return components.filter((component) => component.categoryType === categoryType);
}

/** Each catalogue, pre-filtered — one per browsing page. */
export function componentsInGroup(group: ComponentGroup): readonly GeneratedComponent[] {
  return components.filter((component) => component.group === group);
}

export const uiComponents = componentsInGroup("component");
${config.groups
  .map(
    (group) =>
      `export const ${group.dir} = componentsInGroup(${JSON.stringify(group.id)});`,
  )
  .join("\n")}

/** Components that still need a clip recorded, by slot. */
export const missingHoverVideo = components.filter((c) => c.hoverVideo === null);
export const missingPreviewVideo = components.filter((c) => c.previewVideo === null);
`;
}

export { categories, labelFor };
