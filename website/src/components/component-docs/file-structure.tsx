"use client";

import { FileIcon } from "lucide-react";
import type { Transition } from "motion/react";

import {
  FileItem,
  Files,
  FolderContent,
  FolderItem,
  FolderTrigger,
  SubFiles,
} from "@/components/animate-ui/components/radix/files";
import { docsSurface } from "@/components/component-docs/surface";
import { cn } from "@/components/workspace-ui/lib/utils";

/** One spring for every level, so a collapse reads as a single motion. */
const TRANSITION: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  bounce: 0,
};

function AccentFileIcon({ className }: { className?: string }) {
  return <FileIcon className={cn(className, "text-accent-pro")} />;
}

/**
 * Where the CLI writes a component, as a tree.
 *
 * The path is a single chain rather than a real directory listing, so the tree
 * is one folder per segment with the file at the bottom. Each level is its own
 * accordion root — a nested `FolderItem` needs a `SubFiles` above it — and
 * every folder starts open so the destination is visible without a click.
 */
export function FileStructure({ path }: { path: string }) {
  const segments = ["your-project", ...path.split("/").filter(Boolean)];

  return (
    // `Files` pads itself by 8px and each row by another 8px, which is the
    // 16px inset the tree wants — the card adds none of its own.
    <div className={cn(docsSurface, "px-0 py-2 text-[14px]")}>
      <Files defaultOpen={[value(segments, 0)]}>
        <Branch depth={0} segments={segments} />
      </Files>
    </div>
  );
}

/** A folder's accordion value is its own path, so it is unique per level. */
function value(segments: string[], depth: number) {
  return segments.slice(0, depth + 1).join("/");
}

function Branch({ segments, depth }: { segments: string[]; depth: number }) {
  const segment = segments[depth];
  const isFile = depth === segments.length - 1;

  if (isFile) {
    return (
      <FileItem className="font-mono text-accent-pro" icon={AccentFileIcon}>
        {segment}
      </FileItem>
    );
  }

  const child = <Branch depth={depth + 1} segments={segments} />;
  const childIsFile = depth + 1 === segments.length - 1;

  return (
    <FolderItem value={value(segments, depth)}>
      <FolderTrigger>{segment}</FolderTrigger>
      <FolderContent transition={TRANSITION}>
        {childIsFile ? (
          child
        ) : (
          <SubFiles defaultOpen={[value(segments, depth + 1)]}>{child}</SubFiles>
        )}
      </FolderContent>
    </FolderItem>
  );
}
