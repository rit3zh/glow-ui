#!/usr/bin/env bun
/**
 * Media restore — fills the local media folders back in from R2.
 *
 * The recordings are the heaviest thing this project produces: ~230 MB of
 * QuickTime masters, VP9 copies and landing clips, most of it rewritten every
 * time a component is re-recorded. Keeping them in git meant every clone paid
 * for every version of every clip ever committed, so the bucket is the source
 * of truth and the folders are a working copy.
 *
 * What makes that safe is that the ledgers are committed even though the media
 * is not: `sync/manifest.json` and `previews/manifest.json` name every object,
 * where it belongs on disk, and its sha256. This walks them, downloads what is
 * missing or has drifted, and verifies the bytes it wrote.
 *
 * Downloads go through the buckets' public origins, so a fresh clone needs no
 * Cloudflare account, no wrangler login and no credentials at all.
 *
 *   bun run cloud pull                  restore anything missing
 *   bun run cloud pull --force          re-download everything
 *   bun run cloud pull --only previews  one set only
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { config as landingConfig } from "../sync/config";
import { mapLimit } from "../sync/lib/concurrency";
import { c, formatBytes, formatDuration, log } from "../sync/lib/log";
import { hashBuffer, hashFile, readManifest } from "../lib/manifest";
import { config as previewsConfig } from "../previews/config";
import { downloadObject, type BucketSpec } from "../lib/r2";

const ROOT = landingConfig.rootDir;

/** How many downloads run at once. Media sized, so not too many. */
const CONCURRENCY = 8;

interface Wanted {
  key: string;
  /** Absolute destination on disk. */
  filePath: string;
  hash: string;
  size: number;
  spec: BucketSpec;
  set: SetId;
}

type SetId = "landing" | "previews";

const SETS: { id: SetId; label: string }[] = [
  { id: "landing", label: "landing assets" },
  { id: "previews", label: "component previews" },
];

const setIds = SETS.map((set) => set.id);

interface Flags {
  dry: boolean;
  force: boolean;
  help: boolean;
  only: SetId[];
}

const HELP = `
${c.bold("media pull")} — restore the local media folders from R2

${c.dim("Usage")}
  bun cloudflare/pull/index.ts [flags]

${c.dim("Restores")}
  ${c.cyan("cloudflare/landing-assets/")}   ${c.dim("← reacticx-landing-assets")}
  ${c.cyan("cloudflare/v2-preview/")}       ${c.dim("← reacticx-v2-previews")}
  ${c.cyan("cloudflare/v2-preview-webm/")}  ${c.dim("← reacticx-v2-previews")}

${c.dim("Flags")}
      --only <ids>  comma separated: ${setIds.join(", ")}
  -n, --dry         list what would be downloaded, write nothing
  -f, --force       re-download files that are already correct
  -h, --help        show this help

${c.dim("Credentials")}
  None. Everything is read through the buckets' public origins.
`;

function parseFlags(argv: readonly string[]): Flags {
  const has = (...names: string[]) => names.some((name) => argv.includes(name));

  const index = argv.findIndex((arg) => arg === "--only" || arg.startsWith("--only="));
  const raw =
    index === -1 ? "" : argv[index]!.includes("=") ? argv[index]!.split("=")[1] : argv[index + 1];

  const requested = (raw ?? "").split(",").map((part) => part.trim()).filter(Boolean);
  const unknown = requested.filter((id) => !setIds.includes(id as SetId));
  if (unknown.length > 0) {
    throw new Error(`unknown set ${unknown.join(", ")} — expected ${setIds.join(", ")}`);
  }

  return {
    dry: has("--dry", "--dry-run", "-n"),
    force: has("--force", "-f"),
    help: has("--help", "-h"),
    only: requested as SetId[],
  };
}

