#!/usr/bin/env bun
/**
 * Mockup sync — pushes the v2 block mockups to `reacticx-v2-mockups`.
 *
 * These are the screen-level blocks the docs show as finished UI: a bottom
 * sheet, an empty state, a settings screen, a welcome screen. Unlike the
 * component previews they are stills, and unlike the landing clips they are
 * filed under a category, because that is how the docs list them:
 *
 *   blocks/<category>/<slug>.png
 *
 * A category is read off the blocks tree — `welcome-v2.png` is a welcome-screen
 * because `src/components/blocks/welcome-screen/welcome-v2/` is where its code
 * lives — or from a subfolder named after one. A file that matches neither
 * stops the run rather than landing somewhere arbitrary; an uncategorised block
 * is invisible in every listing, which is worse than a failed sync.
 *
 * Uploads are incremental. `manifest.json` records the sha256 of every object
 * that has gone up, so a rerun sends only what is new or re-exported. Every run
 * that changes anything rewrites `cloudflare/generated/v2-mockups.ts`, which is
 * the only listing of a bucket nothing else can enumerate.
 *
 *   bun run mockups:sync           upload new/changed mockups
 *   bun run mockups:sync --dry     print the plan, send nothing
 *   bun run mockups:sync --force   re-upload everything
 *   bun run mockups:sync --prune   delete objects with no local file left
 *   bun run mockups:sync --check   exit 1 when anything is out of sync (CI)
 */
import { readdir, stat } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";

import { probeDimensions } from "../lib/dimensions";
import { hashFile, readManifest, writeManifest } from "../lib/manifest";
import { objectExists, selectBackend, type BackendId } from "../lib/r2";
import { mapLimit } from "../sync/lib/concurrency";
import { c, formatBytes, formatDuration, log } from "../sync/lib/log";
import { toTitle } from "../sync/lib/naming";
import { blockFor, readBlocks, type Block } from "./blocks";
import {
  bucketSpec,
  categories,
  categoryOf,
  config,
  isCategoryId,
  titleFixes,
  type CategoryId,
} from "./config";
import { writeGeneratedFile, type GeneratedMockup } from "./generate";

interface Flags {
  dry: boolean;
  force: boolean;
  check: boolean;
  prune: boolean;
  verify: boolean;
  help: boolean;
  backend?: BackendId;
}

const HELP = `
${c.bold("mockup sync")} — push the v2 block mockups to ${c.cyan(config.bucket)}

${c.dim("Usage")}
  bun cloudflare/mockups/index.ts [flags]

${c.dim("Source")}
  ${c.dim(`← ${relative(config.rootDir, config.sourceDir)}`)}
  ${c.dim(`→ ${config.keyPrefix}/<category>/<slug>.png`)}

${c.dim("Categories")}
${categories.map((category) => `  ${c.cyan(category.id.padEnd(16))} ${c.dim(category.description)}`).join("\n")}

${c.dim("Flags")}
  -n, --dry       print the plan, upload nothing
  -f, --force     re-upload every mockup, ignoring the manifest
      --prune     delete objects whose local file no longer exists
      --verify    HEAD every unchanged object, so one missing from the bucket
                  is re-uploaded rather than trusted
      --check     exit 1 when anything is out of sync (for CI)
      --wrangler  force the wrangler backend
      --s3        force the direct S3 backend (needs R2 API credentials)
  -h, --help      show this help

${c.dim("Origin")}
  Set ${c.bold("R2_MOCKUPS_PUBLIC_ORIGIN")} to override the bucket's public origin, which
  is what the generated registry links to.
`;

function parseFlags(argv: readonly string[]): Flags {
  const has = (...names: string[]) => names.some((name) => argv.includes(name));
  return {
    dry: has("--dry", "--dry-run", "-n"),
    force: has("--force", "-f"),
    check: has("--check"),
    prune: has("--prune"),
    verify: has("--verify"),
    help: has("--help", "-h"),
    backend: has("--s3") ? "s3" : has("--wrangler") ? "wrangler" : undefined,
  };
}

interface Local {
  key: string;
  name: string;
  title: string;
  category: CategoryId;
  fileName: string;
  filePath: string;
  contentType: string;
  size: number;
  hash: string;
  width?: number;
  height?: number;
  /** Path to the block this is a screenshot of, relative to the repo root. */
  block?: string;
}

