import { createSearchAPI } from "fumadocs-core/search/server";

import { source } from "#/lib/source";

/**
 * One index for the whole instance.
 *
 * Every page is tagged with its section, so a palette can scope itself to one
 * branch of the tree without a second index behind it.
 */
export const { GET } = createSearchAPI("advanced", {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
  indexes: source.getPages().map((page) => ({
    id: page.url,
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    structuredData: page.data.structuredData,
    tag: page.slugs[0] ?? "docs",
  })),
});
