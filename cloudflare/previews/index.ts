#!/usr/bin/env bun
/**
 * Preview sync — pushes the component preview recordings to `reacticx-v2-previews`.
 *
 * Every preview is a screen recording with a real alpha channel, so the docs can
 * float the component on the page background instead of on a black rectangle.
 * No single encoding is transparent everywhere, so each preview ships twice:
 *
 *   <slug>-preview.mp4    HEVC + alpha   → Safari
 *   <slug>-preview.webm   VP9 + alpha    → Chrome, Edge, Firefox
 *
 * The masters are QuickTime, and they are uploaded byte for byte under an
 * `.mp4` key served as `video/mp4`. That is not a container change — remuxing
 * into a real MP4 drops Apple's alpha layer — it is the shape Safari wants:
 * paired with `type='video/mp4; codecs="hvc1"'` in the markup it takes the file
 * and composites the alpha, while Gecko refuses the codec outright and falls
 * through to the WebM. Serving the same bytes as `video/quicktime` breaks that:
 * Gecko *accepts* quicktime, decodes the HEVC without an alpha path, and paints
 * a black rectangle.
 *
 * Uploads are incremental. `manifest.json` records the sha256 of every object
 * that has gone up, so a rerun sends only what is new or re-recorded — which is
 * the difference between a few seconds and re-pushing 120 MB of video every
 * time a single component changes.
 *
 *   bun run previews:sync           upload new/changed previews
 *   bun run previews:sync --dry     print the plan, send nothing
 *   bun run previews:sync --force   re-upload everything
 *   bun run previews:sync --prune   delete objects with no local file left
 *   bun run previews:sync --check   exit 1 when anything is out of sync (CI)
 */
import { readdir, stat } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";

import { mapLimit } from "../sync/lib/concurrency";
import { c, formatBytes, formatDuration, log } from "../sync/lib/log";
import { hashFile, readManifest, writeManifest } from "../lib/manifest";
import {
  objectExists,
  selectBackend,
  type BackendId,
} from "../lib/r2";
import { bucketSpec, config, type PreviewSourceId } from "./config";

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
${c.bold("preview sync")} — push the transparent page previews to ${c.cyan(config.bucket)}

${c.dim("Usage")}
  bun cloudflare/previews/index.ts [flags]

${c.dim("Sources")}
${config.sources
  .map(
    (source) =>
      `  ${c.cyan(`*${source.ext}`.padEnd(8))} ${c.dim(
        `← ${relative(config.rootDir, source.dir)}`,
      )}`,
  )
  .join("\n")}

${c.dim("Flags")}
  -n, --dry       print the plan, upload nothing
  -f, --force     re-upload every preview, ignoring the manifest
      --prune     delete objects whose local file no longer exists
      --verify    HEAD every unchanged object, so one missing from the bucket
                  is re-uploaded rather than trusted
      --check     exit 1 when anything is out of sync (for CI)
      --wrangler  force the wrangler backend
      --s3        force the direct S3 backend (needs R2 API credentials)
  -h, --help      show this help
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
  slug: string;
  source: PreviewSourceId;
  filePath: string;
  contentType: string;
  size: number;
  hash: string;
}

/** `chroma-backdrop-preview.mov` -> `chrome-backdrop`. */
function slugOf(fileName: string) {
  const stem = basename(fileName, extname(fileName)).replace(/-preview$/, "");
  return config.nameFixes[stem] ?? stem;
}

