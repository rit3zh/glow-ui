/**
 * The upload ledger shared by the media syncs.
 *
 * Keyed by object key rather than by component, because that is the thing the
 * bucket actually holds — one component contributes several objects (an mp4
 * master, a webm copy, a landing clip), and keying by component made them
 * fight over the same row.
 *
 * Each entry records where the bytes came from on disk, so the same file can
 * drive both directions: a sync compares the local hash against it, and a pull
 * on a fresh clone uses it as the list of what to download and where to put it.
 * That is why it is committed while the media itself is not.
 */
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export interface ManifestEntry {
  /** Path the bytes came from, relative to the repo root. */
  file: string;
  /** sha256 of the local file at upload time — catches silent re-encodes. */
  hash: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  /**
   * Pixel size, when the sync measured it.
   *
   * Recorded here rather than only in the generated registry because the ledger
   * has to outlive the local file: a media folder is a working directory, not
   * the set of everything in the bucket, and once the file is gone this is the
   * only record of what shape it was.
   */
  width?: number;
  height?: number;
}

export interface Manifest {
  bucket: string;
  updatedAt: string;
  /** object key -> entry, for objects that still have a local file. */
  entries: Record<string, ManifestEntry>;
  /**
   * Objects still in the bucket whose local file is gone — a renamed
   * recording, a deleted component, a fixed typo in a file name.
   *
   * They are moved here rather than dropped, because the ledger is the only
   * record that they exist at all: nothing else can list a private bucket, and
   * an entry silently deleted from `entries` would leave an object nobody can
   * find to remove. Keeping them apart is what stops `pull` from downloading
   * them straight back into the folder they were just removed from.
   */
  orphaned?: Record<string, ManifestEntry>;
}

const empty = (bucket: string): Manifest => ({
  bucket,
  updatedAt: new Date().toISOString(),
  entries: {},
  orphaned: {},
});

export async function readManifest(path: string, bucket: string): Promise<Manifest> {
  try {
    const parsed = JSON.parse(await readFile(path, "utf8")) as Partial<Manifest>;

    // A ledger written against a different bucket says nothing about this one.
    if (parsed.bucket !== bucket) return empty(bucket);

    return {
      ...empty(bucket),
      ...parsed,
      entries: parsed.entries ?? {},
      orphaned: parsed.orphaned ?? {},
    };
  } catch {
    return empty(bucket);
  }
}

export async function writeManifest(path: string, manifest: Manifest) {
  // Stable key order keeps the diff readable — this file is committed, and it
  // is the only record of a 200-object bucket.
  const sorted = (entries: Record<string, ManifestEntry>) =>
    Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b)));

  const orphaned = manifest.orphaned ?? {};

  await mkdir(dirname(path), { recursive: true });
  await writeFile(
    path,
    `${JSON.stringify(
      {
        ...manifest,
        updatedAt: new Date().toISOString(),
        entries: sorted(manifest.entries),
        ...(Object.keys(orphaned).length > 0 ? { orphaned: sorted(orphaned) } : {}),
      },
      null,
      2,
    )}\n`,
  );
}

export function hashFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

export const hashBuffer = (body: Buffer) =>
  createHash("sha256").update(body).digest("hex");
