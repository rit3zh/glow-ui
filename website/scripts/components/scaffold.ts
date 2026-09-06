#!/usr/bin/env bun
/**
 * Scaffolds docs pages for components that have source but no page yet.
 *
 * A component counts as documented when `content/components/<name>.mdx` exists.
 * Anything with a folder in `app/components` and no page is new, and gets a
 * page written from its own source: the dependency list comes from the
 * component's imports, the props table from its types file, and the two video
 * slots from whatever clips have been recorded.
 *
 * It never touches a page that already exists — rerunning only fills gaps.
 * Run `components:sync` afterwards to fold the new pages into meta.json and the
 * generated registry.
 */
import { existsSync } from "node:fs";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

import { c, formatDuration, log } from "../../../cloudflare/sync/lib/log";
import { config, type CategoryType } from "./config";
import { hoverVideoFor } from "./lib/registry";
import {
  dependencyLabels,
  scaffoldData,
  templateSlugs,
  undocumentedSlugs,
} from "./scaffold-data";

const REPO_ROOT = join(config.siteDir, "..");

interface Flags {
  dry: boolean;
  force: boolean;
  help: boolean;
  only: string[];
}

const HELP = `
${c.bold("component scaffold")} — write docs pages for components that have none

${c.dim("Usage")}
  bun website/scripts/components/scaffold.ts [flags]

${c.dim("Reads")}
  app/components/<name>/          ${c.dim("the example — decides what exists")}
  src/components/**/<name>/       ${c.dim("the source — decides the dependencies")}

${c.dim("Writes")}
  content/components/<name>.mdx   ${c.dim("only when the page does not exist")}

${c.dim("Flags")}
      --only <names>  comma separated component slugs
  -n, --dry           print what would be written, write nothing
  -f, --force         overwrite pages that already exist
  -h, --help          show this help

${c.dim("Afterwards")}
  bun run components:sync         ${c.dim("fold the new pages into meta.json")}
`;

function parseFlags(argv: readonly string[]): Flags {
  const has = (...names: string[]) => names.some((name) => argv.includes(name));

  const index = argv.findIndex((arg) => arg === "--only" || arg.startsWith("--only="));
  const raw =
    index === -1 ? "" : argv[index]!.includes("=") ? argv[index]!.split("=")[1] : argv[index + 1];

  return {
    dry: has("--dry", "--dry-run", "-n"),
    force: has("--force", "-f"),
    help: has("--help", "-h"),
    only: (raw ?? "").split(",").map((part) => part.trim()).filter(Boolean),
  };
}

/** `seek-bar` -> `Seek Bar`, for components with no editorial entry. */
function titleFromSlug(slug: string) {
  return slug
    .replace(/^unstable_/, "")
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Every file under a directory, recursively. */
async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const found: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else found.push(full);
  }

  return found;
}

/**
 * The page preview for a component, when a master recording exists for it.
 *
 * Matched on the stem so the master's own container (`.mov`, `.mp4`) does not
 * matter; the sync uploads every master under an `.mp4` key regardless.
 */
async function previewVideoFor(name: string) {
  const dir = join(REPO_ROOT, config.previews.masterDir);
  const stem = `${name}${config.previews.suffix}`;

  let entries: string[];
  try {
    entries = await readdir(dir);
  } catch {
    return null;
  }

  const found = entries.some((entry) => entry.replace(/\.[^.]+$/, "") === stem);
  return found ? `${config.previews.origin}/${stem}.mp4` : null;
}

/** The component's own directory under src/components, if it has one. */
async function findCoreDir(name: string): Promise<string | null> {
  const root = join(REPO_ROOT, config.sourceDirs.core);

  async function search(dir: string, depth: number): Promise<string | null> {
    if (depth > 3) return null;
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return null;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      if (entry.name === name) return join(dir, entry.name);
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const found = await search(join(dir, entry.name), depth + 1);
      if (found) return found;
    }
    return null;
  }

  return search(root, 0);
}

/**
 * The third-party packages a component imports.
 *
 * Read off the real source rather than a hand-kept list, so the install block
 * cannot drift from what the code actually needs. Local aliases and the two
 * packages every component already has are dropped.
 */
const IGNORED_IMPORTS = new Set(["react", "react-native"]);

