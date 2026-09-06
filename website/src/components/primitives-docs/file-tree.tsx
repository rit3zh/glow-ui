"use client";

import { useReducedMotion } from "motion/react";
import { ChevronRight, FolderIcon, FolderOpenIcon } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { CopyButton } from "@/components/buttons/copy";
import { FileTypeIcon } from "@/components/component-docs/file-type-icons";
import { docsSurface } from "@/components/component-docs/surface";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * The primitives section's file tree.
 *
 * Deliberately not the components section's tree, and not built on the radix
 * accordion it uses. Two reasons, and both are the point of it existing:
 *
 * 1. `Accordion.Header` renders a real `<h3>`, and the docs prose scale gives
 *    every `<h3>` a heading's margins — 44px per folder row, which is the gap
 *    that made this card twice as tall as its contents.
 * 2. Clicking a file here opens its source *underneath the row*, sliding the
 *    rest of the tree down, rather than raising a sheet over the page. You stay
 *    where you are and the file arrives in place.
 *
 * The components section keeps its sheet. Nothing here is shared with it
 * beyond the icons and the card surface.
 */

export interface FileTreeEntry {
  /** Path inside the component's own folder, e.g. `hooks/useAlert.ts`. */
  path: string;
  /** The name shown in the tree, e.g. `index.tsx`. */
  filename: string;
  /** The raw file, for the copy button. */
  code: string;
  /** Highlighted markup, prepared on the server. */
  rendered: ReactNode;
}

type TreeNode =
  | { kind: "file"; name: string; entry: FileTreeEntry }
  | { kind: "folder"; name: string; path: string; children: TreeNode[] };

const ROW =
  "group relative flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors duration-150 hover:bg-accent/60";

/**
 * A nesting level: the indent, and the rule beside it.
 *
 * A real left border rather than a positioned pseudo-element. It is the same
 * line, but it cannot end up detached from the rows it belongs to, and the
 * indent is the padding that holds it — one property, so a level can never
 * shift without its rule following.
 */
const BRANCH = "ml-3 border-l border-border/60 pl-4";

/** Groups entries by directory, so nested files render as nested folders. */
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
    nodes.push({
      kind: "folder",
      name,
      path,
      children: buildTree(children, path),
    });
  }

  return nodes;
}

/**
 * How long a disclosure takes, and on what curve.
 *
 * The curve is decisive at the end rather than asymptotic — the whole point of
 * not using a spring here.
 */
const COLLAPSE_MS = 260;
const COLLAPSE_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/**
 * The open/close slide, shared by every level.
 *
 * A grid row going `1fr` ↔ `0fr`, transitioned by CSS. Nothing is measured,
 * so nothing can be measured wrong or measured late.
 *
 * It got here by way of two worse versions, and both failures are the reason
 * for this one:
 *
 * - Animating `height: auto` made Motion re-measure the subtree every frame.
 *   This subtree is a code panel with its own `max-height` and scroller, so it
 *   re-laid out continuously and the scrollbar flickered in and out.
 * - Animating to a measured pixel height fixed the reflow but not the feel,
 *   because a spring settles asymptotically: `restDelta` keeps it ticking
 *   through the last fractions of a pixel, and against `overflow: hidden` those
 *   fractions round back and forth across the clip edge. The content shudders
 *   by a pixel while the spring finishes — which is exactly what "jagged on
 *   dismiss" looks like.
 *
 * An `fr` interpolation has neither problem: the browser animates the track
 * itself, off the main thread, and it lands on `0fr` exactly.
 *
 * The inner element carries `min-h-0` as well as `overflow-hidden` — a grid
 * item's default `min-height: auto` refuses to shrink below its content, which
 * would hold the row open at full height and animate nothing at all.
 */
function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : COLLAPSE_MS;

  return (
    <div
      className="grid"
      inert={!open}
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
        // Opacity runs shorter, so the panel has faded before the row finishes
        // closing rather than being visible against a sliver of itself.
        transition: [
          `grid-template-rows ${duration}ms ${COLLAPSE_EASE}`,
          `opacity ${Math.round(duration * 0.6)}ms ${COLLAPSE_EASE}`,
        ].join(", "),
      }}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

