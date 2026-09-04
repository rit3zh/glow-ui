/**
 * Landing asset lookup.
 *
 * The data itself lives in `landing-assets.generated.ts`, written by
 * `bun run assets:sync` at the repo root. Everything here is hand-written and
 * safe to extend.
 *
 * Assets are keyed by component name (`"accordion"`, `"squricle"`), derived from
 * the file name in `cloudflare/landing-assets/`.
 */
import {
  LANDING_ASSETS_ORIGIN,
  landingAssets,
  landingAssetsByName,
  landingImages,
  landingVideos,
  type LandingAsset,
  type LandingAssetName,
} from "./landing-assets.generated";

export {
  LANDING_ASSETS_ORIGIN,
  landingAssets,
  landingImages,
  landingVideos,
  type LandingAsset,
  type LandingAssetName,
};

export type LandingAssetKind = LandingAsset["kind"];

/** Every component name that has an asset, alphabetically. */
export const landingAssetNames = landingAssets.map(
  (asset) => asset.name,
) as LandingAssetName[];

/**
 * Look up one asset. Known names are typed as always present; an arbitrary
 * string may return undefined.
 *
 *   getLandingAsset("accordion").bucketURL
 *   getLandingAsset(slugFromRoute)?.bucketURL
 */
export function getLandingAsset(name: LandingAssetName): LandingAsset;
export function getLandingAsset(name: string): LandingAsset | undefined;
export function getLandingAsset(name: string): LandingAsset | undefined {
  return landingAssetsByName[name as LandingAssetName];
}

/** Just the public URL, when that is all the caller needs. */
export function getLandingAssetURL(name: LandingAssetName): string;
export function getLandingAssetURL(name: string): string | undefined;
export function getLandingAssetURL(name: string): string | undefined {
  return getLandingAsset(name)?.bucketURL;
}

/**
 * The same catalogue keyed by file name stem — `"border-beam-landing-page-asset"`
 * rather than `"border-beam"`.
 */
const landingAssetsByFileStem = new Map(
  landingAssets.map((asset) => [asset.fileName.replace(/\.[^.]+$/, ""), asset]),
);

/**
 * Look up an asset by the file it was recorded as, for hand-curated lists that
 * name a specific recording instead of a component.
 *
 * Exists so those callers get `bucketURL` — which carries the `?v=<hash>` that
 * makes the object's `immutable` Cache-Control safe — rather than rebuilding a
 * URL from the origin and the file name and silently dropping the version.
 */
export function getLandingAssetByFile(stem: string): LandingAsset | undefined {
  return landingAssetsByFileStem.get(stem);
}

/** Cheap existence check — no need to destructure the result. */
export function hasLandingAsset(name: string): name is LandingAssetName {
  return name in landingAssetsByName;
}

/**
 * Resolve several at once, dropping the ones that do not exist. Handy for a
 * hand-curated showcase row where some entries may not have a video yet.
 */
export function getLandingAssets(names: readonly string[]): LandingAsset[] {
  return names
    .map((name) => getLandingAsset(name))
    .filter((asset): asset is LandingAsset => asset !== undefined);
}

export interface LandingAssetQuery {
  /** Only videos, or only images. Omit for both. */
  kind?: LandingAssetKind;
  /** Case-insensitive substring match against name and title. */
  search?: string;
  /** Skip anything larger than this, in bytes. */
  maxSize?: number;
  /** `"name"` (default) or `"size"`, ascending. */
  sort?: "name" | "size";
  /** Cap the result length. */
  limit?: number;
}

/**
 * Filtered view over the catalogue.
 *
 *   queryLandingAssets({ kind: "video", limit: 6 })
 *   queryLandingAssets({ search: "carousel" })
 */
export function queryLandingAssets(query: LandingAssetQuery = {}): LandingAsset[] {
  const { kind, search, maxSize, sort = "name", limit } = query;
  const needle = search?.trim().toLowerCase();

  let results = landingAssets.filter((asset) => {
    if (kind && asset.kind !== kind) return false;
    if (maxSize !== undefined && asset.size > maxSize) return false;
    if (
      needle &&
      !asset.name.toLowerCase().includes(needle) &&
      !asset.title.toLowerCase().includes(needle)
    ) {
      return false;
    }
    return true;
  });

  results =
    sort === "size"
      ? [...results].sort((a, b) => a.size - b.size)
      : [...results].sort((a, b) => a.name.localeCompare(b.name));

  return limit === undefined ? results : results.slice(0, limit);
}

/**
 * Everything a media element needs, already branched on kind. Returns undefined
 * for an unknown name so a component can render a fallback.
 *
 *   const props = getLandingAssetProps(slug);
 *   props?.kind === "video" ? <video {...props.props} /> : <img {...props.props} />
 */
export function getLandingAssetProps(name: string) {
  const asset = getLandingAsset(name);
  if (!asset) return undefined;

  if (asset.kind === "video") {
    return {
      kind: "video" as const,
      asset,
      props: {
        src: asset.bucketURL,
        autoPlay: true,
        muted: true,
        loop: true,
        playsInline: true,
        preload: "metadata" as const,
      },
    };
  }

  return {
    kind: "image" as const,
    asset,
    props: {
      src: asset.bucketURL,
      alt: `${asset.title} preview`,
      loading: "lazy" as const,
      decoding: "async" as const,
    },
  };
}
