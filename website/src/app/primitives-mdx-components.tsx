import type { MDXComponents } from "mdx/types";

import { getMDXComponents } from "@/app/mdx-components";
import { PackageInstall } from "@/components/component-docs/install-command";
import { SourceCode } from "@/components/component-docs/source-code";
import { ComponentInstall } from "@/components/primitives-docs/component-install";
import { ComponentPreview } from "@/components/primitives-docs/component-preview";
import { PropTable } from "@/components/primitives-docs/prop-table";

/**
 * MDX mapping for the primitives section.
 *
 * Modelled on the Unlumen docs: a page opens with `<ComponentPreview>`, then
 * Installation, Usage, and an API reference built from `<PropTable>`. The tags
 * are deliberately not the components section's — those pages hoist their
 * preview into a second column and render nothing in the flow, which is the
 * opposite of what a primitive's page wants.
 *
 * Everything under the hood is shared: the same codebase bucket, the same
 * highlighter, the same package-manager tabs. Only the presentation differs.
 */
export function getPrimitivesMDXComponents(
  components?: MDXComponents,
  /**
   * The primitive the page documents. Threaded through so a props table can
   * resolve `types/<slug>/index.ts` in the bucket without the page naming a
   * path that has to be kept in step with the library layout.
   */
  slug?: string,
): MDXComponents {
  return {
    ...getMDXComponents(),

    /** The recording, with the component's source behind a tab. */
    ComponentPreview,

    /**
     * A props table — either read from the bucket by interface name, or
     * written out in the page the way Unlumen's `TypeTable` is.
     */
    PropTable: (props: React.ComponentProps<typeof PropTable>) => (
      <PropTable slug={slug} {...props} />
    ),

    /** CLI or Manual, with the folder inside the manual steps. */
    ComponentInstall,

    /** A usage example, highlighted from the synced `app/components` tree. */
    ComponentUsage: ({ name }: { name: string }) => (
      <SourceCode kind="usage" name={name} />
    ),

    PackageInstall,

    ...components,
  };
}
