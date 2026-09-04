#!/usr/bin/env bun
/**
 * Builds the WebM half of every component preview.
 *
 * The masters in `v2-preview/` are QuickTime screen recordings carrying HEVC
 * with an alpha channel, which only Safari composites. This produces the VP9 +
 * alpha copy that Chrome, Edge and Firefox need, so the docs can show the same
 * transparent recording in every browser.
 *
 * Two details are load-bearing, and getting either wrong silently produces an
 * opaque file rather than an error:
 *
 *  - The alpha plane has to be split out and merged back explicitly. ffmpeg
 *    negotiates the filter graph from the stream header, and Apple's HEVC
 *    reports `yuv420p` there even though the decoder does hand back alpha — so
 *    a plain transcode drops it.
 *  - `-auto-alt-ref 0` is required. libvpx discards the alpha plane when
 *    alt-ref frames are on, which is the default.
 *
 * Verify with `alphaextract`, and decode with `-c:v libvpx-vp9`: ffmpeg's own
 * native VP9 decoder does not expose alpha, so checking with it reports a false
 * negative on a file that is actually fine.
 */
import { spawn } from "node:child_process";
import { mkdir, readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";

import { mapLimit } from "../sync/lib/concurrency";
import { c, formatBytes, formatDuration, log } from "../sync/lib/log";
import { config } from "./config";

// Both folders come from the preview config, so the encoder and the sync can
// never disagree about where the masters live or where the copies go.
const SRC_DIR = config.sources[0].dir;
const OUT_DIR = config.sources[1].dir;

/** Encodes run in parallel; libvpx is single threaded enough to make it pay. */
const CONCURRENCY = 4;

function ffmpeg(args: readonly string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(stderr.trim().split("\n").pop() ?? `ffmpeg exited ${code}`)),
    );
  });
}

async function main() {
  const force = process.argv.includes("--force") || process.argv.includes("-f");
  const startedAt = performance.now();

  await mkdir(OUT_DIR, { recursive: true });

  // The masters folder holds one recording saved with an `.mp4` name that is
  // really QuickTime, so everything that is not already a WebM is a master.
  const masters = (await readdir(SRC_DIR))
    .filter((name) => !name.startsWith(".") && extname(name) !== ".webm")
    .sort();

  log.title(`Preview WebM ${c.dim("← v2-preview")}`);
  log.step(`${c.bold(String(masters.length))} master(s) · ${CONCURRENCY} at a time`);
  log.blank();

  let built = 0;
  let skipped = 0;
  const failures: string[] = [];

  await mapLimit(masters, CONCURRENCY, async (name) => {
    const stem = basename(name, extname(name));
    const input = join(SRC_DIR, name);
    const output = join(OUT_DIR, `${stem}.webm`);

    if (!force) {
      const existing = await stat(output).catch(() => null);
      if (existing && existing.size > 0) {
        skipped += 1;
        return;
      }
    }

    try {
      await ffmpeg([
        "-v", "error", "-y", "-i", input,
        "-filter_complex",
        "[0:v]alphaextract[a];[0:v]format=yuv420p[c];[c][a]alphamerge[o]",
        "-map", "[o]",
        "-c:v", "libvpx-vp9",
        "-pix_fmt", "yuva420p",
        "-auto-alt-ref", "0",
        "-b:v", "0", "-crf", "32",
        "-row-mt", "1", "-cpu-used", "2",
        "-an", output,
      ]);

      built += 1;
      const { size } = await stat(output);
      log.success(`${stem}.webm ${c.dim(formatBytes(size))}`);
    } catch (error) {
      failures.push(`${name} — ${(error as Error).message}`);
      log.error(`${c.bold(name)} — ${(error as Error).message}`);
    }
  });

  log.blank();
  if (skipped > 0) log.skip(`${skipped} already built — pass ${c.bold("--force")} to redo them`);

  if (failures.length > 0) {
    log.end(c.red(`${failures.length} encode(s) failed`));
    process.exitCode = 1;
    return;
  }

  log.end(
    c.green(`${built} encoded`) + c.dim(` in ${formatDuration(performance.now() - startedAt)}`),
  );
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("preview encode failed"));
  process.exitCode = 1;
});
