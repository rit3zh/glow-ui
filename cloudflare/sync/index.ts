#!/usr/bin/env bun
/**
 * Landing asset sync.
 *
 *   bun run assets:sync            upload new/changed media, then regenerate TS
 *   bun run assets:sync --dry      show the plan, change nothing
 *   bun run assets:sync --force    re-upload everything, ignoring the manifest
 *   bun run assets:sync --check    exit 1 if anything is out of sync (CI friendly)
 *
 * Nothing is uploaded twice: a file is skipped when its sha256 already sits in
 * the local manifest AND the object is present in the bucket.
 */
import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

import { config, mediaExtensions, mediaTypeFor, type MediaKind } from "./config";
import { mapLimit } from "./lib/concurrency";
import { writeGeneratedFile, type GeneratedAsset } from "./lib/generate";
import { c, formatBytes, formatDuration, log } from "./lib/log";
import { probeDimensions } from "./lib/dimensions";
import { hashFile, readManifest, writeManifest } from "./lib/manifest";
import { toComponentName, toObjectKey } from "./lib/naming";
import { deleteObject, objectExists, uploadObject, useBackend } from "./lib/r2";
import type { BackendId } from "../lib/r2";

interface Flags {
  dry: boolean;
  force: boolean;
  check: boolean;
  prune: boolean;
  help: boolean;
  backend?: BackendId;
}

function parseFlags(argv: readonly string[]): Flags {
  const has = (...names: string[]) => names.some((name) => argv.includes(name));
  return {
    dry: has("--dry", "--dry-run", "-n"),
    force: has("--force", "-f"),
    check: has("--check"),
    prune: has("--prune"),
    help: has("--help", "-h"),
    backend: has("--s3") ? "s3" : has("--wrangler") ? "wrangler" : undefined,
  };
}

const HELP = `
${c.bold("landing asset sync")} — push cloudflare/landing-assets/* to R2

${c.dim("Usage")}
  bun cloudflare/sync/index.ts [flags]

${c.dim("Flags")}
  -n, --dry       print the plan without uploading or writing files
  -f, --force     re-upload every asset, ignoring the manifest
      --prune     delete bucket objects whose local file is gone
      --check     exit 1 when something is missing (for CI)
      --wrangler  force the wrangler backend
      --s3        force the direct S3 backend (needs R2 API credentials)
  -h, --help      show this help

${c.dim("Credentials")}
  ${c.bold("wrangler login")} covers the default path. Set ${c.bold("R2_ACCOUNT_ID")},
  ${c.bold("R2_ACCESS_KEY_ID")} and ${c.bold("R2_SECRET_ACCESS_KEY")} — in the shell or in a
  ${c.bold(".env")} at the repo root — for the much faster direct S3 uploads.
`;

interface LocalAsset {
  name: string;
  fileName: string;
  filePath: string;
  key: string;
  size: number;
  hash: string;
  kind: MediaKind;
  contentType: string;
  /** Last write time — the tie-break when two files claim one component. */
  modifiedAt: number;
  width?: number;
  height?: number;
}

type Action = "upload" | "reupload" | "skip";

async function collectLocalAssets() {
  const all = (await readdir(config.sourceDir))
    .filter((file) => !file.startsWith("."))
    .sort();

  const supported = all.filter((file) => mediaTypeFor(file));
  const ignored = all.filter((file) => !mediaTypeFor(file));

  const assets = await mapLimit(supported, config.concurrency, async (fileName) => {
    const filePath = join(config.sourceDir, fileName);
    const [{ size, mtimeMs }, hash, dimensions] = await Promise.all([
      stat(filePath),
      hashFile(filePath),
      probeDimensions(filePath),
    ]);
    const media = mediaTypeFor(fileName)!;

    return {
      name: toComponentName(fileName),
      fileName,
      filePath,
      key: toObjectKey(fileName),
      size,
      hash,
      kind: media.kind,
      contentType: media.contentType,
      modifiedAt: mtimeMs,
      width: dimensions?.width,
      height: dimensions?.height,
    } satisfies LocalAsset;
  });

  return { assets, ignored };
}

/**
 * Splits the assets into the one that owns each component name and the rest.
 *
 * Two files can legitimately claim one component — a clip that was later
 * replaced by a still, say — and both still belong in the bucket: the object
 * key is the file name, so nothing collides up there. What cannot be shared is
 * the entry in the generated registry, since the site looks a component up by
 * name and expects one asset back.
 *
 * The most recently written file wins, on the grounds that it is the one that
 * was just added. It is a real decision rather than an obvious one, so the CLI
 * says which file lost every run instead of quietly picking.
 */