/** `welcome-v1.png` -> `welcome-v1`, normalised to a safe slug. */
function slugOf(fileName: string) {
  return basename(fileName, extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Every accepted image under the source folder, one level of category deep. */
async function walk() {
  const entries = await readdir(config.sourceDir, { withFileTypes: true }).catch(() => {
    throw new Error(
      `missing source directory: ${relative(config.rootDir, config.sourceDir)}`,
    );
  });

  const found: { fileName: string; filePath: string; folder?: string }[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    if (entry.isDirectory()) {
      if (!isCategoryId(entry.name)) {
        throw new Error(
          `${entry.name}/ is not a category — expected one of ` +
            categories.map((category) => category.id).join(", "),
        );
      }

      const nested = await readdir(join(config.sourceDir, entry.name));
      for (const name of nested) {
        if (name.startsWith(".")) continue;
        found.push({
          fileName: name,
          filePath: join(config.sourceDir, entry.name, name),
          folder: entry.name,
        });
      }
      continue;
    }

    found.push({ fileName: entry.name, filePath: join(config.sourceDir, entry.name) });
  }

  return found.filter(
    (file) => config.mediaTypes[extname(file.fileName).toLowerCase()] !== undefined,
  );
}

async function collect(blocks: Map<string, Block>) {
  const files = await walk();
  const table = categoryOf as Record<string, CategoryId | undefined>;

  const uncategorised: string[] = [];

  const collected = await mapLimit(
    files.sort((a, b) => a.fileName.localeCompare(b.fileName)),
    8,
    async (file): Promise<Local | undefined> => {
      const name = slugOf(file.fileName);
      const block = blockFor(blocks, name);

      // Source folder wins, then the block the mockup is a picture of, then the
      // fallback table for a screenshot whose block has not landed yet.
      const category =
        (file.folder as CategoryId | undefined) ?? block?.category ?? table[name];

      if (!category) {
        uncategorised.push(file.fileName);
        return undefined;
      }

      const [{ size }, hash, dimensions] = await Promise.all([
        stat(file.filePath),
        hashFile(file.filePath),
        probeDimensions(file.filePath),
      ]);

      return {
        key: `${config.keyPrefix}/${category}/${name}${extname(file.fileName).toLowerCase()}`,
        name,
        title: titleFixes[name] ?? toTitle(name),
        category,
        fileName: file.fileName,
        filePath: file.filePath,
        contentType: config.mediaTypes[extname(file.fileName).toLowerCase()]!,
        size,
        hash,
        width: dimensions?.width,
        height: dimensions?.height,
        block: block?.entry,
      };
    },
  );

  if (uncategorised.length > 0) {
    throw new Error(
      `no category for ${uncategorised.join(", ")} — add the block under ` +
        `src/components/blocks/<category>/<slug>/, move the file into a ` +
        `${categories.map((category) => category.id).join(" / ")} subfolder, or ` +
        `add a \`categoryOf\` entry in cloudflare/mockups/config.ts`,
    );
  }

  const local = collected.filter((file): file is Local => file !== undefined);

  const duplicate = local
    .map((file) => file.key)
    .find((key, index, all) => all.indexOf(key) !== index);
  if (duplicate) throw new Error(`two files map to the same object key: ${duplicate}`);

  return local;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP);
    return;
  }

  const startedAt = performance.now();

  // Resolved before anything is uploaded: a run that pushes 25 MB and then
  // cannot write the registry has left the bucket ahead of the repo.
  const spec = bucketSpec();
  const backend = selectBackend(spec, {
    force: flags.backend,
    concurrency: config.concurrency,
  });

  const blocks = await readBlocks();
  const files = await collect(blocks);
  const manifest = await readManifest(config.manifestPath, config.bucket);

  log.title(`Mockups → ${c.cyan(config.bucket)}`);
  log.step(
    `${c.bold(String(files.length))} mockups · ` +
      `${c.bold(String(categories.length))} categories · ` +
      c.dim(`via ${backend.label}`),
  );
  for (const category of categories) {
    const count = files.filter((file) => file.category === category.id).length;
    log.skip(`${category.id.padEnd(16)} ${count}`);
  }
  log.blank();

  /* ---- plan ------------------------------------------------------------- */

  const pending: { file: Local; reason: string }[] = [];
  const unchanged: Local[] = [];
  /** Already in the bucket, but not yet in the ledger — recorded, not re-sent. */
  const adopted: Local[] = [];
  const untracked: Local[] = [];

  for (const file of files) {
    const tracked = manifest.entries[file.key];

    if (flags.force) pending.push({ file, reason: "forced" });
    else if (!tracked) untracked.push(file);
    else if (tracked.hash !== file.hash) pending.push({ file, reason: "re-exported" });
    else unchanged.push(file);
  }

  // A file the ledger has never heard of is not automatically a file the bucket
  // has never seen — a fresh clone and a first run look identical from here.
  // One free HEAD per unknown object tells them apart.
  if (untracked.length > 0) {
    log.step(
      `Checking ${c.bold(String(untracked.length))} unrecorded object(s) against the bucket…`,
    );

    // Best effort. The probe reads the public origin, which can be misconfigured
    // or not public at all, and an unreachable origin says nothing about
    // whether the object is there. Treating an unanswerable probe as "new" only
    // costs a re-upload of bytes that were already correct — dying here would
    // cost the whole push.
    let unreachable: string | undefined;

    const checked = await mapLimit(untracked, 24, async (file) => {
      try {
        const remote = await objectExists(spec, file.key);
        // The bytes go up verbatim, so a size match on an object we hold no
        // hash for is as much confirmation as exists without downloading it.
        return { file, present: remote.exists && remote.size === file.size };
      } catch (error) {
        unreachable ??= (error as Error).message;
        return { file, present: false };
      }
    });

    for (const { file, present } of checked) {
      if (present) adopted.push(file);
      else pending.push({ file, reason: "new" });
    }

    if (unreachable) {
      log.warn(
        `could not read ${c.bold(spec.publicOrigin)} (${unreachable}) — treating ` +
          `unrecorded objects as new. Check R2_MOCKUPS_PUBLIC_ORIGIN and that ` +
          `public access is enabled on the bucket.`,
      );
    }
    log.blank();
  }

  if (flags.verify && unchanged.length > 0) {
    log.step(`Verifying ${c.bold(String(unchanged.length))} unchanged object(s)…`);

    const missing = await mapLimit(unchanged, 24, async (file) => {
      // Unlike the adoption probe above, a failure here must not be read as
      // "missing" — that would re-upload the entire bucket every run against an
      // origin that is merely unreachable.
      try {
        return (await objectExists(spec, file.key)).exists ? null : file;
      } catch (error) {
        throw new Error(
          `--verify could not read ${spec.publicOrigin}: ${(error as Error).message}`,
        );
      }
    });

    for (const file of missing) {
      if (!file) continue;
      pending.push({ file, reason: "missing from bucket" });
      unchanged.splice(unchanged.indexOf(file), 1);
    }
    log.blank();
  }

  /* ---- remote-only ------------------------------------------------------ */

  // The source folder is a working directory, not the definitive set: emptying
  // it and dropping in one new export is a normal thing to do, since the bucket
  // is where these actually live. So an object with no local file is reported,
  // kept in the ledger, and kept in the registry — it is still in the bucket
  // and the docs still link to it. Only `--prune` removes one, which is also
  // how a genuinely deleted or renamed mockup finally goes.
  const liveKeys = new Set(files.map((file) => file.key));

  const remoteOnly = Object.keys(manifest.entries)
    .filter((key) => !liveKeys.has(key))
    // Entries a previous version of this sync had already set aside.
    .concat(Object.keys(manifest.orphaned ?? {}))
    .sort();

  if (remoteOnly.length > 0 && !flags.prune) {
    log.step(
      `${c.bold(String(remoteOnly.length))} object(s) are in the bucket with no local ` +
        `file — kept. ${c.dim(`Run with --prune to delete them.`)}`,
    );
    log.blank();
  }

  /* ---- report-only modes ------------------------------------------------ */

  const pendingBytes = pending.reduce((total, item) => total + item.file.size, 0);

  if (flags.check) {
    const problems = pending.map((item) => `${item.file.key} — ${item.reason}`);
    if (flags.prune) problems.push(...remoteOnly.map((key) => `${key} — no local file`));

    if (problems.length === 0) {
      log.success(
        `bucket is in sync (${Object.keys(manifest.entries).length} objects)`,
      );
      log.end(c.green("done"));
      return;
    }

    for (const problem of problems) log.error(problem);
    log.end(c.red(`${problems.length} object(s) out of sync`));
    process.exitCode = 1;
    return;
  }

  if (flags.dry) {
    for (const item of pending.slice(0, 20)) {
      log.info(
        `would put ${c.bold(item.file.key)} ` +
          c.dim(`(${formatBytes(item.file.size)}, ${item.reason})`),
      );
    }
    if (pending.length > 20) log.info(c.dim(`…and ${pending.length - 20} more`));
    if (flags.prune) {
      for (const key of remoteOnly) log.info(`would delete ${c.bold(key)}`);
    }
    for (const target of config.generatedTargets) {
      log.info(`would write ${c.bold(relative(config.rootDir, target))}`);
    }
    log.blank();
    log.end(
      c.yellow(
        `dry run — ${pending.length} to upload (${formatBytes(pendingBytes)}), ` +
          `${unchanged.length + adopted.length} in sync`,
      ),
    );
    return;
  }

  /* ---- upload ----------------------------------------------------------- */

  const failures: string[] = [];

  if (pending.length === 0) {
    log.success(`Bucket already in sync (${unchanged.length + adopted.length} objects)`);
  } else {
    log.step(
      `Uploading ${c.bold(String(pending.length))} object(s) ` +
        c.dim(`(${formatBytes(pendingBytes)}, ${backend.concurrency} at a time)…`),
    );

    let done = 0;
    await mapLimit(pending, backend.concurrency, async ({ file, reason }) => {
      try {
        await backend.putFile(
          file.key,
          file.filePath,
          file.contentType,
          config.cacheControl,
        );

        manifest.entries[file.key] = {
          file: relative(config.rootDir, file.filePath),
          hash: file.hash,
          size: file.size,
          contentType: file.contentType,
          uploadedAt: new Date().toISOString(),
          width: file.width,
          height: file.height,
        };

        done += 1;
        log.success(
          `${c.dim(`[${done}/${pending.length}]`)} ${file.key} ` +
            c.dim(`${formatBytes(file.size)} · ${reason}`),
        );
      } catch (error) {
        failures.push(`${file.key} — ${(error as Error).message}`);
        log.error(`${c.bold(file.key)} — ${(error as Error).message}`);
      }
    });
  }

  if (flags.prune && remoteOnly.length > 0) {
    log.blank();
    log.step(`Deleting ${c.bold(String(remoteOnly.length))} object(s) with no local file…`);

    await mapLimit(remoteOnly, backend.concurrency, async (key) => {
      try {
        await backend.delete(key);
        delete manifest.entries[key];
        delete manifest.orphaned?.[key];
        log.success(`deleted ${key}`);
      } catch (error) {
        failures.push(`${key} — ${(error as Error).message}`);
        log.error(`${c.bold(key)} — ${(error as Error).message}`);
      }
    });
  }

  // Objects that were already up there still belong in the ledger — otherwise a
  // manifest deleted by hand would never rebuild itself.
  for (const file of [...unchanged, ...adopted]) {
    const entry = (manifest.entries[file.key] ??= {
      file: relative(config.rootDir, file.filePath),
      hash: file.hash,
      size: file.size,
      contentType: file.contentType,
      uploadedAt: new Date().toISOString(),
    });

    // Backfill measurements onto entries written before the ledger recorded
    // them, so clearing the folder does not cost the registry its aspects.
    entry.width ??= file.width;
    entry.height ??= file.height;
  }

  await writeManifest(config.manifestPath, manifest);

  /* ---- registry --------------------------------------------------------- */

  // Built from the ledger, not from the source folder. The registry is a
  // listing of the bucket, and the bucket holds every mockup ever pushed —
  // whereas the folder holds whatever happens to be on this machine right now.
  // Generating from the folder would silently drop 18 mockups from the docs the
  // first time someone cleared it out and re-exported one.
  //
  // A failed upload is excluded: a registry entry for an object that is not up
  // there is a docs page pointing at a 404.
  const failedKeys = new Set(
    failures.map((failure) => failure.slice(0, failure.indexOf(" — "))),
  );

  const localByKey = new Map(files.map((file) => [file.key, file]));

  const generated: GeneratedMockup[] = [];
  const undescribed: string[] = [];

  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (failedKeys.has(key)) continue;

    const local = localByKey.get(key);
    const [, category, fileName] = key.split("/");

    // Everything below can come from the key and the ledger, so a mockup stays
    // in the registry with no local file. The one thing that cannot is a key
    // shaped unlike `blocks/<category>/<file>`.
    if (!category || !fileName || !isCategoryId(category)) {
      undescribed.push(key);
      continue;
    }

    const name = local?.name ?? slugOf(fileName);

    generated.push({
      name,
      title: local?.title ?? titleFixes[name] ?? toTitle(name),
      category,
      fileName: local?.fileName ?? basename(entry.file),
      key,
      contentType: entry.contentType,
      size: entry.size,
      hash: entry.hash,
      width: local?.width ?? entry.width,
      height: local?.height ?? entry.height,
      block: local?.block ?? blockFor(blocks, name)?.entry ?? null,
    });
  }

  if (undescribed.length > 0) {
    log.warn(
      `${undescribed.length} ledger entry(s) have a key this sync cannot read and ` +
        `were left out of the registry: ${undescribed.join(", ")}`,
    );
  }

  const targets = await writeGeneratedFile(generated, spec.publicOrigin);

  log.blank();
  for (const target of targets) {
    log.success(`wrote ${relative(config.rootDir, target)} (${generated.length} mockups)`);
  }

  log.blank();

  if (failures.length > 0) {
    log.end(c.red(`${failures.length} operation(s) failed — rerun to retry`));
    process.exitCode = 1;
    return;
  }

  log.end(
    c.green(
      `${pending.length} uploaded, ${unchanged.length + adopted.length} unchanged` +
        (adopted.length > 0 ? ` (${adopted.length} adopted into the ledger)` : ""),
    ) + c.dim(` in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("mockup sync failed"));
  process.exitCode = 1;
});
