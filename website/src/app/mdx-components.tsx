import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { LazyVideo } from "@/components/docs/lazy-video";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    video: LazyVideo as MDXComponents["video"],
    ...components,
  };
}
