import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { config, type MediaKind } from "../config";
import { toCamelCase, toPublicUrl, toTitle } from "./naming";

export interface GeneratedAsset {
  name: string;
  fileName: string;
  key: string;
  size: number;
  hash: string;
  kind: MediaKind;
  contentType: string;
  /**
   * Pixel size, when ffprobe could read it. Drives the gallery's row layout —
   * undefined means "no measurement", which the generated file writes as null.
   */
  width?: number;
  height?: number;
}

const HEADER = `/**
 * AUTO-GENERATED — do not edit by hand.
 *
 * Source of truth: cloudflare/landing-assets/
 * Regenerate with: bun run assets:sync
 */`;

export async function writeGeneratedFile(assets: readonly GeneratedAsset[]) {
  const sorted = [...assets].sort((a, b) => a.name.localeCompare(b.name));

  const entries = sorted
    .map((asset) => {
      // The object key is stable across re-records, so the content hash rides
      // along as a query. That is what lets the upload carry
      // `Cache-Control: immutable` (see `config.cacheControl`) without pinning
      // a stale clip forever — a re-recorded file hashes differently, so its
      // URL changes and every cache treats it as a new object.
      const version = asset.hash.slice(0, 8);
      const url = `${toPublicUrl(asset.key)}?v=${version}`;
      return [
        "  {",
        `    name: ${JSON.stringify(asset.name)},`,
        `    title: ${JSON.stringify(toTitle(asset.name))},`,
        `    fileName: ${JSON.stringify(asset.fileName)},`,
        `    kind: ${JSON.stringify(asset.kind)},`,
        `    contentType: ${JSON.stringify(asset.contentType)},`,
        `    bucketKey: ${JSON.stringify(asset.key)},`,
        `    bucketURL: ${JSON.stringify(url)},`,
        `    size: ${asset.size},`,
        `    hash: ${JSON.stringify(asset.hash.slice(0, 16))},`,
        `    width: ${asset.width ?? "null"},`,
        `    height: ${asset.height ?? "null"},`,
        `    aspect: ${
          asset.width && asset.height
            ? Number((asset.width / asset.height).toFixed(4))
            : "null"
        },`,
        "  },",
      ].join("\n");
    })
    .join("\n");

  const namesUnion = sorted.length
    ? sorted.map((asset) => `  | ${JSON.stringify(asset.name)}`).join("\n")
    : "  never";

  const contents = `${HEADER}

export const LANDING_ASSETS_ORIGIN = ${JSON.stringify(config.publicOrigin)} as const;

export type LandingAssetName =
${namesUnion};

export interface LandingAsset {
  /** Component slug, derived from the file name. */
  name: LandingAssetName;
  /** Human readable label. */
  title: string;
  /** Original file name on disk. */
  fileName: string;
  /** Whether to render this with a <video> or an <img>. */
  kind: "video" | "image";
  /** MIME type the bucket serves it with. */
  contentType: string;
  /** Object key inside the \`${config.bucket}\` bucket. */
  bucketKey: string;
  /** Fully qualified public URL. */
  bucketURL: string;
  /** Size in bytes. */
  size: number;
  /** Truncated sha256 of the uploaded file — useful for cache busting. */
  hash: string;
  /** Pixel size, or null when ffprobe could not read the file. */
  width: number | null;
  height: number | null;
  /** width ÷ height. What the gallery weights its row layout by. */
  aspect: number | null;
}

export const landingAssets = [
${entries}
] as const satisfies readonly LandingAsset[];

export const landingAssetsByName = Object.fromEntries(
  landingAssets.map((asset) => [asset.name, asset]),
) as Record<LandingAssetName, LandingAsset>;

export function getLandingAsset(name: LandingAssetName): LandingAsset;
export function getLandingAsset(name: string): LandingAsset | undefined;
export function getLandingAsset(name: string): LandingAsset | undefined {
  return landingAssetsByName[name as LandingAssetName];
}

export function getLandingAssetURL(name: LandingAssetName): string;
export function getLandingAssetURL(name: string): string | undefined;
export function getLandingAssetURL(name: string): string | undefined {
  return getLandingAsset(name)?.bucketURL;
}

export const landingVideos = landingAssets.filter((asset) => asset.kind === "video");
export const landingImages = landingAssets.filter((asset) => asset.kind === "image");
`;

  for (const target of config.generatedTargets) {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents);
  }
}

/** Exported for tests / debugging. */
export const generatedExportName = (name: string) => toCamelCase(name);
