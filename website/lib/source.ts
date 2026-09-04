import { loader, type InferMetaType, type InferPageType } from "fumadocs-core/source";
import { docs, templates } from "#/.source";

import { attachFile } from "#/lib/attach-file";
import { attachSeparator } from "#/lib/attach-separator";

/**
 * The single docs loader.
 *
 * `baseUrl` is the site root because the collection's own folder names are the
 * URL prefixes: `content/docs/usage.mdx` is `/docs/usage`. The folder is
 * marked `"root": true`, so fumadocs hands the layout that branch of the tree
 * rather than the tree itself.
 */
export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
  pageTree: {
    attachFile,
    attachSeparator,
  },
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;

/** Top-level sections, named by their first URL segment. */
export type DocsSection = "docs" | "components" | "primitives";

export const SECTIONS = ["docs", "components", "primitives"] as const;

/**
 * Resolve a page from a full slug (`["docs", "usage"]`). Used by the routes
 * that address every page at once — search and the `llms.mdx` endpoint — where
 * the section is just the head of the path rather than a separate input.
 */
export function resolveDocsSlug(slug: string[] = []) {
  const [section] = slug;
  if (!section || !SECTIONS.includes(section as DocsSection)) return;

  const page = source.getPage(slug);
  if (!page) return;

  return { section: section as DocsSection, page };
}

export { templates };

export interface SectionNavEntry {
  type: "separator" | "page";
  label: string;
  url?: string;
}

/**
 * A section's pages in `meta.json` order, separators included.
 *
 * The page tree carries the same order, but `attachSeparator` has already
 * replaced separator names with rendered markup by the time it is built —
 * this reads the plain labels the nav needs instead of unwrapping them.
 */
export function getSectionNav(
  section: DocsSection,
  order: string[],
): SectionNavEntry[] {
  return order.flatMap<SectionNavEntry>((entry) => {
    const separator = /^---(.+)---$/.exec(entry);
    if (separator) {
      return [{ type: "separator", label: separator[1].trim() }];
    }

    const page = source.getPage([section, entry]);
    if (!page) return [];

    return [{ type: "page", label: page.data.title, url: page.url }];
  });
}
