/**
 * sync-components.ts
 * -----------------------------------------------------------------------------
 * Watches `src/components` (and every folder inside it) and keeps the Expo
 * Router demo layout in sync with the component library.
 *
 * What it does on every change:
 *   1. Scans `src/components/<category>/<component>` for real components, plus
 *      `src/components/blocks/<group>/<variant>.tsx` for blocks.
 *   2. Scaffolds a demo screen at `app/components/<name>/index.tsx` for any
 *      component that doesn't have one yet (existing screens are never touched).
 *   3. Builds an array of Expo Router "route commands" (the `<Stack.Screen>`
 *      entries) via `generateRouteCommands()`.
 *   4. Regenerates the marked block in `app/_layout.tsx`.
 *   5. Writes `app/components/routes.generated.ts` (the array as data).
 *
 * Usage:
 *   bun scripts/sync-components.ts             # watch mode (default)
 *   bun scripts/sync-components.ts --once       # single scan + sync, then exit
 *   bun scripts/sync-components.ts --dry        # print what would change, write nothing
 *   bun scripts/sync-components.ts --no-scaffold # skip screen creation, only sync layout/data
 * -----------------------------------------------------------------------------
 */

import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "src/components");
const APP_DIR = path.join(ROOT, "app");
const APP_COMPONENTS_DIR = path.join(APP_DIR, "components");
const LAYOUT_FILE = path.join(APP_DIR, "_layout.tsx");
const GENERATED_FILE = path.join(APP_COMPONENTS_DIR, "routes.generated.ts");

// Categories that live directly under `src/components`.
const CATEGORIES = [
  "ai",
  "atoms",
  "base",
  "charts",
  "micro-interactions",
  "molecules",
  "organisms",
  "pieces",
  "primitives",
  "screens",
  "templates",
];

// Blocks are shaped differently from the categories above:
// `src/components/blocks/<group>/<variant>.tsx` — each variant file is a
// standalone screen rather than a folder holding a configurable component.
const BLOCKS_CATEGORY = "blocks";
const BLOCKS_DIR = path.join(COMPONENTS_DIR, BLOCKS_CATEGORY);

// Markers delimiting the auto-managed block inside `app/_layout.tsx`.
const BLOCK_START = "{/* @generated:component-routes:start */}";
const BLOCK_END = "{/* @generated:component-routes:end */}";

const WATCH = !process.argv.includes("--once");
const DRY = process.argv.includes("--dry");
const SCAFFOLD = !process.argv.includes("--no-scaffold");
const DEBOUNCE_MS = 150;

/* ------------------------------------------------------------------ naming */

function toPascal(kebab: string): string {
  const parts = kebab.split(/[-_ ]+/).filter(Boolean);

  // An identifier cannot start with a digit, so a leading numeric segment moves
  // to the end: "3d-carousel" -> "Carousel3D".
  while (parts.length > 1 && /^\d/.test(parts[0])) {
    parts.push(parts.shift()!);
  }

  return parts
    .map((s) =>
      /^\d/.test(s) ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1),
    )
    .join("");
}

function toCamel(kebab: string): string {
  const pascal = toPascal(kebab);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function toTitle(kebab: string): string {
  return kebab
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((s) =>
      /^\d/.test(s) ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1),
    )
    .join(" ");
}

/* ------------------------------------------------------------------- types */

export type ComponentInfo = {
  /** kebab folder name, e.g. "button" */
  name: string;
  /** parent category, e.g. "base" */
  category: string;
  /** absolute path of the component folder in src/components */
  sourceDir: string;
  /** path relative to repo root */
  relativeSource: string;
};

export type RouteCommand = {
  /** Expo Router screen name, e.g. "components/button" */
  name: string;
  /** component folder name, e.g. "button" */
  component: string;
  /** category the component belongs to, e.g. "base" */
  category: string;
  /** "Button" */
  pascalName: string;
  /** "button" */
  camelName: string;
  /** "Button" — human readable title */
  title: string;
  /** demo screen path relative to root, e.g. "app/components/button" */
  screenPath: string;
  /** module specifier of the source, e.g. "@/components/base/button" */
  importPath: string;
  /** whether a matching Expo Router demo screen actually exists */
  hasScreen: boolean;
};

