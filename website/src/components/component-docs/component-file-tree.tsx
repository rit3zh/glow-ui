"use client";

import { FolderIcon, FolderOpenIcon } from "lucide-react";
import type { Transition } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";

import {
  File,
  FileHighlight,
  FileIcon,
  FileLabel,
  Files,
  FilesHighlight,
  Folder,
  FolderContent,
  FolderHeader,
  FolderIcon as FolderIconSlot,
  FolderHighlight,
  FolderItem,
  FolderLabel,
  FolderTrigger,
} from "@/components/animate-ui/primitives/radix/files";
import { FileTypeIcon } from "@/components/component-docs/file-type-icons";
import { SourceDrawer } from "@/components/component-docs/source-drawer";
import { docsSurface } from "@/components/component-docs/surface";
import { cn } from "@/components/workspace-ui/lib/utils";

/** One spring for every level, so a collapse reads as a single motion. */
const TRANSITION: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  bounce: 0,
};

/** Every row is the same shape, so the highlight can travel between them. */
const ROW = "flex items-center gap-2 p-2 pointer-events-none";

export interface FileTreeEntry {
  /**
   * Path inside the component's own folder, e.g. `hooks/useTray.ts`.
   * Unique per entry, so it is also the key the open sheet is tracked by.
   */
  path: string;
  /** The name shown in the tree, e.g. `index.tsx`. */
  filename: string;
  /** The raw file, for the sheet's copy button. */
  code: string;
  /** Highlighted markup, prepared on the server. */
  rendered: ReactNode;
}

/** The component folder, rebuilt from the flat list of paths. */
type TreeNode =
  | { kind: "file"; name: string; entry: FileTreeEntry }
  | { kind: "folder"; name: string; path: string; children: TreeNode[] };

/**
 * Groups entries by their directory, so nested files render as nested folders.
 *
 * Input order decides output order — the loader already sorts loose files above
 * directories and puts the entry point first — so this only has to preserve it.
 */
function buildTree(entries: readonly FileTreeEntry[], prefix = ""): TreeNode[] {
  const nodes: TreeNode[] = [];
  const folders = new Map<string, FileTreeEntry[]>();

  for (const entry of entries) {
    const relative = entry.path.slice(prefix.length);
    const slash = relative.indexOf("/");

    if (slash === -1) {
      nodes.push({ kind: "file", name: relative, entry });
      continue;
    }

    const folder = relative.slice(0, slash);
    const bucket = folders.get(folder);
    if (bucket) bucket.push(entry);
    else folders.set(folder, [entry]);
  }

  for (const [name, children] of folders) {
    const path = `${prefix}${name}/`;
    nodes.push({ kind: "folder", name, path, children: buildTree(children, path) });
  }

  return nodes;
}

/**
 * A component's folder, as a tree whose files open their own source.
 *
 * This is built on the file primitives directly rather than on the styled
 * `Files` set the install-path tree uses: it needs one highlight spanning
 * every level so the hover plate travels between folders and files as a single
 * object, and it needs its rows to be buttons. Sharing the styled components
 * would mean changing them for both trees, and the install-path tree is a
 * static diagram that should keep its own quieter look.
 *
 * The chain of parent directories is a single path rather than a real listing,
 * so it is one folder per segment; only the leaf folder has files in it.
 * Clicking a file raises the same sheet the preview toolbar uses, so source
 * arrives the same way wherever it is asked for.
 */
export function ComponentFileTree({
  path,
  entries,
}: {
  /** Directory the files live in, e.g. `components/molecules/accordion`. */
  path: string;
  entries: FileTreeEntry[];
}) {
  const [openFile, setOpenFile] = useState<string | null>(null);
  const segments = ["your-project", ...path.split("/").filter(Boolean)];
  const active = entries.find((entry) => entry.path === openFile);
  const tree = buildTree(entries);

  return (
    <>
      {/* Each row pads itself by 8px and the tree by another 8px, which is the
          16px inset it wants — the card adds none of its own. */}
      <div className={cn(docsSurface, "px-0 py-2 text-[14px] text-foreground")}>
        <Files className="w-full p-2" defaultOpen={[value(segments, 0)]}>
          {/* One highlight for the whole tree, so hovering from a folder down
              onto a file slides the same plate rather than swapping two. */}
          <FilesHighlight className="pointer-events-none rounded-lg bg-accent">
            <Branch
              depth={0}
              onOpen={setOpenFile}
              segments={segments}
              tree={tree}
            />
          </FilesHighlight>
        </Files>
      </div>

      <SourceDrawer
        copyCode={active?.code}
        filename={active?.filename}
        onClose={() => setOpenFile(null)}
        open={Boolean(active)}
      >
        {active?.rendered}
      </SourceDrawer>
    </>
  );
}

