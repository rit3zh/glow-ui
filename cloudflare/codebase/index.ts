#!/usr/bin/env bun
/**
 * Codebase sync — mirrors the library source into the `reacticx-codebase` bucket.
 *
 *   core/      ← src/components
 *   examples/  ← app/components
 *   helpers/   ← src/utils/create-compound-component
 *   types/     ← generated from each component's type file
 *
 * The bucket is private and wrangler cannot list objects, so `manifest.json` is
 * the record of what is up there: a file is uploaded when it is new or its
 * sha256 changed, and skipped otherwise. `--force` ignores the ledger,
 * `--prune` deletes objects whose local file is gone.
 */
import { relative } from "node:path";

import { config, sourceIds, type SourceId } from "./config";
import { mapLimit } from "../sync/lib/concurrency";
import { c, formatBytes, formatDuration, log } from "../sync/lib/log";
import { buildTypes } from "./build-types";
import { collectSource, type CodeFile, type SkippedFile } from "./lib/files";
import { readManifest, writeManifest, type Manifest } from "./lib/manifest";
import { objectExists, readBody, selectBackend, type Backend } from "./lib/r2";

interface Flags {
  dry: boolean;
  force: boolean;
  check: boolean;
  prune: boolean;
  verify: boolean;
  help: boolean;
  only: SourceId[];
  backend?: Backend["id"];
}

/** Width of the widest bucket prefix, so the folder columns line up. */
const PREFIX_WIDTH = Math.max(...config.sources.map((s) => s.prefix.length)) + 2;

const HELP = `
${c.bold("reacticx codebase sync")} — push the library source to ${c.cyan(config.bucket)}

${c.dim("Usage")}
  bun cloudflare/codebase/index.ts [flags]

${c.dim("Folders")}
${config.sources
  .map((s) => `  ${c.cyan(`${s.prefix}/`.padEnd(PREFIX_WIDTH))} ${c.dim(`← ${s.dir}`)}`)
  .join("\n")}

${c.dim("Flags")}
      --only <ids>   comma separated: ${sourceIds.join(", ")}
  -n, --dry          print the plan, upload nothing
  -f, --force        re-upload everything, ignoring the manifest
      --prune        delete objects whose local file no longer exists
      --verify       HEAD every unchanged file against the public origin, so an
                     object missing from the bucket is re-uploaded
      --check        exit 1 when anything is out of sync (for CI)
      --wrangler     force the wrangler backend
      --s3           force the direct S3 backend (needs R2 API credentials)
  -h, --help         show this help

${c.dim("Credentials")}
  wrangler login covers the default path. Set ${c.bold("R2_ACCOUNT_ID")},
  ${c.bold("R2_ACCESS_KEY_ID")} and ${c.bold("R2_SECRET_ACCESS_KEY")} to use the much
  faster direct S3 uploads instead.
`;

function parseFlags(argv: readonly string[]): Flags {
  const has = (...names: string[]) => names.some((name) => argv.includes(name));

  const onlyIndex = argv.findIndex((arg) => arg === "--only" || arg.startsWith("--only="));
  let only: SourceId[] = [];

  if (onlyIndex !== -1) {
    const raw = argv[onlyIndex]!.includes("=")
      ? argv[onlyIndex]!.split("=")[1]
      : argv[onlyIndex + 1];

    const requested = (raw ?? "").split(",").map((part) => part.trim()).filter(Boolean);
    const unknown = requested.filter((id) => !sourceIds.includes(id as SourceId));

    if (requested.length === 0) throw new Error(`--only needs a value: ${sourceIds.join(", ")}`);
    if (unknown.length > 0) {
      throw new Error(`unknown source ${unknown.join(", ")} — expected ${sourceIds.join(", ")}`);
    }
    only = requested as SourceId[];
  }

  return {
    dry: has("--dry", "--dry-run", "-n"),
    force: has("--force", "-f"),
    check: has("--check"),
    prune: has("--prune"),
    verify: has("--verify"),
    help: has("--help", "-h"),
    only,
    backend: has("--s3") ? "s3" : has("--wrangler") ? "wrangler" : undefined,
  };
}

type Action = "upload" | "reupload";

interface PlanItem {
  file: CodeFile;
  action: Action;
  reason: string;
}

