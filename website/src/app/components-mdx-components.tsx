import type { MDXComponents } from "mdx/types";

import { getMDXComponents } from "@/app/mdx-components";
import { ComponentFiles } from "@/components/component-docs/component-files";
import { PackageInstall } from "@/components/component-docs/install-command";
import { PropsTable } from "@/components/component-docs/props-table";
import { SourceCode } from "@/components/component-docs/source-code";

/**
 * MDX mapping for the components section.
 *
 * It starts from the docs mapping and replaces the tags the component pages
 * were authored against. Two of them render nothing here on purpose: the
 * recording and the inline preview both moved to the preview column, so
 * leaving them in the flow would show the same thing twice.
 */
export function getComponentMDXComponents(
  components?: MDXComponents,
  /**
   * The component the page documents. Threaded through so a props table can
   * resolve `types/<slug>/index.ts` in the bucket instead of the site-root
   * path the page was authored with.
   */
  slug?: string,
): MDXComponents {
  return {
    ...getMDXComponents(),

    /**
     * Renders nothing. The tag survives in the pages as a carrier for the
     * dependency list, but the install block below it already names every
     * package — a row of chips repeating them was noise.
     */
    PreviewClient: () => null,

    /** Repeats the dependencies the header already shows. */
    PreviewComment: () => null,

    /** Hoisted into the preview column. */
    video: () => null,

    ComponentSource: ({ name }: { name: string }) => (
      <SourceCode kind="component" name={name} />
    ),

    /** The component's folder, where each file opens the source sheet. */
    ComponentFiles,

    ExampleComponentSource: ({ name }: { name: string }) => (
      <SourceCode kind="usage" name={name} />
    ),

    AutoTypeTable: ({ name }: { name: string }) => (
      <PropsTable name={name} slug={slug} />
    ),

    PackageInstall,

    ...components,
  };
}