/** A folder's accordion value is its own path, so it is unique per level. */
function value(segments: string[], depth: number) {
  return segments.slice(0, depth + 1).join("/");
}

function Branch({
  segments,
  depth,
  tree,
  onOpen,
}: {
  segments: string[];
  depth: number;
  tree: TreeNode[];
  onOpen: (path: string) => void;
}) {
  const segment = segments[depth];
  const isLeafFolder = depth === segments.length - 1;

  return (
    <FolderItem value={value(segments, depth)}>
      <FolderHeader>
        <FolderTrigger className="w-full cursor-pointer text-start">
          <FolderHighlight>
            <Folder className={ROW}>
              <FolderIconSlot
                closeIcon={<FolderIcon className="size-4.5" />}
                openIcon={<FolderOpenIcon className="size-4.5" />}
              />
              <FolderLabel className="text-sm">{segment}</FolderLabel>
            </Folder>
          </FolderHighlight>
        </FolderTrigger>
      </FolderHeader>

      <div className="relative ml-6 before:absolute before:inset-y-0 before:-left-2 before:h-full before:w-px before:bg-border">
        <FolderContent transition={TRANSITION}>
          {isLeafFolder ? (
            <Nodes nodes={tree} onOpen={onOpen} />
          ) : (
            // A nested `FolderItem` needs an accordion root above it, which is
            // what this second `Files` is — the highlight above still spans it.
            <Files className="w-full" defaultOpen={[value(segments, depth + 1)]}>
              <Branch
                depth={depth + 1}
                onOpen={onOpen}
                segments={segments}
                tree={tree}
              />
            </Files>
          )}
        </FolderContent>
      </div>
    </FolderItem>
  );
}

/**
 * The component's own folder, one level at a time.
 *
 * Its subfolders start closed: the files that matter are at the top level, and
 * a component with `hooks/`, `types/` and `helpers/` would otherwise open to a
 * wall of rows.
 */
function Nodes({
  nodes,
  onOpen,
}: {
  nodes: TreeNode[];
  onOpen: (path: string) => void;
}) {
  return (
    <>
      {nodes.map((node) =>
        node.kind === "file" ? (
          // The row itself is non-interactive so the highlight can sit under
          // it; the button around it is what makes the whole row a target
          // rather than just the label.
          <button
            className="w-full cursor-pointer text-start"
            key={node.entry.path}
            onClick={() => onOpen(node.entry.path)}
            type="button"
          >
            <FileHighlight>
              <File className={ROW}>
                <FileIcon className="inline-flex">
                  <FileTypeIcon className="size-4.5" filename={node.name} />
                </FileIcon>
                <FileLabel className="font-mono text-sm">{node.name}</FileLabel>
              </File>
            </FileHighlight>
          </button>
        ) : (
          <Files className="w-full" key={node.path}>
            <FolderItem value={node.path}>
              <FolderHeader>
                <FolderTrigger className="w-full cursor-pointer text-start">
                  <FolderHighlight>
                    <Folder className={ROW}>
                      <FolderIconSlot
                        closeIcon={<FolderIcon className="size-4.5" />}
                        openIcon={<FolderOpenIcon className="size-4.5" />}
                      />
                      <FolderLabel className="text-sm">{node.name}</FolderLabel>
                    </Folder>
                  </FolderHighlight>
                </FolderTrigger>
              </FolderHeader>

              <div className="relative ml-6 before:absolute before:inset-y-0 before:-left-2 before:h-full before:w-px before:bg-border">
                <FolderContent transition={TRANSITION}>
                  <Nodes nodes={node.children} onOpen={onOpen} />
                </FolderContent>
              </div>
            </FolderItem>
          </Files>
        ),
      )}
    </>
  );
}
