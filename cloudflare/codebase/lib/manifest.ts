import { readFile, writeFile } from "node:fs/promises";

import { config, type SourceId } from "../config";

export interface ManifestEntry {
  source: SourceId;
  /** Path relative to the repo root — makes the diff readable. */
  path: string;
  /** sha256 of the bytes that were uploaded. */
  hash: string;
  size: number;
  uploadedAt: string;
}

export interface Manifest {
  bucket: string;
  updatedAt: string;
  /** Keyed by object key, so a rename shows up as a delete + an add. */
  entries: Record<string, ManifestEntry>;
}

const empty = (): Manifest => ({
  bucket: config.bucket,
  updatedAt: new Date().toISOString(),
  entries: {},
});

export async function readManifest(): Promise<Manifest> {
  try {
    const parsed = JSON.parse(
      await readFile(config.manifestPath, "utf8"),
    ) as Partial<Manifest>;

    // A ledger written for a different bucket tells us nothing about this one.
    if (parsed.bucket !== config.bucket) return empty();

    return { ...empty(), ...parsed, entries: parsed.entries ?? {} };
  } catch {
    return empty();
  }
}

export async function writeManifest(manifest: Manifest) {
  const entries = Object.fromEntries(
    Object.entries(manifest.entries).sort(([a], [b]) => a.localeCompare(b)),
  );

  await writeFile(
    config.manifestPath,
    `${JSON.stringify({ ...manifest, updatedAt: new Date().toISOString(), entries }, null, 2)}\n`,
  );
}