/** The listing uploaded next to the source so consumers can discover files. */
function buildIndex(files: readonly CodeFile[]) {
  const grouped = Object.fromEntries(
    config.sources.map((source) => [
      source.id,
      {
        prefix: source.prefix,
        source: source.dir,
        files: files
          .filter((file) => file.source === source.id)
          .map((file) => ({
            path: file.relativePath,
            key: file.key,
            size: file.size,
            hash: file.hash,
            contentType: file.contentType,
          })),
      },
    ]),
  );

  return Buffer.from(
    `${JSON.stringify(
      {
        bucket: config.bucket,
        generatedAt: new Date().toISOString(),
        total: files.length,
        folders: grouped,
      },
      null,
      2,
    )}\n`,
  );
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP);
    return;
  }

  const startedAt = performance.now();
  const sources = config.sources.filter(
    (source) => flags.only.length === 0 || flags.only.includes(source.id),
  );

  const backend = selectBackend(flags.backend);

  log.title(`Codebase → ${c.cyan(config.bucket)}`);
  log.step(c.dim(`via ${backend.label} · ${backend.concurrency} at a time`));
  log.blank();

  /* ---- generate --------------------------------------------------------- */

  // `types/` has no authored directory to walk, so it is rebuilt from the
  // library on every run. Doing it here rather than in a separate command is
  // what stops the bucket from serving types that no longer match the source.
  if (sources.some((source) => source.id === "types")) {
    const { written, byException, collisions } = await buildTypes();

    log.step(
      `${c.cyan("types/".padEnd(PREFIX_WIDTH))} ${c.bold(String(written.length).padStart(4))} built ` +
        c.dim("← src/components/**/types"),
    );
    for (const component of byException) {
      log.skip(`${component.slug} kept from ${component.group}/ — a page documents it`);
    }
    for (const collision of collisions) log.warn(`slug collision — ${collision}`);
  }

  /* ---- collect ---------------------------------------------------------- */

  const files: CodeFile[] = [];
  const skipped: SkippedFile[] = [];

  for (const source of sources) {
    const result = await collectSource(source);
    files.push(...result.files);
    skipped.push(...result.skipped);

    log.step(
      `${c.cyan(`${source.prefix}/`.padEnd(PREFIX_WIDTH))} ${c.bold(String(result.files.length).padStart(4))} files ` +
        c.dim(`← ${source.dir}`),
    );
  }

  for (const item of skipped) {
    log.warn(`skipped ${c.bold(item.displayPath)} ${c.dim(`— ${item.reason}`)}`);
  }

  if (files.length === 0) {
    log.blank();
    log.warn("nothing to upload");
    log.end(c.dim("done"));
    return;
  }

  const duplicate = files
    .map((file) => file.key)
    .find((key, index, all) => all.indexOf(key) !== index);
  if (duplicate) throw new Error(`two files map to the same object key: ${duplicate}`);

  /* ---- plan ------------------------------------------------------------- */

  const manifest = await readManifest();

  const plan: PlanItem[] = [];
  let unchanged = 0;

  for (const file of files) {
    const tracked = manifest.entries[file.key];

    if (flags.force) {
      plan.push({ file, action: "reupload", reason: "forced" });
    } else if (!tracked) {
      plan.push({ file, action: "upload", reason: "new" });
    } else if (tracked.hash !== file.hash) {
      plan.push({ file, action: "reupload", reason: "changed" });
    } else {
      unchanged += 1;
    }
  }

  // The manifest is a local ledger, so it can claim a file is uploaded when the
  // object is gone. A HEAD against the public origin is free and settles it.
  if (flags.verify && unchanged > 0) {
    const candidates = files.filter((file) => !plan.some((item) => item.file === file));

    log.blank();
    log.step(`Verifying ${c.bold(String(candidates.length))} object(s) against the public origin…`);

    const missing = await mapLimit(candidates, config.verifyConcurrency, async (file) => {
      try {
        return (await objectExists(file.key)) ? undefined : file;
      } catch (error) {
        throw new Error(`could not verify ${file.key}: ${(error as Error).message}`);
      }
    });

    for (const file of missing) {
      if (!file) continue;
      plan.push({ file, action: "upload", reason: "missing from bucket" });
      unchanged -= 1;
      log.warn(`${file.key} ${c.dim("— in the manifest but not in the bucket")}`);
    }
  }

  // Anything in the ledger that no longer exists locally, within the scope of
  // the folders this run actually looked at.
  const localKeys = new Set(files.map((file) => file.key));
  const scoped = new Set(sources.map((source) => source.id));
  const stale = Object.entries(manifest.entries).filter(
    ([key, entry]) => scoped.has(entry.source) && !localKeys.has(key),
  );

  const pendingBytes = plan.reduce((total, item) => total + item.file.size, 0);

  log.blank();
  log.step(
    `${c.bold(String(files.length))} files · ${c.green(`${plan.length} to upload`)} · ` +
      `${c.dim(`${unchanged} unchanged`)}${stale.length > 0 ? ` · ${c.yellow(`${stale.length} stale`)}` : ""}`,
  );

  /* ---- check ------------------------------------------------------------ */

  if (flags.check) {
    const problems = plan.length + (flags.prune ? stale.length : 0);
    log.blank();
    for (const item of plan.slice(0, 20)) {
      log.error(`${item.file.displayPath} ${c.dim(`— ${item.reason}`)}`);
    }
    if (plan.length > 20) log.error(c.dim(`…and ${plan.length - 20} more`));

    if (problems === 0) {
      log.success("bucket is in sync");
      log.end(c.green("done"));
      return;
    }
    log.end(c.red(`${problems} file(s) out of sync`));
    process.exitCode = 1;
    return;
  }

  /* ---- dry run ---------------------------------------------------------- */

  if (flags.dry) {
    log.blank();
    for (const item of plan.slice(0, 40)) {
      log.info(
        `${item.action === "reupload" ? "re-upload" : "upload"} ${c.bold(item.file.key)} ` +
          c.dim(`(${formatBytes(item.file.size)}, ${item.reason})`),
      );
    }
    if (plan.length > 40) log.info(c.dim(`…and ${plan.length - 40} more`));

    for (const [key] of stale) {
      log.info(`${flags.prune ? "delete" : "stale (pass --prune to delete)"} ${c.bold(key)}`);
    }

    log.blank();
    log.end(
      c.yellow(`dry run — ${plan.length} pending`) +
        c.dim(` (${formatBytes(pendingBytes)}), ${unchanged} in sync`),
    );
    return;
  }

  /* ---- upload ----------------------------------------------------------- */

  const failures: { key: string; message: string }[] = [];

  if (plan.length > 0) {
    log.blank();
    log.step(`Uploading ${c.bold(String(plan.length))} file(s) ${c.dim(`(${formatBytes(pendingBytes)})`)}…`);

    let done = 0;

    await mapLimit(plan, backend.concurrency, async (item) => {
      const { file } = item;
      try {
        await backend.put(
          file.key,
          await readBody(file.filePath),
          file.contentType,
          config.cacheControl,
        );

        manifest.entries[file.key] = {
          source: file.source,
          path: relative(config.rootDir, file.filePath),
          hash: file.hash,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };

        done += 1;
        log.success(
          `${c.dim(`[${String(done).padStart(String(plan.length).length)}/${plan.length}]`)} ` +
            `${file.key} ${c.dim(`${formatBytes(file.size)} · ${item.reason}`)}`,
        );
      } catch (error) {
        failures.push({ key: file.key, message: (error as Error).message });
        log.error(`${c.bold(file.key)} — ${(error as Error).message}`);
      }
    });
  }

  /* ---- prune ------------------------------------------------------------ */

  if (stale.length > 0) {
    log.blank();
    if (!flags.prune) {
      log.warn(
        `${stale.length} object(s) have no local file — run with ${c.bold("--prune")} to delete them`,
      );
      for (const [key] of stale.slice(0, 10)) log.skip(key);
    } else {
      log.step(`Deleting ${c.bold(String(stale.length))} stale object(s)…`);

      await mapLimit(stale, backend.concurrency, async ([key]) => {
        try {
          await backend.delete(key);
          delete manifest.entries[key];
          log.success(`deleted ${key}`);
        } catch (error) {
          failures.push({ key, message: (error as Error).message });
          log.error(`${c.bold(key)} — ${(error as Error).message}`);
        }
      });
    }
  }

  await writeManifest(manifest);

  if (failures.length > 0) {
    log.blank();
    log.end(
      c.red(`${failures.length} operation(s) failed`) +
        c.dim(" — the manifest kept what succeeded, rerun to retry"),
    );
    process.exitCode = 1;
    return;
  }

  /* ---- index ------------------------------------------------------------ */

  // Only rewrite the listing when it describes the whole bucket, otherwise a
  // scoped run would publish an index missing the folders it did not look at.
  if (sources.length === config.sources.length) {
    try {
      await backend.put(
        config.indexKey,
        buildIndex(files),
        "application/json; charset=utf-8",
        config.cacheControl,
      );
      log.blank();
      log.success(`Wrote ${c.cyan(config.indexKey)} ${c.dim(`(${files.length} files)`)}`);
    } catch (error) {
      log.blank();
      log.error(`could not write ${config.indexKey} — ${(error as Error).message}`);
      process.exitCode = 1;
      return;
    }
  } else {
    log.blank();
    log.warn(`--only run: ${c.bold(config.indexKey)} left untouched`);
  }

  log.end(
    c.green(plan.length > 0 ? `uploaded ${plan.length} file(s)` : "already in sync") +
      c.dim(` in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("codebase sync failed"));
  process.exitCode = 1;
});