async function collect() {
  const files: Local[] = [];
  const slugs = new Set<string>();

  for (const source of config.sources) {
    let entries: string[];
    try {
      entries = await readdir(source.dir);
    } catch {
      throw new Error(
        `missing source directory: ${relative(config.rootDir, source.dir)} — ` +
          `run \`bun run cloud pull\` to restore it from the bucket`,
      );
    }

    const names = entries.filter((name) => {
      if (name.startsWith(".")) return false;
      // The masters folder holds one recording saved with an `.mp4` name that
      // is really QuickTime, so match on "not a webm" rather than on `.mov`.
      return source.ext === ".webm"
        ? extname(name) === ".webm"
        : extname(name) !== ".webm";
    });

    const collected = await mapLimit(names.sort(), 8, async (name) => {
      const filePath = join(source.dir, name);
      const slug = slugOf(name);
      const [{ size }, hash] = await Promise.all([stat(filePath), hashFile(filePath)]);

      return {
        key: `${slug}-preview${source.ext}`,
        slug,
        source: source.id,
        filePath,
        contentType: source.contentType,
        size,
        hash,
      } satisfies Local;
    });

    for (const file of collected) {
      slugs.add(file.slug);
      files.push(file);
    }
  }

  const duplicate = files.map((file) => file.key).find((key, i, all) => all.indexOf(key) !== i);
  if (duplicate) throw new Error(`two files map to the same object key: ${duplicate}`);

  return { files, slugs: [...slugs].sort() };
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP);
    return;
  }

  const startedAt = performance.now();
  const backend = selectBackend(bucketSpec, {
    force: flags.backend,
    concurrency: config.concurrency,
  });

  const { files, slugs } = await collect();
  const manifest = await readManifest(config.manifestPath, config.bucket);

  log.title(`Previews → ${c.cyan(config.bucket)}`);
  log.step(
    `${c.bold(String(slugs.length))} components · ${c.bold(String(files.length))} objects · ` +
      c.dim(`via ${backend.label}`),
  );
  log.blank();

  /* ---- plan ------------------------------------------------------------- */

  const pending: { file: Local; reason: string }[] = [];
  const unchanged: Local[] = [];
  /** Already in the bucket, but not yet in the ledger — recorded, not re-sent. */
  const adopted: Local[] = [];

  // A file the ledger has never heard of is not automatically a file the bucket
  // has never seen: a fresh clone, a manifest reset, or a first run after this
  // sync learned to keep a ledger all look identical from here. One free HEAD
  // per unknown object tells them apart, and turns what would be a 120 MB
  // re-upload into a few hundred requests.
  const untracked: Local[] = [];

  for (const file of files) {
    const tracked = manifest.entries[file.key];

    if (flags.force) pending.push({ file, reason: "forced" });
    else if (!tracked) untracked.push(file);
    else if (tracked.hash !== file.hash) pending.push({ file, reason: "re-recorded" });
    else unchanged.push(file);
  }

  if (untracked.length > 0) {
    log.step(`Checking ${c.bold(String(untracked.length))} unrecorded object(s) against the bucket…`);

    const checked = await mapLimit(untracked, 24, async (file) => {
      const remote = await objectExists(bucketSpec, file.key);
      // Preview bytes go up verbatim, so a size match on an object we have no
      // hash for is as much confirmation as exists without downloading it.
      return { file, present: remote.exists && remote.size === file.size };
    });

    for (const { file, present } of checked) {
      if (present) adopted.push(file);
      else pending.push({ file, reason: "new" });
    }
    log.blank();
  }

  // The ledger is local and can drift — a wiped bucket, a run that died halfway,
  // an object deleted by hand. `--verify` trades a free HEAD per object for the
  // certainty that what the manifest claims is really up there.
  if (flags.verify && unchanged.length > 0) {
    log.step(`Verifying ${c.bold(String(unchanged.length))} unchanged object(s)…`);

    const missing = await mapLimit(unchanged, 24, async (file) =>
      (await objectExists(bucketSpec, file.key)).exists ? null : file,
    );

    for (const file of missing) {
      if (!file) continue;
      pending.push({ file, reason: "missing from bucket" });
      unchanged.splice(unchanged.indexOf(file), 1);
    }
    log.blank();
  }

  /* ---- prune ------------------------------------------------------------ */

  // A renamed or deleted recording leaves its object behind with nothing local
  // to notice it by. It moves to the ledger's `orphaned` section so `pull` will
  // not put it straight back, and stays in the bucket until asked to go.
  const liveKeys = new Set(files.map((file) => file.key));

  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (liveKeys.has(key)) continue;
    (manifest.orphaned ??= {})[key] = entry;
    delete manifest.entries[key];
  }

  const orphaned = Object.keys(manifest.orphaned ?? {});

  if (orphaned.length > 0 && !flags.prune) {
    log.warn(
      `${orphaned.length} object(s) in the bucket have no local file — run with ` +
        `${c.bold("--prune")} to delete them:`,
    );
    log.skip(orphaned.join(", "));
    log.blank();
  }

  /* ---- report-only modes ------------------------------------------------ */

  const pendingBytes = pending.reduce((total, item) => total + item.file.size, 0);

  if (flags.check) {
    const problems = [...pending.map((item) => `${item.file.key} — ${item.reason}`)];
    if (flags.prune) problems.push(...orphaned.map((key) => `${key} — orphaned`));

    if (problems.length === 0) {
      log.success(`bucket is in sync (${files.length} objects)`);
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
        `would put ${c.bold(item.file.key)} ${c.dim(`(${formatBytes(item.file.size)}, ${item.reason})`)}`,
      );
    }
    if (pending.length > 20) log.info(c.dim(`…and ${pending.length - 20} more`));
    if (flags.prune) {
      for (const key of orphaned) log.info(`would delete ${c.bold(key)}`);
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

  if (flags.prune && orphaned.length > 0) {
    log.blank();
    log.step(`Deleting ${c.bold(String(orphaned.length))} orphaned object(s)…`);

    await mapLimit(orphaned, backend.concurrency, async (key) => {
      try {
        await backend.delete(key);
        delete manifest.orphaned![key];
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
    manifest.entries[file.key] ??= {
      file: relative(config.rootDir, file.filePath),
      hash: file.hash,
      size: file.size,
      contentType: file.contentType,
      uploadedAt: new Date().toISOString(),
    };
  }

  await writeManifest(config.manifestPath, manifest);

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
    ) +
      c.dim(` in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("preview sync failed"));
  process.exitCode = 1;
});