export function PrimitiveFileTree({
  path,
  entries,
}: {
  /** Directory the files land in, e.g. `components/primitives/alert`. */
  path: string;
  entries: FileTreeEntry[];
}) {
  const segments = ["your-project", ...path.split("/").filter(Boolean)];

  return (
    <div
      className={cn(
        docsSurface,
        "not-prose p-2 text-[14px] text-foreground",
        // The rows are the only headings-shaped thing in here; the prose scale
        // must not reach them.
        "[&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_h4]:m-0",
      )}
    >
      <PathChain depth={0} segments={segments} tree={buildTree(entries)} />
    </div>
  );
}

/**
 * The chain of parent directories.
 *
 * A single path rather than a real listing — one folder per segment, with only
 * the leaf holding files — so it is always open. It is a diagram of where the
 * files go, and a diagram you have to unfold is not one.
 */
function PathChain({
  segments,
  depth,
  tree,
}: {
  segments: string[];
  depth: number;
  tree: TreeNode[];
}) {
  const isLeaf = depth === segments.length - 1;

  return (
    <div>
      <div className={cn(ROW, "cursor-default")}>
        <FolderOpenIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-sm">{segments[depth]}</span>
      </div>

      <div className={BRANCH}>
        {isLeaf ? (
          <Nodes nodes={tree} />
        ) : (
          <PathChain depth={depth + 1} segments={segments} tree={tree} />
        )}
      </div>
    </div>
  );
}

/** One level of the component's own folder. */
function Nodes({ nodes }: { nodes: TreeNode[] }) {
  return (
    <>
      {nodes.map((node) =>
        node.kind === "file" ? (
          <FileRow entry={node.entry} key={node.entry.path} name={node.name} />
        ) : (
          <FolderRow key={node.path} node={node} />
        ),
      )}
    </>
  );
}

/**
 * A file, and its source directly beneath it.
 *
 * Only one file's source is open at a time — the tree is a listing, and two
 * open panels turn it into a page you scroll rather than a folder you read.
 */
function FileRow({ entry, name }: { entry: FileTreeEntry; name: string }) {
  const [open, setOpen] = useState(false);
  /**
   * Whether this file's source has ever been shown.
   *
   * The highlighted markup is thousands of `span`s, each carrying inline
   * `--shiki-light` / `--shiki-dark` custom properties. Mounting all of them up
   * front put ~3,000 of those on a page against ~200 on a guide — and flipping
   * `.dark` on the document invalidates every one, which is why switching the
   * theme here stalled for about a second before anything moved. Nothing is
   * mounted until it is asked for; once open, it stays, so reopening is free.
   */
  const [mounted, setMounted] = useState(false);

  const toggle = () => {
    if (mounted) {
      setOpen((current) => !current);
      return;
    }

    // Mount closed, open on the next frame: the row has to be laid out at
    // `0fr` for the transition to have somewhere to animate from.
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  };

  return (
    <div>
      <button
        aria-expanded={open}
        className={cn(ROW, "cursor-pointer")}
        onClick={toggle}
        type="button"
      >
        <FileTypeIcon className="size-4 shrink-0" filename={name} />
        <span className="font-mono text-sm">{name}</span>
        <ChevronRight
          aria-hidden
          className={cn(
            "ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            "opacity-0 group-hover:opacity-100",
            open && "rotate-90 opacity-100",
          )}
        />
      </button>

      <Collapse open={open}>
        {mounted ? (
          <div className="py-1.5 pr-1">
            <div className="group/code relative overflow-hidden rounded-xl border-[0.5px] border-border/60 bg-code-surface">
              <CopyButton
                className="absolute right-2.5 top-2.5 z-10 border-[0.5px] border-border/60 bg-code-surface/80 text-muted-foreground opacity-0 shadow-none backdrop-blur transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover/code:opacity-100"
                content={entry.code}
                size="sm"
                variant="ghost"
              />
              {/* The `pre` arrives already padded and scroll-capped from the
                  highlighter, so the panel is exactly as tall as what it holds. */}
              {entry.rendered}
            </div>
          </div>
        ) : null}
      </Collapse>
    </div>
  );
}

/**
 * A subfolder of the component — `hooks/`, `types/`.
 *
 * Starts closed: the files that matter are at the top level, and a component
 * with three subfolders would otherwise open to a wall of rows.
 */
function FolderRow({
  node,
}: {
  node: Extract<TreeNode, { kind: "folder" }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={open}
        className={cn(ROW, "cursor-pointer")}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? (
          <FolderOpenIcon className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="text-sm">{node.name}</span>
      </button>

      <Collapse open={open}>
        <div className={BRANCH}>
          <Nodes nodes={node.children} />
        </div>
      </Collapse>
    </div>
  );
}
