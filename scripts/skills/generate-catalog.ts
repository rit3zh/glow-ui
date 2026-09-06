/**
 * generate-catalog.ts
 * -----------------------------------------------------------------------------
 * Regenerates `skills/using-reacticx/references/components.md` — the catalog an
 * agent reads before adding a component.
 *
 * Every field is derived, never hand-written:
 *   • name, category and CLI key      → registry.json
 *   • title and description           → the frontmatter of the docs page in
 *                                       website/content/{components,primitives,templates}
 *   • npm dependencies                → the imports in src/components/<path>
 *   • internal component dependencies → the `@/components/...` imports
 *   • docs URL                        → the section a page sits in under
 *                                       website/content, mapped to its route
 *
 * The site in `website/` is the source of truth, not whatever is deployed — a
 * page written here is linked here, whether or not it has shipped yet.
 *
 * Usage:
 *   bun scripts/skills/generate-catalog.ts        # write the catalog
 *   bun scripts/skills/generate-catalog.ts --dry  # print a summary, write nothing
 * -----------------------------------------------------------------------------
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dir, "../..");
const REGISTRY = path.join(ROOT, "registry.json");
const COMPONENTS_DIR = path.join(ROOT, "src/components");
const CONTENT_DIR = path.join(ROOT, "website/content");
const OUTPUT = path.join(
  ROOT,
  "skills/using-reacticx/references/components.md",
);

const SITE = "https://reacticx.com";

/** Each content folder is its own route segment — see website/src/app. */
const DOC_SECTIONS = ["components", "primitives", "templates"] as const;

const PROVIDED = new Set(["react", "react-dom", "react-native", "expo"]);

const SPECIFIER =
  /(?:from\s+|import\s+|require\s*\(\s*|import\s*\(\s*)(["'])([^"']+)\1/g;

interface ComponentInfo {
  name: string;
  category: string;
  path: string;
  files: string[];
}

interface Registry {
  version: string;
  totalComponents: number;
  categories: string[];
  components: Record<string, ComponentInfo>;
}

interface DocPage {
  slug: string;
  section: (typeof DOC_SECTIONS)[number];
  title?: string;
  description?: string;
}

interface Entry extends ComponentInfo {
  title: string;
  description?: string;
  packages: string[];
  uses: string[];
  docs?: string;
}

const flags = new Set(process.argv.slice(2));
const dry = flags.has("--dry");

function docsUrl(page: DocPage) {
  return `${SITE}/${page.section}/${page.slug}`;
}

/* ── docs frontmatter ─────────────────────────────────────────────────────── */

function readFrontmatter(file: string) {
  const source = fs.readFileSync(file, "utf8");
  const match = /^---\n([\s\S]*?)\n---/.exec(source);
  if (!match) return {};

  const fields: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!pair) continue;
    fields[pair[1]!] = pair[2]!.trim().replace(/^["'](.*)["']$/, "$1");
  }
  return fields;
}

function loadDocs(): Map<string, DocPage> {
  const pages = new Map<string, DocPage>();

  for (const section of DOC_SECTIONS) {
    const dir = path.join(CONTENT_DIR, section);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;

      const slug = file.slice(0, -4);
      const fields = readFrontmatter(path.join(dir, file));

      // Registry names are not always cased like their docs page.
      pages.set(slug.toLowerCase(), {
        slug,
        section,
        title: fields.title,
        description: fields.description,
      });
    }
  }

  return pages;
}

/* ── dependencies ─────────────────────────────────────────────────────────── */

function sourceFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [full] : [];
  });
}

function packageFor(specifier: string): string | null {
  if (/^[./~]|^@\/|^node:/.test(specifier)) return null;

  const parts = specifier.split("/");
  const name = specifier.startsWith("@")
    ? parts.slice(0, 2).join("/")
    : parts[0]!;

  return name && !PROVIDED.has(name) ? name : null;
}

function dependenciesOf(component: ComponentInfo, registry: Registry) {
  const packages = new Set<string>();
  const uses = new Set<string>();
  const dir = path.join(ROOT, component.path);

  for (const file of sourceFiles(dir)) {
    const source = fs.readFileSync(file, "utf8");

    for (const match of source.matchAll(SPECIFIER)) {
      const specifier = match[2]!;

      const pkg = packageFor(specifier);
      if (pkg) {
        packages.add(pkg);
        continue;
      }

      if (!specifier.startsWith("@/components/")) continue;

      const target = `src/${specifier.slice(2)}`;
      let best: ComponentInfo | null = null;
      for (const candidate of Object.values(registry.components)) {
        if (
          candidate.name !== component.name &&
          (target === candidate.path || target.startsWith(`${candidate.path}/`)) &&
          (!best || candidate.path.length > best.path.length)
        ) {
          best = candidate;
        }
      }
      if (best) uses.add(best.name);
    }
  }

  return {
    packages: [...packages].sort(),
    uses: [...uses].sort(),
  };
}

/* ── rendering ────────────────────────────────────────────────────────────── */