async function collectWanted(only: readonly SetId[]) {
  const wanted: Wanted[] = [];
  const wants = (id: SetId) => only.length === 0 || only.includes(id);

  if (wants("landing")) {
    const manifest = await readManifest(landingConfig.manifestPath, landingConfig.bucket);
    const spec = {
      bucket: landingConfig.bucket,
      publicOrigin: landingConfig.publicOrigin,
    };

    // Keyed by object key, with the on-disk path recorded alongside — the same
    // shape the preview ledger uses.
    for (const [key, entry] of Object.entries(manifest.entries)) {
      wanted.push({
        key,
        filePath: join(ROOT, entry.file),
        hash: entry.hash,
        size: entry.size,
        spec,
        set: "landing",
      });
    }
  }

  if (wants("previews")) {
    const manifest = await readManifest(previewsConfig.manifestPath, previewsConfig.bucket);
    const spec = {
      bucket: previewsConfig.bucket,
      publicOrigin: previewsConfig.publicOrigin,
    };

    // Keyed by object key, with the on-disk path recorded alongside — the two
    // encodings of one preview land in different folders.
    for (const [key, entry] of Object.entries(manifest.entries)) {
      wanted.push({
        key,
        filePath: join(ROOT, entry.file),
        hash: entry.hash,
        size: entry.size,
        spec,
        set: "previews",
      });
    }
  }

  return wanted;
}

/** Whether the file on disk is already the file the ledger describes. */
async function isCurrent(item: Wanted) {
  const info = await stat(item.filePath).catch(() => null);
  if (!info) return false;

  // Size is the cheap discriminator; the hash is what actually decides.
  if (info.size !== item.size) return false;
  return (await hashFile(item.filePath)) === item.hash;
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP);
    return;
  }

  const startedAt = performance.now();
  const wanted = await collectWanted(flags.only);

  log.title("Media pull " + c.dim("← R2"));

  if (wanted.length === 0) {
    log.warn(
      "the ledgers are empty — run `bun run cloud push` first, or check out a " +
        "revision where cloudflare/*/manifest.json is populated",
    );
    log.end(c.dim("nothing to do"));
    return;
  }

  log.step(`${c.bold(String(wanted.length))} object(s) described by the ledgers`);
  log.blank();

  const missing = flags.force
    ? wanted
    : (await mapLimit(wanted, 16, async (item) => ((await isCurrent(item)) ? null : item))).filter(
        (item): item is Wanted => item !== null,
      );

  const bytes = missing.reduce((total, item) => total + item.size, 0);

  if (missing.length === 0) {
    log.success(`Every file is already present and matches (${wanted.length} objects)`);
    log.end(c.green("done"));
    return;
  }

  for (const set of SETS) {
    const count = missing.filter((item) => item.set === set.id).length;
    if (count > 0) log.step(`${c.cyan(set.label.padEnd(20))} ${c.bold(String(count))}`);
  }
  log.blank();

  if (flags.dry) {
    for (const item of missing.slice(0, 20)) {
      log.info(
        `would download ${c.bold(item.key)} ${c.dim(
          `→ ${relative(ROOT, item.filePath)} (${formatBytes(item.size)})`,
        )}`,
      );
    }
    if (missing.length > 20) log.info(c.dim(`…and ${missing.length - 20} more`));
    log.blank();
    log.end(c.yellow(`dry run — ${missing.length} file(s), ${formatBytes(bytes)}`));
    return;
  }

  log.step(
    `Downloading ${c.bold(String(missing.length))} file(s) ${c.dim(`(${formatBytes(bytes)})…`)}`,
  );

  const failures: string[] = [];
  let done = 0;

  await mapLimit(missing, CONCURRENCY, async (item) => {
    try {
      const body = await downloadObject(item.spec, item.key);

      if (!body) {
        throw new Error("not in the bucket — the ledger is ahead of what was uploaded");
      }

      // The ledger records what was uploaded; a mismatch means the object was
      // replaced out of band, and writing it silently would hide that.
      const hash = hashBuffer(body);
      if (hash !== item.hash) {
        throw new Error(
          `hash mismatch — bucket has ${hash.slice(0, 12)}, ledger expects ${item.hash.slice(0, 12)}`,
        );
      }

      await mkdir(dirname(item.filePath), { recursive: true });
      await writeFile(item.filePath, body);

      done += 1;
      log.success(
        `${c.dim(`[${done}/${missing.length}]`)} ${relative(ROOT, item.filePath)} ` +
          c.dim(formatBytes(item.size)),
      );
    } catch (error) {
      failures.push(`${item.key} — ${(error as Error).message}`);
      log.error(`${c.bold(item.key)} — ${(error as Error).message}`);
    }
  });

  log.blank();

  if (failures.length > 0) {
    log.end(c.red(`${failures.length} download(s) failed — rerun to retry`));
    process.exitCode = 1;
    return;
  }

  log.end(
    c.green(`${done} file(s) restored`) +
      c.dim(` in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("media pull failed"));
  process.exitCode = 1;
});
