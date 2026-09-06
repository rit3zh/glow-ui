import { loadComponentTree } from "@/components/component-docs/source-code";
import { CodeFile } from "@/components/primitives-docs/code-file";
import { CODEBASE_FOLDERS, resolveComponentDir } from "@/lib/codebase";

/**
 * Every file a primitive ships, one collapsed code block each.
 *
 * The loader is the components section's — same bucket, same build-time
 * highlighting, so the whole folder ships with the page and expanding a file
 * costs nothing. Only the presentation is the primitives' own: the components
 * section keeps its folder tree and its source sheet.
 *
 * The highlighted markup is requested without a height cap, because the block
 * that holds it owns the height — it animates between a collapsed window and
 * the file's real height, and a `pre` with its own `max-height` would report a
 * height the block could never reach.
 */
export async function PrimitiveFiles({
  name,
  path,
}: {
  name: string;
  /** Overrides the directory the files land in, relative to the project root. */
  path?: string;
}) {
  const entries = await loadComponentTree(
    CODEBASE_FOLDERS.core,
    name,
    "no-scrollbar px-5 py-4 font-mono text-[13px] leading-[1.7]",
  );

  // The install path mirrors where the primitive sits in the library, so a
  // header reads `components/primitives/alert/index.tsx` rather than a guess.
  const dir = await resolveComponentDir(CODEBASE_FOLDERS.core, name);
  const installPath = path ?? `components/${dir ?? name}`;

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border-[0.5px] border-border bg-card px-4 py-3 text-[13px] text-muted-foreground">
        Source for <code className="font-mono">{name}</code> is not synced yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <CodeFile
          code={entry.code}
          filename={entry.filename}
          key={entry.path}
          path={`${installPath}/${entry.path}`}
        >
          {entry.rendered}
        </CodeFile>
      ))}
    </div>
  );
}
