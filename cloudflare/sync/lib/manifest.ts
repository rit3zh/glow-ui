/**
 * The landing-asset ledger.
 *
 * Thin adapter over the shared manifest so both media syncs write the same
 * shape — keyed by object key, with the on-disk path recorded alongside the
 * hash. That uniformity is what lets `cloud pull` restore either set from its
 * ledger alone, which is the whole reason the media itself can stay out of git.
 *
 * Ledgers written before that change were keyed by component name and carried
 * the object key inside the entry; they are converted on read, so an existing
 * checkout does not re-upload 100 MB of video to catch up.
 */
import { readFile } from "node:fs/promises";
import { relative } from "node:path";

import { config, mediaTypeFor } from "../config";
import {
  hashFile,
  readManifest as readShared,
  writeManifest as writeShared,
  type Manifest,
  type ManifestEntry,
} from "../../lib/manifest";

export type { Manifest, ManifestEntry };

interface LegacyEntry {
  key: string;
  hash: string;
  size: number;
  uploadedAt: string;
}

/** True when the file on disk still uses the component-keyed shape. */
function isLegacy(entries: Record<string, unknown>) {
  const first = Object.values(entries)[0] as Partial<LegacyEntry & ManifestEntry> | undefined;
  return Boolean(first && first.key && !first.file);
}

function migrate(entries: Record<string, LegacyEntry>): Record<string, ManifestEntry> {
  const converted: Record<string, ManifestEntry> = {};

  for (const entry of Object.values(entries)) {
    converted[entry.key] = {
      file: `${relative(config.rootDir, config.sourceDir)}/${entry.key}`,
      hash: entry.hash,
      size: entry.size,
      contentType: mediaTypeFor(entry.key)?.contentType ?? "application/octet-stream",
      uploadedAt: entry.uploadedAt,
    };
  }

  return converted;
}

export async function readManifest(): Promise<Manifest> {
  const manifest = await readShared(config.manifestPath, config.bucket);

  // `readShared` drops anything it cannot type; re-read the raw file to see
  // whether what it dropped was a ledger in the old shape.
  try {
    const raw = JSON.parse(await readFile(config.manifestPath, "utf8")) as {
      bucket?: string;
      entries?: Record<string, LegacyEntry>;
    };

    if (raw.bucket === config.bucket && raw.entries && isLegacy(raw.entries)) {
      manifest.entries = migrate(raw.entries);
    }
  } catch {
    // No file, or unreadable — the empty ledger from `readShared` stands.
  }

  return manifest;
}

export const writeManifest = (manifest: Manifest) =>
  writeShared(config.manifestPath, manifest);

export { hashFile };
