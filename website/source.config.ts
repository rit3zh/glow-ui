import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import * as z from "zod";

import { remarkPackageInstall } from "./lib/remark-package-install";

/**
 * One documentation instance.
 *
 * `content/docs` carries `"root": true` in its `meta.json`, which is how
 * fumadocs scopes a sidebar to a branch of the tree. It is the only section
 * now, but the shape is what lets another be added as a sibling folder rather
 * than as a second collection with its own tree, search index and routes.
 */
const docsSchema = frontmatterSchema.extend({
  /** Pages can pin their own date; `lastModifiedTime: "git"` fills the rest. */
  lastModified: z.coerce.date().optional(),
  /** Recording shown in the preview column of a component page. */
  video: z.string().optional(),
  /**
   * The full demo shown in the preview column. Split out of `video:` by the
   * component sync, which is what authors it — see scripts/components.
   */
  previewVideo: z.string().optional(),
  /** Short loop a sidebar/landing card plays on hover. Derived, not authored. */
  hoverVideo: z.string().optional(),
  new: z.boolean().optional(),
  beta: z.boolean().optional(),
  alpha: z.boolean().optional(),
  updated: z.boolean().optional(),
  deprecated: z.boolean().optional(),
  author: z
    .object({
      name: z.string(),
      url: z.string().optional(),
    })
    .optional(),
  credits: z
    .object({
      name: z.string(),
      url: z.string().optional(),
    })
    .optional(),
});

/**
 * Three sections share the collection: `content/docs`, `content/components` and
 * `content/primitives`. Each carries `"root": true`, so each gets its own
 * sidebar branch off one tree, one search index and one set of routes.
 * `templates/` is a separate collection and stays out of the glob.
 */
const files = ["docs/**/*", "components/**/*", "primitives/**/*"];

export const docs = defineDocs({
  dir: "content",
  docs: {
    files,
    schema: docsSchema,
  },
  meta: {
    files,
    schema: metaSchema,
  },
});

export const templates = defineCollections({
  type: "doc",
  dir: "content/templates",
  schema: frontmatterSchema.extend({
    preview: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
  }),
});

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: (plugins) => [remarkPackageInstall, ...plugins],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "bash",
        "shell",
        "json",
        "css",
        "diff",
      ],
    },
  },
});
