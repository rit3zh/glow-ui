import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { join, posix, relative, sep } from "node:path";

import { config, contentTypeFor, type Source, type SourceId } from "../config";

export interface CodeFile {
  /** Which of the three bucket folders this belongs to. */
  source: SourceId;
  /** Absolute path on disk. */
  filePath: string;
  /** Path relative to the repo root — what gets printed. */
  displayPath: string;
  /** Path relative to the source dir, always posix separators. */
  relativePath: string;
  /** Full object key inside the bucket. */
  key: string;
  size: number;
  hash: string;
  contentType: string;
}

export interface SkippedFile {
  displayPath: string;
  reason: string;
}

function hashFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

/** Recursively lists every file under `dir`, honouring the ignore list. */
async function walk(dir: string, skipped: SkippedFile[]): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const found: string[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith(".") || config.ignoreNames.has(entry.name)) continue;

    const full = join(dir, entry.name);

    if (entry.isDirectory()) {
      found.push(...(await walk(full, skipped)));
      continue;
    }

    if (!entry.isFile()) {
      skipped.push({
        displayPath: relative(config.rootDir, full),
        reason: "not a regular file",
      });
      continue;
    }

    found.push(full);
  }

  return found;
}

export async function collectSource(source: Source) {
  const dir = join(config.rootDir, source.dir);
  const skipped: SkippedFile[] = [];

  let stats: Awaited<ReturnType<typeof stat>>;
  try {
    stats = await stat(dir);
  } catch {
    throw new Error(`source directory not found: ${source.dir}`);
  }
  if (!stats.isDirectory()) throw new Error(`not a directory: ${source.dir}`);

  const paths = await walk(dir, skipped);
  const files: CodeFile[] = [];

  for (const filePath of paths) {
    const displayPath = relative(config.rootDir, filePath);
    const { size } = await stat(filePath);

    if (size === 0) {
      skipped.push({ displayPath, reason: "empty file" });
      continue;
    }
    if (size > config.maxFileSize) {
      skipped.push({ displayPath, reason: `larger than ${config.maxFileSize} bytes` });
      continue;
    }

    const relativePath = relative(dir, filePath).split(sep).join(posix.sep);

    files.push({
      source: source.id,
      filePath,
      displayPath,
      relativePath,
      key: posix.join(source.prefix, relativePath),
      size,
      hash: await hashFile(filePath),
      contentType: contentTypeFor(filePath),
    });
  }

  return { files, skipped };
}
