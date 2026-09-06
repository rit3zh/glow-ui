"use client";

import { ChevronLeft, FileCode2 } from "lucide-react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import type { PanInfo } from "motion/react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { CopyButton } from "@/components/buttons/copy";

/** Past either of these a flick reads as a dismissal rather than a nudge. */
const DISMISS_OFFSET = 100;
const DISMISS_VELOCITY = 500;

/**
 * The source sheet.
 *
 * It rises from the bottom of the window and, from `lg` up, settles over the
 * reading column — the preview it was opened from stays visible beside it, so
 * the code and the thing it produces can be read together.
 */
export function SourceDrawer({
  open,
  onClose,
  filename,
  copyCode,
  children,
}: {
  open: boolean;
  onClose: () => void;
  filename?: string;
  copyCode?: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          animate={{ y: 0 }}
          aria-label="Source code"
          className="pointer-events-none fixed bottom-0 left-0 z-50 flex h-[80vh] w-full flex-col p-2 lg:inset-y-0 lg:h-screen lg:w-1/2 lg:py-3 lg:pl-3 lg:pr-1.5"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragControls={dragControls}
          dragElastic={{ top: 0, bottom: 0.4 }}
          dragListener={false}
          exit={{ y: "100%" }}
          initial={{ y: "100%" }}
          onDragEnd={(_, info: PanInfo) => {
            if (
              info.offset.y > DISMISS_OFFSET ||
              info.velocity.y > DISMISS_VELOCITY
            ) {
              onClose();
            }
          }}
          role="dialog"
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="pointer-events-auto relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-code-surface shadow-2xl">
            {/* The header floats over the code rather than sitting above it,
                so the first line is not pushed out of view on short screens. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
              <div className="absolute inset-0 h-28 bg-linear-to-b from-code-surface to-transparent [mask-image:linear-gradient(to_bottom,black_20%,transparent)]" />

              <div className="pointer-events-auto relative flex flex-col">
                <div
                  className="flex touch-none cursor-grab items-center justify-center pb-1 pt-2 active:cursor-grabbing"
                  onPointerDown={(event) => dragControls.start(event)}
                >
                  <div className="h-1 w-10 rounded-full bg-foreground/10 transition-colors hover:bg-foreground/20" />
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-1">
                  <button
                    className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    onClick={onClose}
                    type="button"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="font-mono text-xs tracking-wide">
                      Source Code
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    {filename && (
                      <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <FileCode2 className="size-3.5" />
                        {filename}
                      </span>
                    )}
                    {copyCode && (
                      <CopyButton
                        className="size-7 bg-transparent text-muted-foreground shadow-none hover:bg-accent hover:text-foreground"
                        content={copyCode}
                        size="sm"
                        variant="ghost"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <div className="no-scrollbar h-full overflow-auto [&_pre]:min-h-full [&_pre]:pt-16!">
                {children}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-code-surface to-transparent [mask-image:linear-gradient(to_top,black_30%,transparent)]" />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