const CATEGORY_BLURB: Record<string, string> = {
  atoms: "The smallest building blocks — one element, one job.",
  base: "Foundational inputs and surfaces most screens end up using.",
  blocks: "Composed sections you drop into a screen whole.",
  charts: "Data visualisation, Skia-backed.",
  "micro-interactions": "Small motion pieces that make a screen feel alive.",
  molecules: "A handful of atoms wired together into something useful.",
  organisms: "Large, self-contained pieces with their own state and gestures.",
  pieces: "Decorative and structural fragments.",
  primitives: "Unstyled behaviour you compose your own look on top of.",
  screens: "Whole screens, ready to route to.",
  templates: "Full flows — several screens' worth of layout in one component.",
};

/** The packages the catalog leans on hardest, most-used first. */
function popular(entries: Entry[], limit = 15): [string, number][] {
  const counts = new Map<string, number>();

  for (const entry of entries) {
    for (const name of entry.packages) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort(([a, one], [b, two]) => two - one || a.localeCompare(b))
    .slice(0, limit);
}

function render(entries: Entry[], registry: Registry) {
  const byCategory = new Map<string, Entry[]>();
  for (const entry of entries) {
    const bucket = byCategory.get(entry.category) ?? [];
    bucket.push(entry);
    byCategory.set(entry.category, bucket);
  }

  const categories = [...byCategory.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  );

  const lines: string[] = [
    "# Reacticx component catalog",
    "",
    "<!-- Generated by scripts/skills/generate-catalog.ts — do not edit by hand. -->",
    "",
    `Registry version ${registry.version} · ${registry.totalComponents} components · source https://github.com/rit3zh/reacticx`,
    "",
    "Every entry lists the CLI key — the name `reacticx add` and the MCP",
    "`add_components` tool both take. **Dependencies** are the npm packages the",
    "component's own source imports; **uses** are other registry components that",
    "come along automatically unless you turn dependency following off.",
    "",
    "```bash",
    "npx reacticx add <cli-key>",
    "```",
    "",
    "## Categories",
    "",
    "| Category | Components |",
    "| --- | --- |",
    ...categories.map(
      ([category, bucket]) =>
        `| \`${category}\` | ${bucket.length} — ${CATEGORY_BLURB[category] ?? ""} |`,
    ),
    "",
    "## Dependencies you will meet",
    "",
    "How often each package is imported across the catalog — install with",
    "`npx expo install <package>` so the versions match your Expo SDK.",
    "",
    "| Package | Components using it |",
    "| --- | --- |",
    ...popular(entries).map(
      ([name, count]) => `| \`${name}\` | ${count} |`,
    ),
    "",
    "Two of these catch people out:",
    "",
    "- `react-native-worklets` is a **separate install** from",
    "  `react-native-reanimated` (Reanimated 4 moved worklets out).",
    "- `@sbaiahmed1/react-native-blur` is a scoped npm package — not the",
    "  unscoped `react-native-blur`, which is a different library.",
    "",
    "> After adding any **native** dependency, rebuild the native target",
    "> (`npx expo run:ios`). Restarting Metro is not enough.",
    "",
  ];

  for (const [category, bucket] of categories) {
    lines.push(
      "---",
      "",
      `## ${category} (${bucket.length})`,
      "",
      ...(CATEGORY_BLURB[category] ? [CATEGORY_BLURB[category]!, ""] : []),
    );

    for (const entry of bucket.sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(
        `### \`${entry.name}\``,
        "",
        entry.description ??
          "No docs page yet — read the source before using it.",
        "",
        `- **CLI key:** \`${entry.name}\``,
        `- **Files:** ${entry.files.map((file) => `\`${file}\``).join(", ") || "—"}`,
        `- **Dependencies:** ${
          entry.packages.length > 0
            ? entry.packages.map((name) => `\`${name}\``).join(", ")
            : "none beyond React Native"
        }`,
        ...(entry.uses.length > 0
          ? [`- **Uses:** ${entry.uses.map((name) => `\`${name}\``).join(", ")}`]
          : []),
        ...(entry.docs ? [`- **Docs:** ${entry.docs}`] : []),
        "",
      );
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

/* ── main ─────────────────────────────────────────────────────────────────── */

const registry: Registry = JSON.parse(fs.readFileSync(REGISTRY, "utf8"));
const docs = loadDocs();

const entries: Entry[] = Object.values(registry.components).map((component) => {
  const page = docs.get(component.name.toLowerCase());
  const { packages, uses } = dependenciesOf(component, registry);

  return {
    ...component,
    title: page?.title ?? component.name,
    description: page?.description,
    packages,
    uses,
    docs: page ? docsUrl(page) : undefined,
  };
});

const documented = entries.filter((entry) => entry.description).length;
const linked = entries.filter((entry) => entry.docs).length;

process.stdout.write(
  `${entries.length} components · ${documented} described · ${linked} with a docs page\n`,
);

if (dry) {
  process.stdout.write(`dry run — ${OUTPUT} left alone\n`);
} else {
  fs.writeFileSync(OUTPUT, render(entries, registry), "utf8");
  process.stdout.write(`wrote ${path.relative(ROOT, OUTPUT)}\n`);
}
