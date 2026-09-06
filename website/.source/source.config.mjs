// source.config.ts
import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema
} from "fumadocs-mdx/config";
import * as z from "zod";

// lib/remark-package-install.ts
function remarkPackageInstall() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];
        if (child.type === "code" && child.lang === "package-install") {
          node.children[index] = {
            type: "mdxJsxFlowElement",
            name: "PackageInstall",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "packages",
                value: (child.value ?? "").trim()
              }
            ],
            children: []
          };
          continue;
        }
        walk(child);
      }
    };
    walk(tree);
  };
}

// source.config.ts
var docsSchema = frontmatterSchema.extend({
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
  author: z.object({
    name: z.string(),
    url: z.string().optional()
  }).optional(),
  credits: z.object({
    name: z.string(),
    url: z.string().optional()
  }).optional()
});
var files = ["docs/**/*", "components/**/*", "primitives/**/*"];
var docs = defineDocs({
  dir: "content",
  docs: {
    files,
    schema: docsSchema
  },
  meta: {
    files,
    schema: metaSchema
  }
});
var templates = defineCollections({
  type: "doc",
  dir: "content/templates",
  schema: frontmatterSchema.extend({
    preview: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional()
  })
});
var source_config_default = defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: (plugins) => [remarkPackageInstall, ...plugins],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
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
        "diff"
      ]
    }
  }
});
export {
  source_config_default as default,
  docs,
  templates
};
