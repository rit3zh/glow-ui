import {
  ComponentFileTree,
  type FileTreeEntry,
} from "@/components/component-docs/component-file-tree";
import { loadComponentTree } from "@/components/component-docs/source-code";
import { CODEBASE_FOLDERS, resolveComponentDir } from "@/lib/codebase";

/**
 * A component's folder as a tree, with each file opening its own source sheet.
 *
 * The tree mirrors the real folder — `conf.ts`, `const.ts`, `utils.ts` and any
 * nested `hooks/` or `types/` directories included — rather than the two files
 * the docs used to hand-list. Highlighting happens here rather than in the
 * sheet, so every file ships with the page instead of costing a round trip the
 * first time one is clicked.
 */
export async function ComponentFiles({
  name,
  path,
}: {
  name: string;
  /** Overrides the directory the files land in, relative to the project root. */
  path?: string;
}) {
  const resolved = await loadComponentTree(CODEBASE_FOLDERS.core, name);

  // The install path mirrors where the component sits in the library, so the
  // tree shows `components/base/button` rather than a guessed category.
  const dir = await resolveComponentDir(CODEBASE_FOLDERS.core, name);
  const installPath = path ?? `components/${dir ?? name}`;

  if (resolved.length === 0) {
    return (
      <div className="rounded-xl border-[0.5px] border-border bg-card px-4 py-3 text-[13px] text-muted-foreground">
        Source for <code className="font-mono">{name}</code> is not synced yet.
      </div>
    );
  }

  return <ComponentFileTree entries={resolved} path={installPath} />;
}
