#!/usr/bin/env bun
/**
 * Component registry sync.
 *
 *   content/components/*.mdx  ──►  content/components/meta.json
 *                             └─►  src/lib/components.generated.ts
 *
 * The `category` front matter on each page decides which docs section it lands
 * in. Pages written before that key existed inherit the section they already
 * sit under in meta.json, and the CLI writes it back into the file — so after
 * one run the .mdx files are the only input and both outputs are disposable.
 */
import { readFile, rm, writeFile } from "node:fs/promises";
import { relative } from "node:path";

import { c, formatDuration, log } from "../../../cloudflare/sync/lib/log";
import { categories, config, metaPathFor, type CategoryType } from "./config";
import {
  extractInlineVideo,
  parseFrontMatter,
  removeFrontMatterKey,
  setFrontMatterValue,
} from "./lib/frontmatter";
import { buildGenerated, buildMeta, collectComponents } from "./lib/registry";

interface Flags {
  dry: boolean;
  check: boolean;
  backfill: boolean;
  prune: boolean;
  help: boolean;
}

const HELP = `
${c.bold("component registry sync")} — regenerate the sidebar and the typed registry

${c.dim("Usage")}
  bun website/scripts/components/index.ts [flags]

${c.dim("Reads")}
  content/components/*.mdx        ${c.dim("front matter, incl. `category`")}

${c.dim("Writes")}
  content/components/meta.json    ${c.dim("fumadocs sidebar, grouped + sorted")}
  src/lib/components.generated.ts ${c.dim("[{ categoryType, name, … }]")}

${c.dim("Categories")}
${categories.map((category) => `  ${c.cyan(category.type.padEnd(20))} ${c.dim(`---${category.label}---`)}`).join("\n")}

${c.dim("Flags")}
  -n, --dry          print what would change, write nothing
      --check        exit 1 when the outputs are stale (for CI)
      --no-backfill  do not write \`category:\` into .mdx front matter
      --prune        delete pages whose component has no source left in the repo
  -h, --help         show this help
`;

function parseFlags(argv: readonly string[]): Flags {
  const has = (...names: string[]) => names.some((name) => argv.includes(name));
  return {
    dry: has("--dry", "--dry-run", "-n"),
    check: has("--check"),
    backfill: !has("--no-backfill"),
    prune: has("--prune"),
    help: has("--help", "-h"),
  };
}

