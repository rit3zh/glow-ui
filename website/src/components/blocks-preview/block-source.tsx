"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

import { CopyButton } from "@/components/buttons/copy";
import { cn } from "@/components/workspace-ui/lib/utils";

export interface BlockSourceFile {
  /** Path inside the block's own folder, e.g. `const.ts`. Also the tab id. */
  path: string;
  /** The raw file, for the copy button. */
  code: string;
  /** Highlighted markup, prepared on the server. */
  rendered: ReactNode;
}

/**
 * A block's folder, one tab per file.
 *
 * A block is three or four files — the screen, its constants, its types — which
 * is a tab row rather than the collapsible tree the component pages use: at
 * this size a tree is a folder you have to open before you can read anything.
 *
 * The row is filenames on the panel's own edge with a rule travelling under the
 * open one — a pill per tab put a second, brighter surface on top of the one
 * the code already sits in, and three of those in a row read as buttons to
 * press rather than as the files they name. Every file stays mounted, so
 * switching is a class change and each keeps its scroll position.
 */
export function BlockSource({ files }: { files: readonly BlockSourceFile[] }) {
  const [active, setActive] = useState(files[0]?.path ?? "");
  const reduceMotion = useReducedMotion();
  const current = files.find((file) => file.path === active) ?? files[0];

  if (!current) return null;

  return (
    <div className="overflow-hidden rounded-2xl border-[0.5px] border-white/8 bg-white/[0.02]">
      <div className="flex items-stretch justify-between gap-2 border-b-[0.5px] border-white/8 pr-2 pl-1">
        <div
          aria-label="Block source files"
          className="no-scrollbar flex min-w-0 items-stretch overflow-x-auto"
          role="tablist"
        >
          {files.map((file) => {
            const selected = file.path === active;

            return (
              <button
                aria-selected={selected}
                className={cn(
                  "relative shrink-0 px-3 py-3 font-mono text-[12.5px] transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-accent-pro/40",
                  selected ? "text-ink" : "text-ink/35 hover:text-ink/70",
                )}
                key={file.path}
                onClick={() => setActive(file.path)}
                role="tab"
                type="button"
              >
                {file.path}
                {selected ? (
                  // Sits on the header's own rule rather than beside the label,
                  // so the open file is marked by the panel edge lighting up
                  // under it.
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-px h-px bg-accent-pro"
                    layoutId="block-source-underline"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 480, damping: 40 }
                    }
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center">
          <CopyButton
            className="size-8 text-ink/35 hover:bg-white/[0.05] hover:text-ink/80"
            content={current.code}
            size="sm"
            variant="ghost"
          />
        </div>
      </div>

      {files.map((file) => (
        <div hidden={file.path !== active} key={file.path}>
          {file.rendered}
        </div>
      ))}
    </div>
  );
}