function resolveNameClashes(assets: readonly LocalAsset[]) {
  const byName = new Map<string, LocalAsset[]>();

  for (const asset of assets) {
    const group = byName.get(asset.name);
    if (group) group.push(asset);
    else byName.set(asset.name, [asset]);
  }

  const primary: LocalAsset[] = [];
  const shadowed: { winner: LocalAsset; loser: LocalAsset }[] = [];

  for (const group of byName.values()) {
    const [winner, ...rest] = [...group].sort((a, b) => b.modifiedAt - a.modifiedAt);
    primary.push(winner!);
    for (const loser of rest) shadowed.push({ winner: winner!, loser });
  }

  primary.sort((a, b) => a.name.localeCompare(b.name));
  return { primary, shadowed };
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP);
    return;
  }

  const startedAt = performance.now();
  const backend = useBackend(flags.backend);

  log.title(`Landing assets → ${c.cyan(config.bucket)}`);
  log.step(
    `${c.dim(relative(config.rootDir, config.sourceDir))} ${c.dim(`· via ${backend.label}`)}`,
  );
  log.blank();

  const { assets, ignored } = await collectLocalAssets();

  for (const fileName of ignored) {
    log.warn(
      `ignored ${c.bold(fileName)} ${c.dim(`— unsupported type, expected ${mediaExtensions.join(", ")}`)}`,
    );
  }

  if (assets.length === 0) {
    log.warn("no supported media files found — nothing to do");
    log.end(c.dim("done"));
    return;
  }

  const { primary, shadowed } = resolveNameClashes(assets);

  for (const { winner, loser } of shadowed) {
    log.warn(
      `${c.bold(loser.fileName)} and ${c.bold(winner.fileName)} both mean ${c.bold(winner.name)} — ` +
        c.dim(`both upload, but ${winner.fileName} is the one the site will use (newest)`),
    );
  }

  const manifest = await readManifest();

  // Decide what to do with each file: the manifest is the fast path, a remote
  // HEAD is the safety net so a wiped bucket still heals itself.
  log.step(`Checking ${c.bold(String(assets.length))} assets against the bucket…`);

  const plan = await mapLimit(assets, config.concurrency, async (asset) => {
    if (flags.force) return { asset, action: "reupload" as Action, reason: "forced" };

    const tracked = manifest.entries[asset.key];

    if (tracked && tracked.hash !== asset.hash) {
      return { asset, action: "reupload" as Action, reason: "file changed locally" };
    }

    let remote: Awaited<ReturnType<typeof objectExists>>;
    try {
      remote = await objectExists(asset.key);
    } catch (error) {
      throw new Error(
        `could not check ${asset.key}: ${(error as Error).message}`,
      );
    }

    if (!remote.exists) {
      return {
        asset,
        action: "upload" as Action,
        reason: tracked ? "missing from bucket" : "new",
      };
    }

    return { asset, action: "skip" as Action, reason: "already uploaded" };
  });

  const pending = plan.filter((item) => item.action !== "skip");
  const skipped = plan.filter((item) => item.action === "skip");

  log.blank();

  for (const item of skipped) {
    log.skip(`${item.asset.name} — ${item.reason}`);
  }

  if (pending.length === 0) {
    log.blank();
    log.success(`Bucket already in sync (${skipped.length} assets)`);
  } else if (flags.check) {
    log.blank();
    for (const item of pending) {
      log.error(`${item.asset.name} — ${item.reason}`);
    }
    log.end(c.red(`${pending.length} asset(s) out of sync`));
    process.exitCode = 1;
    return;
  } else if (flags.dry) {
    log.blank();
    for (const item of pending) {
      log.info(
        `would ${item.action === "reupload" ? "re-upload" : "upload"} ${c.bold(item.asset.name)} ${c.dim(
          `(${formatBytes(item.asset.size)}, ${item.reason})`,
        )}`,
      );
    }
    log.blank();
    log.end(c.yellow(`dry run — ${pending.length} pending, ${skipped.length} in sync`));
    return;
  } else {
    log.blank();
    log.step(`Uploading ${c.bold(String(pending.length))} asset(s)…`);

    let uploaded = 0;
    const failures: { name: string; message: string }[] = [];

    await mapLimit(pending, backend.concurrency, async (item) => {
      const { asset } = item;
      try {
        await uploadObject(asset.key, asset.filePath, asset.contentType);

        manifest.entries[asset.key] = {
          file: relative(config.rootDir, asset.filePath),
          hash: asset.hash,
          size: asset.size,
          contentType: asset.contentType,
          uploadedAt: new Date().toISOString(),
        };

        uploaded += 1;
        log.success(
          `${c.bold(asset.name)} ${c.dim(`${formatBytes(asset.size)} · ${item.reason}`)}`,
        );
      } catch (error) {
        failures.push({ name: asset.name, message: (error as Error).message });
        log.error(`${c.bold(asset.name)} — ${(error as Error).message}`);
      }
    });

    await writeManifest(manifest);

    if (failures.length > 0) {
      log.blank();
      log.end(
        c.red(`${failures.length} upload(s) failed`) +
          c.dim(` · ${uploaded} succeeded — rerun to retry`),
      );
      process.exitCode = 1;
      return;
    }
  }

  /* ---- prune ------------------------------------------------------------ */

  // A deleted or renamed recording leaves its object behind, and nothing local
  // is left to notice it by — only the ledger remembers it exists. It moves to
  // the ledger's `orphaned` section so a `pull` will not put it straight back,
  // and stays in the bucket until someone asks for it to go.
  {
    const live = new Set(assets.map((asset) => asset.key));

    for (const [key, entry] of Object.entries(manifest.entries)) {
      if (live.has(key)) continue;
      (manifest.orphaned ??= {})[key] = entry;
      delete manifest.entries[key];
    }

    // A key can come back. A recording gets restored, or an object that only
    // ever lived in the bucket is pulled down to become the tracked source.
    // The loop above only ever files keys *into* `orphaned`, and that section
    // persists in the ledger — so without this, a returning asset stays marked
    // orphaned while also being live, and the prune below deletes a file that
    // is currently on a page.
    if (manifest.orphaned) {
      for (const key of live) delete manifest.orphaned[key];
    }

    const orphaned = Object.entries(manifest.orphaned ?? {});

    if (orphaned.length > 0) {
      log.blank();

      if (!flags.prune) {
        log.warn(
          `${orphaned.length} object(s) in the bucket have no local file — run with ` +
            `${c.bold("--prune")} to delete them:`,
        );
        log.skip(orphaned.map(([key]) => key).join(", "));
      } else if (flags.dry || flags.check) {
        for (const [key, entry] of orphaned) {
          log.info(`would delete ${c.bold(key)} ${c.dim(`(${formatBytes(entry.size)})`)}`);
        }
      } else {
        log.step(`Deleting ${c.bold(String(orphaned.length))} orphaned object(s)…`);

        await mapLimit(orphaned, backend.concurrency, async ([key]) => {
          try {
            await deleteObject(key);
            delete manifest.orphaned![key];
            log.success(`deleted ${key}`);
          } catch (error) {
            log.error(`${c.bold(key)} — ${(error as Error).message}`);
          }
        });
      }
    }

    if (!flags.dry && !flags.check) await writeManifest(manifest);
  }

  // The generated file describes every local asset, uploaded in this run or not.
  if (!flags.dry && !flags.check) {
    const generated: GeneratedAsset[] = primary.map((asset) => ({
      name: asset.name,
      fileName: asset.fileName,
      key: asset.key,
      size: asset.size,
      hash: asset.hash,
      kind: asset.kind,
      contentType: asset.contentType,
      width: asset.width,
      height: asset.height,
    }));

    // Keep the manifest honest for assets that were already in the bucket.
    for (const asset of assets) {
      manifest.entries[asset.key] ??= {
        file: relative(config.rootDir, asset.filePath),
        hash: asset.hash,
        size: asset.size,
        contentType: asset.contentType,
        uploadedAt: new Date().toISOString(),
      };
    }
    await writeManifest(manifest);

    await writeGeneratedFile(generated);
    log.blank();
    for (const target of config.generatedTargets) {
      log.success(
        `Generated ${c.cyan(relative(config.rootDir, target))} ${c.dim(
          `(${generated.length} assets)`,
        )}`,
      );
    }
  }

  log.end(
    c.green("done") + c.dim(` in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("landing asset sync failed"));
  process.exitCode = 1;
});