async function readDependencies(dirs: readonly string[]) {
  const found = new Set<string>();

  for (const dir of dirs) {
    for (const file of await walk(dir)) {
      if (!/\.tsx?$/.test(file)) continue;
      const source = await readFile(file, "utf8");

      for (const match of source.matchAll(/from\s+["']([^"']+)["']/g)) {
        const specifier = match[1]!;
        if (specifier.startsWith(".") || specifier.startsWith("@/") || specifier.startsWith("~"))
          continue;

        const parts = specifier.split("/");
        const pkg = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]!;
        if (!IGNORED_IMPORTS.has(pkg)) found.add(pkg);
      }
    }
  }

  return [...found].sort();
}

/**
 * The main declared interface in a types file — what AutoTypeTable renders.
 *
 * Read from the generated types tree, which is the same content the bucket
 * serves, so a scaffolded page names a type the props table can actually find.
 */
async function findTypeName(name: string) {
  const file = join(config.siteDir, "..", "cloudflare/codebase/types-build", name, "index.ts");
  if (!existsSync(file)) return null;

  const source = await readFile(file, "utf8");
  const declared = [
    ...source.matchAll(/(?:export\s+)?(?:interface|type)\s+([A-Za-z0-9_]+)/g),
  ].map((match) => match[1]!);

  // Names that describe a component's internals rather than its public props.
  // A compound component declares a dozen interfaces; these are never the one
  // the props table should show.
  const INTERNAL = /(Context|State|Theme|Config|Layout|Rect|Value|Renderable|Components)$/;
  const usable = declared.filter((candidate) => !INTERNAL.test(candidate));

  const pascal = titleFromSlug(name).replace(/\s+/g, "");
  const exact = [`I${pascal}`, `${pascal}Props`];
  // A compound component's public entry point is its root.
  const roots = [`I${pascal}Root`, `${pascal}RootProps`, `I${pascal}Group`, `I${pascal}Provider`];

  return (
    usable.find((candidate) => exact.includes(candidate)) ??
    usable.find((candidate) => roots.includes(candidate)) ??
    usable.find((candidate) => candidate.startsWith(`I${pascal}`)) ??
    usable.find((candidate) => /^I[A-Z]/.test(candidate) || candidate.endsWith("Props")) ??
    declared[0] ??
    null
  );
}

interface PageInput {
  name: string;
  category: CategoryType;
  title: string;
  icon: string;
  description: string;
  hoverVideo: string | null;
  previewVideo: string | null;
  dependencies: readonly string[];
  typeName: string | null;
  hasExample: boolean;
}