/** Writes `file` only when the content actually differs. Returns true if it did. */
async function writeIfChanged(path: string, content: string, dry: boolean) {
  let current: string | undefined;
  try {
    current = await readFile(path, "utf8");
  } catch {
    current = undefined;
  }

  if (current === content) return false;
  if (!dry) await writeFile(path, content);
  return true;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP);
    return;
  }

  const startedAt = performance.now();
  const rel = (path: string) => relative(config.siteDir, path);

  log.title("Component registry");
  log.step(c.dim(config.sections.map((section) => `content/${section.dir}`).join(" · ")));
  log.blank();

  const { entries, problems } = await collectComponents();

  for (const problem of problems) log.warn(problem);

  if (entries.length === 0) {
    log.warn("no component pages found");
    log.end(c.dim("done"));
    return;
  }

  /* ---- counts ----------------------------------------------------------- */

  for (const category of categories) {
    const inCategory = entries.filter((entry) => entry.categoryType === category.type);
    log.step(
      `${c.cyan(category.type.padEnd(20))} ${c.bold(String(inCategory.length).padStart(3))} ` +
        c.dim(`---${category.label}---`),
    );
  }

  const fallbacks = entries.filter((entry) => entry.origin === "fallback");
  if (fallbacks.length > 0) {
    log.blank();
    log.warn(
      `${fallbacks.length} page(s) have no category and defaulted to ` +
        `${c.bold(config.meta.title.toLowerCase())} — set ${c.bold("category:")} in their front matter:`,
    );
    for (const entry of fallbacks.slice(0, 15)) log.skip(rel(entry.filePath));
    if (fallbacks.length > 15) log.skip(c.dim(`…and ${fallbacks.length - 15} more`));
  }

  /* ---- backfill --------------------------------------------------------- */

  const needsBackfill = entries.filter((entry) => entry.origin !== "frontmatter");

  if (needsBackfill.length > 0 && flags.backfill && !flags.check) {
    log.blank();
    log.step(
      `Writing ${c.bold(config.categoryKey + ":")} into ${c.bold(String(needsBackfill.length))} page(s)…`,
    );

    for (const entry of needsBackfill) {
      const raw = await readFile(entry.filePath, "utf8");
      const next = setFrontMatterValue(
        raw,
        config.categoryKey,
        entry.categoryType,
        config.insertAfterKey,
      );

      if (!flags.dry) await writeFile(entry.filePath, next);
      log.success(
        `${rel(entry.filePath)} ${c.dim(`→ ${entry.categoryType} (from ${entry.origin})`)}`,
      );
    }
  }

  /* ---- videos ----------------------------------------------------------- */

  // `video:` predates the split into a hover clip and a page preview. Rewriting
  // it here means the front matter says which slot it fills, and the hover slot
  // picks up any landing asset that has been recorded since.
  if (flags.backfill && !flags.check) {
    let migrated = 0;
    let hoisted = 0;

    for (const entry of entries) {
      const raw = await readFile(entry.filePath, "utf8");
      const parsed = parseFrontMatter(raw);
      if (!parsed) continue;

      let next = raw;
      let previewVideo = entry.previewVideo;

      // A page whose preview still sits in the body as a <div><video> block:
      // hoist the URL into the front matter and drop the markup.
      if (!previewVideo) {
        const inline = extractInlineVideo(next);
        if (inline) {
          previewVideo = inline.url;
          next = inline.body;
          hoisted += 1;
        }
      }

      if (previewVideo && !parsed.values[config.videoKeys.preview]) {
        next = setFrontMatterValue(
          next,
          config.videoKeys.preview,
          previewVideo,
          config.videoInsertAfterKey,
        );
      }
      if (entry.hoverVideo && parsed.values[config.videoKeys.hover] !== entry.hoverVideo) {
        next = setFrontMatterValue(
          next,
          config.videoKeys.hover,
          entry.hoverVideo,
          config.videoInsertAfterKey,
        );
      }
      if (next !== raw) next = removeFrontMatterKey(next, config.legacyVideoKey);

      if (next !== raw) {
        if (!flags.dry) await writeFile(entry.filePath, next);
        migrated += 1;
      }
    }

    if (hoisted > 0) {
      log.blank();
      log.success(
        `${flags.dry ? "would hoist" : "Hoisted"} an inline <video> block into front matter on ` +
          `${c.bold(String(hoisted))} page(s)`,
      );
    }

    if (migrated > 0) {
      if (hoisted === 0) log.blank();
      log.success(
        `${flags.dry ? "would rewrite" : "Rewrote"} video front matter on ${c.bold(String(migrated))} page(s) ` +
          c.dim(`(${config.legacyVideoKey}: → ${config.videoKeys.preview}: / ${config.videoKeys.hover}:)`),
      );
    }
  }

  /* ---- source block ----------------------------------------------------- */

  // `<ComponentSource>` renders a single file, which hides everything else a
  // component ships — its `conf.ts`, `const.ts`, nested `hooks/`. The tree
  // shows the real folder, so every page uses it.
  if (flags.backfill && !flags.check) {
    let converted = 0;

    for (const entry of entries) {
      const raw = await readFile(entry.filePath, "utf8");
      const next = raw.replace(/<ComponentSource(\s)/g, "<ComponentFiles$1");
      if (next === raw) continue;

      if (!flags.dry) await writeFile(entry.filePath, next);
      converted += 1;
    }

    if (converted > 0) {
      log.blank();
      log.success(
        `${flags.dry ? "would convert" : "Converted"} ${c.bold(String(converted))} page(s) from ` +
          `${c.dim("<ComponentSource>")} to ${c.dim("<ComponentFiles>")}`,
      );
    }
  }

  /* ---- dangling source references --------------------------------------- */

  // `<ComponentFiles name="…">` resolves against a component folder in the
  // bucket. A name that is not a real component renders as "not synced yet",
  // which looks like a sync gap but is a typo in the page.
  {
    const known = new Set(entries.map((entry) => entry.name));
    const dangling: string[] = [];

    for (const entry of entries) {
      const raw = await readFile(entry.filePath, "utf8");

      for (const match of raw.matchAll(/<(?:ComponentFiles|ExampleComponentSource)\s+name="([^"]+)"/g)) {
        const referenced = match[1]!;
        if (referenced !== entry.name && !known.has(referenced)) {
          dangling.push(`${entry.name} → ${referenced}`);
        }
      }
    }

    if (dangling.length > 0) {
      log.blank();
      log.warn(
        `${dangling.length} source reference(s) point at something that is not a component:`,
      );
      for (const item of dangling) log.skip(item);
    }
  }

  /* ---- gaps ------------------------------------------------------------- */

  const noHover = entries.filter((entry) => !entry.hoverVideo);
  const noPreview = entries.filter((entry) => !entry.previewVideo);
  const orphaned = entries.filter((entry) => entry.sourceIn.length === 0);
  const noExample = entries.filter(
    (entry) => entry.sourceIn.length > 0 && !entry.sourceIn.includes("examples"),
  );

  log.blank();
  log.step(
    `videos · ${c.green(`${entries.length - noHover.length} hover`)} · ` +
      `${c.green(`${entries.length - noPreview.length} preview`)} · ` +
      `${c.dim(`of ${entries.length}`)}`,
  );

  if (noHover.length > 0) {
    log.warn(`${noHover.length} page(s) have no hover clip: ${c.dim(noHover.map((e) => e.name).join(", "))}`);
  }
  if (noPreview.length > 0) {
    log.warn(`${noPreview.length} page(s) have no preview video: ${c.dim(noPreview.map((e) => e.name).join(", "))}`);
  }
  if (noExample.length > 0) {
    log.warn(
      `${noExample.length} page(s) have core source but no example in ` +
        `${c.bold(config.sourceDirs.examples)}: ${c.dim(noExample.map((e) => e.name).join(", "))}`,
    );
  }

  /* ---- prune ------------------------------------------------------------ */

  if (orphaned.length > 0) {
    log.blank();

    if (!flags.prune) {
      log.warn(
        `${orphaned.length} page(s) document a component with no source left in the repo — ` +
          `run with ${c.bold("--prune")} to delete them:`,
      );
      log.skip(orphaned.map((entry) => entry.name).join(", "));
    } else {
      log.step(`Deleting ${c.bold(String(orphaned.length))} orphaned page(s)…`);

      for (const entry of orphaned) {
        if (!flags.dry) await rm(entry.filePath);
        log.success(`${flags.dry ? "would delete" : "Deleted"} ${rel(entry.filePath)}`);
      }

      // The outputs below must describe what is left, not what was collected.
      for (const entry of orphaned) {
        entries.splice(entries.indexOf(entry), 1);
      }
    }
  }

  /* ---- outputs ---------------------------------------------------------- */

  const outputs: { path: string; content: string }[] = [
    // One sidebar per section — each lists only the catalogues it holds.
    ...config.sections.map((section) => ({
      path: metaPathFor(section),
      content: buildMeta(entries, section),
    })),
    { path: config.generatedPath, content: buildGenerated(entries) },
  ];

  const stale: string[] = [];
  for (const output of outputs) {
    if (await writeIfChanged(output.path, output.content, flags.dry || flags.check)) {
      stale.push(output.path);
    }
  }

  log.blank();

  if (flags.check) {
    const outOfDate = [
      ...stale,
      ...(needsBackfill.length > 0 ? [`${needsBackfill.length} page(s) missing category:`] : []),
    ];

    if (outOfDate.length === 0) {
      log.success(`registry is up to date (${entries.length} components)`);
      log.end(c.green("done"));
      return;
    }

    for (const item of outOfDate) log.error(item.startsWith("/") ? rel(item) : item);
    log.end(c.red("registry is stale — run `bun run components:sync`"));
    process.exitCode = 1;
    return;
  }

  if (stale.length === 0) {
    log.success(`Outputs already up to date (${entries.length} components)`);
  } else {
    for (const path of stale) {
      log.success(`${flags.dry ? "would write" : "Wrote"} ${c.cyan(rel(path))}`);
    }
  }

  log.end(
    (flags.dry ? c.yellow("dry run") : c.green("done")) +
      c.dim(` · ${entries.length} components in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("component registry sync failed"));
  process.exitCode = 1;
});
