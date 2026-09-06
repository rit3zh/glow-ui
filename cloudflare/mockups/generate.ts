/**
 * Writes the typed registry the docs read the mockups out of.
 *
 * The bucket is private to anyone without the account, and nothing can list it
 * from the website's build. This file is the listing: names, categories, sizes,
 * aspects and public URLs, produced from the same walk that does the upload, so
 * the registry can never describe a set of objects that was not just pushed.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { categories, config, type CategoryId } from "./config";

export interface GeneratedMockup {
  name: string;
  title: string;
  category: CategoryId;
  fileName: string;
  key: string;
  contentType: string;
  size: number;
  hash: string;
  /** Recorded when the PNG header could be read; null in the output otherwise. */
  width?: number;
  height?: number;
  /** The block this is a screenshot of, or null when there is no block yet. */
  block: string | null;
}

const HEADER = `/**
 * AUTO-GENERATED — do not edit by hand.
 *
 * Source of truth: cloudflare/v2-mockups/ + cloudflare/mockups/config.ts
 * Regenerate with: bun run mockups:sync
 */`;

export async function writeGeneratedFile(
  mockups: readonly GeneratedMockup[],
  origin: string,
) {
  const sorted = [...mockups].sort(
    (a, b) =>
      categories.findIndex((category) => category.id === a.category) -
        categories.findIndex((category) => category.id === b.category) ||
      a.name.localeCompare(b.name),
  );

  const entries = sorted
    .map((mockup) => {
      // The key is stable across re-exports, so the content hash rides along as
      // a query — that is what lets the upload carry `immutable` without
      // pinning a stale image forever.
      const url = `${origin}/${mockup.key
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")}?v=${mockup.hash.slice(0, 8)}`;

      return [
        "  {",
        `    name: ${JSON.stringify(mockup.name)},`,
        `    title: ${JSON.stringify(mockup.title)},`,
        `    category: ${JSON.stringify(mockup.category)},`,
        `    fileName: ${JSON.stringify(mockup.fileName)},`,
        `    contentType: ${JSON.stringify(mockup.contentType)},`,
        `    bucketKey: ${JSON.stringify(mockup.key)},`,
        `    bucketURL: ${JSON.stringify(url)},`,
        `    size: ${mockup.size},`,
        `    hash: ${JSON.stringify(mockup.hash.slice(0, 16))},`,
        `    width: ${mockup.width ?? "null"},`,
        `    height: ${mockup.height ?? "null"},`,
        `    aspect: ${
          mockup.width && mockup.height
            ? Number((mockup.width / mockup.height).toFixed(4))
            : "null"
        },`,
        `    block: ${mockup.block ? JSON.stringify(mockup.block) : "null"},`,
        "  },",
      ].join("\n");
    })
    .join("\n");

  const namesUnion = sorted.length
    ? sorted.map((mockup) => `  | ${JSON.stringify(mockup.name)}`).join("\n")
    : "  never";

  const categoryEntries = categories
    .map((category) => {
      const count = sorted.filter((mockup) => mockup.category === category.id).length;
      return [
        "  {",
        `    id: ${JSON.stringify(category.id)},`,
        `    title: ${JSON.stringify(category.title)},`,
        `    description: ${JSON.stringify(category.description)},`,
        `    count: ${count},`,
        "  },",
      ].join("\n");
    })
    .join("\n");

  const contents = `${HEADER}

export const V2_MOCKUPS_ORIGIN = ${JSON.stringify(origin)} as const;

/** Every key in the bucket lives under this prefix. */
export const V2_MOCKUPS_PREFIX = ${JSON.stringify(config.keyPrefix)} as const;

export type MockupCategoryId =
${categories.map((category) => `  | ${JSON.stringify(category.id)}`).join("\n")};

export type MockupName =
${namesUnion};

export interface MockupCategory {
  id: MockupCategoryId;
  /** Human readable label. */
  title: string;
  /** One line, for a category header or a card. */
  description: string;
  /** How many mockups are filed under it. */
  count: number;
}

export interface Mockup {
  /** Slug, derived from the file name. */
  name: MockupName;
  /** Human readable label. */
  title: string;
  /** Which block category this belongs to. */
  category: MockupCategoryId;
  /** Original file name on disk. */
  fileName: string;
  /** MIME type the bucket serves it with. */
  contentType: string;
  /** Object key inside the \`${config.bucket}\` bucket. */
  bucketKey: string;
  /** Fully qualified public URL, with a content hash for cache busting. */
  bucketURL: string;
  /** Size in bytes. */
  size: number;
  /** Truncated sha256 of the uploaded file. */
  hash: string;
  /** Pixel size, or null when the header could not be read. */
  width: number | null;
  height: number | null;
  /** width ÷ height. What a gallery weights its row layout by. */
  aspect: number | null;
  /** The block this is a screenshot of, relative to the repo root. */
  block: string | null;
}

export const mockupCategories = [
${categoryEntries}
] as const satisfies readonly MockupCategory[];

export const v2Mockups = [
${entries}
] as const satisfies readonly Mockup[];

export const v2MockupsByName = Object.fromEntries(
  v2Mockups.map((mockup) => [mockup.name, mockup]),
) as Record<MockupName, Mockup>;

export function getMockup(name: MockupName): Mockup;
export function getMockup(name: string): Mockup | undefined;
export function getMockup(name: string): Mockup | undefined {
  return v2MockupsByName[name as MockupName];
}

export function getMockupURL(name: MockupName): string;
export function getMockupURL(name: string): string | undefined;
export function getMockupURL(name: string): string | undefined {
  return getMockup(name)?.bucketURL;
}

export function getMockupsByCategory(category: MockupCategoryId): Mockup[] {
  return v2Mockups.filter((mockup) => mockup.category === category);
}

export const mockupsByCategory = Object.fromEntries(
  mockupCategories.map((category) => [category.id, getMockupsByCategory(category.id)]),
) as Record<MockupCategoryId, Mockup[]>;
`;

  for (const target of config.generatedTargets) {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents);
  }

  return config.generatedTargets;
}