function buildPage(input: PageInput) {
  const today = new Date().toISOString().slice(0, 10);
  const labels = input.dependencies.map((dep) => dependencyLabels[dep] ?? dep);

  const frontMatter = [
    "---",
    `title: ${input.title}`,
    `category: ${input.category}`,
    `description: ${input.description}`,
    `hoverVideo: ${input.hoverVideo ?? ""}`,
    `previewVideo: ${input.previewVideo ?? ""}`,
    `lastModified: ${today}`,
    `icon: ${input.icon}`,
    "full: true",
    "---",
  ]
    // An empty slot would read as `key:` with nothing after it, which the
    // registry would then have to special-case. Leave the key out instead.
    .filter((line) => !line.endsWith(": "))
    .join("\n");

  const sections = [
    frontMatter,
    "",
    `<PreviewClient\n  link="${input.name}"\n  comment={${JSON.stringify(labels)}}\n/>`,
    "",
    "### Manual",
    "",
    "<Steps>",
    "  <Step>",
    "     Install the following dependencies:",
    "     ```package-install",
    `     ${input.dependencies.join(" ")}`,
    "     ```",
    "  </Step>",
    "",
    "<Step>",
    "  Copy and paste the following code into your project.",
    `  \`\`\`component/${input.name}.tsx\`\`\``,
    `  <ComponentFiles name="${input.name}" />`,
    "</Step>",
    "</Steps>",
  ];

  if (input.hasExample) {
    sections.push("", "### Usage", "", `<ExampleComponentSource name="${input.name}" />`);
  }

  if (input.typeName) {
    sections.push(
      "",
      "### Props",
      "",
      `<AutoTypeTable name="${input.typeName}" />`,
    );
  }

  sections.push("", `<PreviewComment comments={${JSON.stringify(labels)}} />`, "");

  return sections.join("\n");
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP);
    return;
  }

  const startedAt = performance.now();
  const startedTime = performance.now();
  void startedTime;
  const rel = (path: string) => relative(config.siteDir, path);

  log.title("Component scaffold");
  log.blank();

  const examplesDir = join(REPO_ROOT, config.sourceDirs.examples);
  const candidates: string[] = [];

  for (const entry of (await readdir(examplesDir)).sort()) {
    if (entry.startsWith(".")) continue;
    if (!(await stat(join(examplesDir, entry))).isDirectory()) continue;
    if (templateSlugs.has(entry)) continue;
    if (undocumentedSlugs.has(entry)) continue;
    if (flags.only.length > 0 && !flags.only.includes(entry)) continue;
    candidates.push(entry);
  }

  const pending = candidates.filter(
    (name) => flags.force || !existsSync(join(config.contentDir, `${name}.mdx`)),
  );

  log.step(
    `${c.bold(String(candidates.length))} component(s) in ${config.sourceDirs.examples} · ` +
      `${c.green(`${pending.length} without a page`)} · ` +
      c.dim(`${candidates.length - pending.length} already documented`),
  );

  const skippedTemplates = (await readdir(examplesDir)).filter((entry) =>
    templateSlugs.has(entry),
  );
  if (skippedTemplates.length > 0) {
    log.skip(`${skippedTemplates.length} documented under /templates: ${skippedTemplates.join(", ")}`);
  }

  if (pending.length === 0) {
    log.blank();
    log.success("every component already has a page");
    log.end(c.dim("done"));
    return;
  }

  log.blank();

  const uncurated: string[] = [];
  const noHover: string[] = [];
  const noPreview: string[] = [];

  for (const name of pending) {
    const editorial = scaffoldData[name];
    if (!editorial) uncurated.push(name);

    const coreDir = await findCoreDir(name);
    const exampleDir = join(examplesDir, name);

    const dependencies = await readDependencies(
      coreDir ? [coreDir, exampleDir] : [exampleDir],
    );
    const typeName = editorial?.typeName ?? (await findTypeName(name));
    const hoverVideo = hoverVideoFor(name);
    const previewVideo = await previewVideoFor(name);

    if (!hoverVideo) noHover.push(name);
    if (!previewVideo) noPreview.push(name);

    const page = buildPage({
      name,
      category: editorial?.category ?? "components",
      title: editorial?.title ?? titleFromSlug(name),
      icon: editorial?.icon ?? "Component",
      description: editorial?.description ?? "",
      hoverVideo,
      previewVideo,
      dependencies,
      typeName,
      hasExample: existsSync(join(exampleDir, "index.tsx")),
    });

    const target = join(config.contentDir, `${name}.mdx`);
    if (!flags.dry) await writeFile(target, page);

    log.success(
      `${flags.dry ? "would write" : "Wrote"} ${c.cyan(rel(target))} ` +
        c.dim(
          `${editorial?.category ?? "components"} · ${dependencies.length} deps · ` +
            `${typeName ?? "no props table"} · ${hoverVideo ? "hover" : "no hover"}` +
            ` · ${previewVideo ? "preview" : "no preview"}`,
        ),
    );
  }

  log.blank();

  if (uncurated.length > 0) {
    log.warn(
      `${uncurated.length} page(s) have no entry in scaffold-data.ts — title guessed from the slug, no description:`,
    );
    log.skip(uncurated.join(", "));
  }
  if (noHover.length > 0) {
    log.warn(`${noHover.length} need a hover clip recorded: ${c.dim(noHover.join(", "))}`);
  }
  if (noPreview.length > 0) {
    log.warn(
      `${noPreview.length} need a preview recorded in ${c.bold(config.previews.masterDir)}: ` +
        c.dim(noPreview.join(", ")),
    );
  }

  log.blank();
  log.info(`run ${c.bold("bun run components:sync")} to fold these into meta.json`);

  log.end(
    (flags.dry ? c.yellow("dry run") : c.green("done")) +
      c.dim(` · ${pending.length} page(s) in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("component scaffold failed"));
  process.exitCode = 1;
});