/* -------------------------------------------------------------------- scan */

const MAIN_FILE_HINTS = ["index.tsx", "index.ts"];

/** A folder is a component if it holds a main file (index.tsx / <Name>.tsx). */
function isComponentFolder(dir: string, name: string): boolean {
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return false;
  }
  const pascal = toPascal(name);
  const candidates = new Set([
    ...MAIN_FILE_HINTS,
    `${name}.tsx`,
    `${pascal}.tsx`,
  ]);
  return entries.some((f) => candidates.has(f));
}

/** Scan `src/components/<category>/*` and return every real component. */
export function scanComponents(): ComponentInfo[] {
  const found: ComponentInfo[] = [];
  for (const category of CATEGORIES) {
    const categoryDir = path.join(COMPONENTS_DIR, category);
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(categoryDir, { withFileTypes: true });
    } catch {
      continue; // category folder may not exist yet
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const sourceDir = path.join(categoryDir, entry.name);
      if (!isComponentFolder(sourceDir, entry.name)) continue;
      const name = toKebab(entry.name);
      found.push({
        name,
        category,
        sourceDir,
        relativeSource: path.relative(ROOT, sourceDir),
      });
    }
  }
  found.push(...scanBlocks());
  // De-dupe by component name (same name across categories → keep first).
  const seen = new Set<string>();
  return found
    .filter((c) => (seen.has(c.name) ? false : (seen.add(c.name), true)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Scan `src/components/blocks/<group>/*` — one entry per variant. A variant is
 * either a single `<variant>.tsx` file or a `<variant>/` folder holding a main
 * file, so a variant with its own `types.ts` / `const.ts` can keep them together.
 */
function scanBlocks(): ComponentInfo[] {
  const found: ComponentInfo[] = [];
  let groups: fs.Dirent[];
  try {
    groups = fs.readdirSync(BLOCKS_DIR, { withFileTypes: true });
  } catch {
    return found; // no blocks yet
  }
  for (const group of groups) {
    if (!group.isDirectory()) continue;
    const groupDir = path.join(BLOCKS_DIR, group.name);
    for (const entry of fs.readdirSync(groupDir, { withFileTypes: true })) {
      const source = path.join(groupDir, entry.name);
      let base: string;

      if (entry.isDirectory()) {
        if (!isComponentFolder(source, entry.name)) continue;
        base = entry.name;
      } else {
        if (!entry.name.endsWith(".tsx")) continue;
        base = entry.name.slice(0, -".tsx".length);
        if (base === "index") continue; // barrel, not a variant
      }

      found.push({
        name: toKebab(base),
        category: BLOCKS_CATEGORY,
        sourceDir: source,
        relativeSource: path.relative(ROOT, source),
      });
    }
  }
  return found;
}

/**
 * "src/components/blocks/bottom-sheet/airbnb-v1.tsx" → "@/components/blocks/bottom-sheet/airbnb-v1"
 * "src/components/blocks/bottom-sheet/airbnb-v1"     → "@/components/blocks/bottom-sheet/airbnb-v1"
 */
function toImportPath(relativeSource: string): string {
  return `@/${relativeSource.replace(/^src\//, "").replace(/\.tsx?$/, "")}`;
}

/** Does an Expo Router demo screen exist for this component? */
function demoScreenExists(name: string): boolean {
  const asFolder = path.join(APP_COMPONENTS_DIR, name, "index.tsx");
  const asFile = path.join(APP_COMPONENTS_DIR, `${name}.tsx`);
  return fs.existsSync(asFolder) || fs.existsSync(asFile);
}

/* ---------------------------------------------------------- prune: barrels */

/**
 * Each category owns a hand-maintained barrel `src/components/<category>/index.ts`
 * with lines like `export * from "./gradient-blur";`. When a component folder is
 * deleted the export line survives and the Metro bundler blows up with
 * "Unable to resolve …". This prunes every export line whose referenced folder
 * no longer exists on disk.
 *
 * The first path segment after `./` is treated as the component folder, e.g.
 * `./action-card/children/ActionCardTitle` → `action-card`.
 * Returns the list of removed export paths (for logging).
 */
function pruneBarrels(): string[] {
  const removed: string[] = [];
  const EXPORT_RE = /^\s*export\s+.*from\s+["'](\.\/[^"']+)["'];?\s*$/;

  for (const category of CATEGORIES) {
    const barrel = path.join(COMPONENTS_DIR, category, "index.ts");
    let source: string;
    try {
      source = fs.readFileSync(barrel, "utf8");
    } catch {
      continue; // category has no barrel
    }
    const categoryDir = path.join(COMPONENTS_DIR, category);

    const lines = source.split("\n");
    const kept: string[] = [];
    let changed = false;

    for (const line of lines) {
      const m = line.match(EXPORT_RE);
      if (!m) {
        kept.push(line);
        continue;
      }
      // "./gradient-blur/index" → "gradient-blur"
      const folder = m[1].replace(/^\.\//, "").split("/")[0];
      if (fs.existsSync(path.join(categoryDir, folder))) {
        kept.push(line);
      } else {
        removed.push(`${category}/${m[1]}`);
        changed = true;
      }
    }

    if (changed && !DRY) {
      fs.writeFileSync(barrel, kept.join("\n"));
    }
  }
  return removed;
}

/* ----------------------------------------------- prune: orphan demo screens */

/**
 * Remove `app/components/<name>` demo screens whose source component no longer
 * exists in `src/components`. Once the screen is gone `writeLayout` drops its
 * `<Stack.Screen>` entry on the same pass (it only registers existing screens).
 * Returns the list of removed screen names.
 */
function pruneOrphanScreens(validNames: Set<string>): string[] {
  const removed: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(APP_COMPONENTS_DIR, { withFileTypes: true });
  } catch {
    return removed;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = toKebab(entry.name);
    if (validNames.has(name)) continue;
    removed.push(name);
    if (!DRY) {
      fs.rmSync(path.join(APP_COMPONENTS_DIR, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }
  return removed;
}

/* --------------------------------------------------- the command generator */

/**
 * Turn scanned components into the array of Expo Router route commands.
 * This is the single source of truth consumed by both the layout writer and
 * the generated data file.
 */
export function generateRouteCommands(
  components: ComponentInfo[] = scanComponents(),
): RouteCommand[] {
  return components.map((c) => ({
    name: `components/${c.name}`,
    component: c.name,
    category: c.category,
    pascalName: toPascal(c.name),
    camelName: toCamel(c.name),
    title: toTitle(c.name),
    screenPath: `app/components/${c.name}`,
    importPath: toImportPath(c.relativeSource),
    hasScreen: demoScreenExists(c.name),
  }));
}

/* ----------------------------------------------------- scaffold: template */

/**
 * Template for a fresh demo screen. Variables:
 *   {{pascalCase}}  →  Button
 *   {{camelCase}}   →  button
 *   {{kebabCase}}   →  button
 *   {{title}}       →  Button
 * Kept intentionally self-contained so mass-generated screens always compile;
 * drop the real component in where the TODO is.
 */
const SCREEN_TEMPLATE = `import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: import and render the {{pascalCase}} component.
// import { {{pascalCase}} } from "@/components";

export default function {{pascalCase}}Screen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{{title}}</Text>
        <View style={styles.demo}>
          {/* <{{pascalCase}} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  content: { padding: 16, gap: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  demo: { gap: 12 },
});
`;

/**
 * Template for a block demo screen. A block is a complete, self-contained
 * screen rather than a configurable component, so the demo just renders it.
 * Extra variable: {{importPath}} → @/components/blocks/bottom-sheet/airbnb-v1
 */
const BLOCK_SCREEN_TEMPLATE = `import React from "react";

import {{pascalCase}} from "{{importPath}}";

export default function {{pascalCase}}Screen() {
  return <{{pascalCase}} />;
}
`;

function renderTemplate(cmd: RouteCommand): string {
  const template =
    cmd.category === BLOCKS_CATEGORY ? BLOCK_SCREEN_TEMPLATE : SCREEN_TEMPLATE;
  return template
    .replace(/\{\{importPath\}\}/g, cmd.importPath)
    .replace(/\{\{pascalCase\}\}/g, cmd.pascalName)
    .replace(/\{\{camelCase\}\}/g, cmd.camelName)
    .replace(/\{\{kebabCase\}\}/g, cmd.component)
    .replace(/\{\{title\}\}/g, cmd.title);
}

/**
 * Create `app/components/<name>/index.tsx` for every command missing a screen.
 * Existing screens are never overwritten. Mutates `hasScreen` on created
 * commands so they get registered in the layout in the same pass.
 * Returns the list of created component names.
 */
async function scaffoldMissingScreens(
  commands: RouteCommand[],
): Promise<string[]> {
  const created: string[] = [];
  for (const cmd of commands) {
    if (cmd.hasScreen) continue;
    const dir = path.join(APP_COMPONENTS_DIR, cmd.component);
    const file = path.join(dir, "index.tsx");
    created.push(cmd.component);
    cmd.hasScreen = true; // will exist after this pass → register it
    if (DRY) continue;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, await format(renderTemplate(cmd), file));
  }
  return created;
}

/* ------------------------------------------------------------- prettier fmt */

async function format(source: string, filepath: string): Promise<string> {
  try {
    const prettier = await import("prettier");
    const config = (await prettier.resolveConfig(filepath)) ?? {};
    return prettier.format(source, { ...config, filepath });
  } catch {
    return source; // prettier is best-effort
  }
}

/* --------------------------------------------------------- write: layout */

function ensureBlockMarkers(layout: string): string {
  const hasStart = layout.includes(BLOCK_START);
  const hasEnd = layout.includes(BLOCK_END);
  // A well-formed managed block needs BOTH markers; if only one survived (e.g.
  // the end marker got deleted while hand-editing) the block can never be
  // rewritten and the screen list silently drifts. Rebuild it from scratch.
  if (hasStart && hasEnd) return layout;

  const closing = "</Stack>";
  const idx = layout.lastIndexOf(closing);
  if (idx === -1) {
    throw new Error(`Could not find </Stack> in ${LAYOUT_FILE}`);
  }

  // Drop an orphaned start marker plus any stale generated entries after it, so
  // the region between the markers is empty and ready to be repopulated.
  let head = layout.slice(0, idx);
  if (hasStart) head = head.slice(0, head.indexOf(BLOCK_START));

  const block = `  ${BLOCK_START}\n          ${BLOCK_END}\n        `;
  return head + block + layout.slice(idx);
}

/** Rewrite the `<Stack.Screen>` block for component demo routes. */
async function writeLayout(commands: RouteCommand[]): Promise<boolean> {
  let layout: string;
  try {
    layout = fs.readFileSync(LAYOUT_FILE, "utf8");
  } catch {
    console.warn(`⚠ layout not found: ${path.relative(ROOT, LAYOUT_FILE)}`);
    return false;
  }
  layout = ensureBlockMarkers(layout);

  // Only register screens that actually exist to avoid Expo Router warnings.
  // Each demo lives at `app/<name>/index.tsx`, so its Expo Router screen id is
  // `<name>/index` — the `<Stack.Screen name>` must match that exactly or Expo
  // Router warns "No route named … exists in nested children".
  const entries = commands
    .filter((c) => c.hasScreen)
    .map((c) => `          <Stack.Screen name="${c.name}/index" />`)
    .join("\n");

  const start = layout.indexOf(BLOCK_START);
  const end = layout.indexOf(BLOCK_END);
  if (start === -1 || end === -1 || end < start) return false;

  const replacement = `${BLOCK_START}\n${entries}${entries ? "\n" : ""}          ${BLOCK_END}`;
  const next =
    layout.slice(0, start) + replacement + layout.slice(end + BLOCK_END.length);

  const formatted = await format(next, LAYOUT_FILE);
  if (formatted === fs.readFileSync(LAYOUT_FILE, "utf8")) return false;
  if (DRY) return true;
  fs.writeFileSync(LAYOUT_FILE, formatted);
  return true;
}

/* ------------------------------------------------- write: generated data */

async function writeGeneratedFile(commands: RouteCommand[]): Promise<boolean> {
  const rows = commands
    .map(
      (c) =>
        `  { name: ${JSON.stringify(c.name)}, component: ${JSON.stringify(
          c.component,
        )}, category: ${JSON.stringify(c.category)}, title: ${JSON.stringify(
          c.title,
        )}, path: ${JSON.stringify(c.screenPath)}, hasScreen: ${c.hasScreen} },`,
    )
    .join("\n");

  const source = `// AUTO-GENERATED by scripts/sync-components.ts — do not edit by hand.
// Run \`bun run sync:components\` to regenerate.

export type ComponentRoute = {
  /** Expo Router screen name, e.g. "components/button" */
  name: string;
  component: string;
  category: string;
  title: string;
  path: string;
  hasScreen: boolean;
};

export const COMPONENT_ROUTES: ComponentRoute[] = [
${rows}
];

export default COMPONENT_ROUTES;
`;

  const formatted = await format(source, GENERATED_FILE);
  const current = fs.existsSync(GENERATED_FILE)
    ? fs.readFileSync(GENERATED_FILE, "utf8")
    : "";
  if (formatted === current) return false;
  if (DRY) return true;
  fs.writeFileSync(GENERATED_FILE, formatted);
  return true;
}

/* -------------------------------------------------------------------- sync */

async function sync(): Promise<void> {
  const t0 = Date.now();

  // Prune deleted components first so the bundler never sees dangling exports.
  const prunedExports = pruneBarrels();

  const components = scanComponents();
  const validNames = new Set(components.map((c) => c.name));
  const removedScreens = pruneOrphanScreens(validNames);

  const commands = generateRouteCommands(components);

  const created = SCAFFOLD ? await scaffoldMissingScreens(commands) : [];
  const registered = commands.filter((c) => c.hasScreen).length;

  const layoutChanged = await writeLayout(commands);
  const dataChanged = await writeGeneratedFile(commands);

  const dim = (s: string) => `\x1b[2m${s}\x1b[22m`;
  const green = (s: string) => `\x1b[32m${s}\x1b[39m`;
  const parts: string[] = [`${components.length} components`, `${registered} screens`];
  if (created.length) parts.push(`+${created.length}`);
  if (prunedExports.length) parts.push(`-${prunedExports.length} exports`);
  if (removedScreens.length) parts.push(`-${removedScreens.length} screens`);
  if (layoutChanged) parts.push("layout");
  if (dataChanged) parts.push("routes");
  const tag = DRY ? " [dry]" : "";
  console.log(`${green("✔")}${tag} ${parts.join(" · ")} ${dim(`(${Date.now() - t0}ms)`)}`);
  if (created.length && created.length <= 5) {
    console.log(`  ${created.join(", ")}`);
  }
}

/* ------------------------------------------------------------------- watch */

function watch(): void {
  let timer: NodeJS.Timeout | null = null;
  const schedule = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      sync().catch((err) => console.error("✖ sync failed:", err));
    }, DEBOUNCE_MS);
  };

  const dim2 = (s: string) => `\x1b[2m${s}\x1b[22m`;
  console.log(` ${dim2("watching " + path.relative(ROOT, COMPONENTS_DIR) + "/")}`);
  try {
    // macOS + Windows support recursive fs.watch natively.
    fs.watch(COMPONENTS_DIR, { recursive: true }, (_event, filename) => {
      // Ignore noise from editor swap files / .DS_Store.
      if (filename && /(\.swp$|\.DS_Store$|~$)/.test(filename)) return;
      schedule();
    });
  } catch (err) {
    console.error("✖ could not start watcher:", err);
    process.exit(1);
  }
}

/* -------------------------------------------------------------------- main */

async function main(): Promise<void> {
  await sync(); // initial pass
  if (WATCH && !DRY) watch();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
