import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const SITE_DIR = join(SCRIPT_DIR, "..", "..");

/**
 * The docs sidebar sections, in the order they appear. `type` is what lands in
 * the generated TypeScript as `categoryType`; `label` is what fumadocs renders
 * as a `---Separator---` in meta.json.
 */
export const categories = [
  { type: "shaders", label: "Shaders" },
  { type: "texts", label: "Texts" },
  { type: "micro-interactions", label: "Micro Interactions" },
  { type: "primitives", label: "Primitives" },
  { type: "charts", label: "Charts" },
  { type: "components", label: "Components" },
] as const;

export type CategoryType = (typeof categories)[number]["type"];

export const categoryTypes = categories.map((category) => category.type);

/** Where a component with no declared category ends up. */
export const fallbackCategory: CategoryType = "components";

export const config = {
  siteDir: SITE_DIR,

  /** The .mdx pages — one per component, and the source of truth. */
  contentDir: join(SITE_DIR, "content", "components"),

  /** Generated: the fumadocs sidebar. */
  metaPath: join(SITE_DIR, "content", "components", "meta.json"),

  /**
   * The docs sections, each a folder under `content/` with its own sidebar.
   *
   * A section is a URL prefix and a page tree; a catalogue is what kind of
   * thing a component is. They line up one-to-one for primitives, which get
   * their own section because their pages are read differently — you arrive
   * knowing which primitive you need, and the docs are the destination rather
   * than a caption under a recording. The rest share the components section.
   *
   * `groups` names the catalogues a section holds, so a component moving
   * between folders under `src/components` moves its page between sections.
   */
  sections: [
    {
      id: "components",
      dir: "components",
      groups: ["component", "piece", "chart"],
      meta: {
        title: "Components",
        description: "Beautiful, animated UI components built with React Native",
        icon: "LayoutGrid",
        root: true,
      },
    },
    {
      id: "primitives",
      dir: "primitives",
      groups: ["primitive"],
      meta: {
        title: "Primitives",
        description:
          "The plain interface furniture — switches, tabs, lists, dialogs and alerts",
        icon: "ToggleLeft",
        root: true,
      },
    },
  ],

  /** Generated: the typed registry every other part of the site reads. */
  generatedPath: join(SITE_DIR, "src", "lib", "components.generated.ts"),

  /** Copied onto meta.json verbatim. */
  meta: {
    title: "Components",
    description: "Beautiful, animated UI components built with React Native",
    icon: "LayoutGrid",
    root: true,
  },

  /** The frontmatter key that carries the category. */
  categoryKey: "category",

  /** `category:` is inserted directly after this key when backfilling. */
  insertAfterKey: "title",

  /**
   * The two videos a component page carries.
   *
   * `hoverVideo` is the short loop a card plays while pointed at; it comes from
   * the landing-asset bucket, which is where those clips already live.
   * `previewVideo` is the full demo shown on the page itself, and is whatever
   * the page's original `video:` pointed at.
   */
  videoKeys: {
    hover: "hoverVideo",
    preview: "previewVideo",
  },

  /** The pre-split key that `previewVideo` inherits from. */
  legacyVideoKey: "video",

  /** The video keys are inserted after this one, as the scaffolder writes them. */
  videoInsertAfterKey: "description",

  /** Where the source directories live, relative to the repo root. */
  sourceDirs: {
    core: "src/components",
    examples: "app/components",
  },

  /**
   * The catalogues, keyed by the folder directly under `sourceDirs.core`.
   *
   * Not everything in the library is the same kind of thing. A piece is a
   * finished object — a ticket, a receipt. A chart is a data surface. A
   * primitive is the plain interface furniture other components are built from.
   * Filing all four into one grid of 130 cards buried the distinction, so each
   * browses on its own page, and the folder a component lives in decides which.
   * Reading it off the tree rather than out of front matter means moving a
   * component is the whole change.
   */
  groups: [
    { id: "piece", dir: "pieces", label: "Pieces", href: "/pieces-preview" },
    { id: "chart", dir: "charts", label: "Charts", href: "/charts" },
    { id: "primitive", dir: "primitives", label: "Primitives", href: "/primitives" },
  ],

  /** Where everything that is in none of those folders ends up. */
  fallbackGroup: "component",

  /**
   * Folders whose components always sit in a matching docs section.
   *
   * `charts/` and `primitives/` are categories in their own right, so the
   * category and the folder cannot disagree — the CLI writes the folder's
   * answer into the front matter rather than reporting a conflict nobody would
   * want resolved the other way.
   */
  categoryByDir: {
    charts: "charts",
    primitives: "primitives",
  } as Record<string, CategoryType | undefined>,

  /**
   * The transparent page previews, pushed by `bun run previews:sync`.
   *
   * A component has one exactly when a master recording sits in `masterDir`,
   * so the scaffolder derives the URL rather than asking anyone to paste it —
   * the same way `hoverVideo` follows the landing-asset bucket.
   */
  previews: {
    origin: "https://pub-364cfe31d5bf415e989f772c3ea4bbaf.r2.dev",
    masterDir: "cloudflare/v2-preview",
    suffix: "-preview",
  },
} as const;

export function labelFor(type: CategoryType) {
  return categories.find((category) => category.type === type)!.label;
}

export type GroupId = (typeof config.groups)[number]["id"] | typeof config.fallbackGroup;

export type SectionId = (typeof config.sections)[number]["id"];

export type Section = (typeof config.sections)[number];

/** Absolute path to a section's content folder. */
export function contentDirFor(section: Section) {
  return join(SITE_DIR, "content", section.dir);
}

/** Absolute path to a section's generated meta.json. */
export function metaPathFor(section: Section) {
  return join(contentDirFor(section), "meta.json");
}

/** The section a catalogue's pages live in, and the first segment of their URL. */
export function sectionForGroup(group: GroupId): Section {
  return (
    config.sections.find((section) =>
      (section.groups as readonly string[]).includes(group),
    ) ?? config.sections[0]
  );
}
