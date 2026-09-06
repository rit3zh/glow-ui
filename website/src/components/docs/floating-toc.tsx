"use client";

import type { TOCItemType } from "fumadocs-core/server";
import { AnchorProvider, TOCItem, useActiveAnchor } from "fumadocs-core/toc";
import { AlignLeft, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { isValidElement, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Highlight, HighlightItem } from "@/components/animate/highlight";
import { SwapText } from "@/components/landing/swap-text";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * A heading's `title` is a ReactNode, and the label transition works on glyphs,
 * so it has to be flattened to text. Headings are plain strings in practice;
 * the walk is for the `<code>` and `<em>` a title can legally contain.
 */
function toPlainText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return toPlainText(node.props.children);
  }
  return "";
}

/**
 * The page's table of contents, as a control docked to the bottom-right.
 *
 * The framework's own rail is disabled in favour of this (see `page.tsx`), so
 * the article keeps the width the rail used to reserve. Collapsed it is a pill
 * naming the heading you are currently inside; expanded it grows upward into
 * the list, which is what keeps the trigger under the pointer rather than
 * sliding away from it when the panel opens.
 */
export function FloatingToc({ toc }: { toc: TOCItemType[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Escape and outside-clicks both close: the panel floats over the article, so
  // it has to get out of the way as readily as a popover would.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  if (toc.length === 0) return null;

  return (
    <AnchorProvider toc={toc}>
      <div
        className="fixed bottom-5 z-40 flex flex-col items-end gap-2 end-5 max-md:bottom-4 max-md:end-4"
        ref={containerRef}
      >
        <AnimatePresence initial={false}>
          {open && (
            <TocPanel key="panel" onNavigate={() => setOpen(false)} toc={toc} />
          )}
        </AnimatePresence>

        <TocTrigger onClick={() => setOpen((v) => !v)} open={open} toc={toc} />
      </div>
    </AnchorProvider>
  );
}

/** The pill. Names the active heading so the control says where you are. */
function TocTrigger({
  onClick,
  open,
  toc,
}: {
  onClick: () => void;
  open: boolean;
  toc: TOCItemType[];
}) {
  const active = useActiveAnchor();
  const current = toc.find((item) => item.url.slice(1) === active);
  const label = current ? toPlainText(current.title) : "On this page";

  return (
    <motion.button
      aria-expanded={open}
      aria-label="Table of contents"
      className={cn(
        "flex h-10 max-w-[min(20rem,calc(100vw-2.5rem))] cursor-pointer items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 text-[13px] font-medium text-foreground shadow-[0_8px_28px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors hover:bg-accent",
        open && "bg-accent",
      )}
      onClick={onClick}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <AlignLeft className="size-4 shrink-0 text-muted-foreground" />

      {/* The heading you left rises out of the pill as the one you scrolled
          into rises in, and the pill's width tweens to the new title on the
          same curve rather than snapping to it.

          This is deliberately not a layout animation. `layout` measures the
          element and projects a transform onto it, which the `whileHover`
          scale below then fights — the two write to the same matrix and the
          width lands in visible steps. `SwapText` tweens a real `width` from a
          hidden measuring copy instead, so nothing here touches transforms. */}
      <span className="flex min-w-0 overflow-hidden">
        <SwapText value={label} />
      </span>
      <motion.span
        animate={{ rotate: open ? 0 : 180 }}
        className="inline-flex shrink-0"
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        <ChevronDown className="size-4 text-muted-foreground" />
      </motion.span>
    </motion.button>
  );
}

function TocPanel({
  onNavigate,
  toc,
}: {
  onNavigate: () => void;
  toc: TOCItemType[];
}) {
  // `depth` is the heading level, so the shallowest heading on the page is the
  // one to measure against — a page whose headings start at h3 should not be
  // indented as though it started at h1.
  const minDepth = Math.min(...toc.map((item) => item.depth));

  // False for the whole exit animation. Clicking a heading closes the panel
  // with the pointer still resting on a row, which leaves the highlight's
  // measuring loop re-reading a row that is collapsing under it — a React
  // render per frame, landing on the one close people actually use.
  const isPresent = useIsPresent();

  return (
    /* The panel collapses rather than fades. Opening and closing have to be the
       same gesture reversed, and a fade-out is not the reverse of an expand —
       it reads as the panel blinking out however long it is given.
       
       Height is the one property that can express it, which does mean laying out
       each frame rather than riding the compositor. That is affordable here
       because the content is a short list, but it is the reason the background
       is opaque: `backdrop-filter` would re-blur what is behind the panel on
       every one of those frames, and that is what turns a collapse choppy. */
    <motion.div
      animate={{ height: "auto", opacity: 1 }}
      className="w-[min(19rem,calc(100vw-2.5rem))] origin-bottom overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_16px_48px_-20px_rgba(0,0,0,0.6)]"
      exit={{ height: 0, opacity: 0 }}
      initial={{ height: 0, opacity: 0 }}
      style={{ willChange: "height, opacity" }}
      transition={{
        height: { type: "spring", stiffness: 460, damping: 42, mass: 0.9 },
        // Fades in over the first half of the expand and out over the whole
        // collapse, so the panel is never a visible empty box mid-travel.
        opacity: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      <p className="border-b border-border/50 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.02em] text-muted-foreground">
        On this page
      </p>

      {/* Caps at roughly half the viewport so a long page scrolls inside the
          panel instead of the panel growing past the top of the screen. */}
      <div className="max-h-[min(24rem,50vh)] overflow-y-auto overscroll-contain p-1.5 no-scrollbar">
        {/* One rectangle slides between the rows rather than each row lighting
            its own background — the same mechanic as the "Open" menu, and what
            makes the list read as a single surface being pointed at.

            Which is also why the reading position is no longer a background:
            two filled rectangles, one following the pointer and one marking the
            heading you are in, are indistinguishable at a glance. The active
            row carries weight and full-contrast text instead. */}
        <Highlight
          className="rounded-lg bg-accent"
          containerClassName="flex flex-col gap-0.5"
          controlledItems
          // The list scrolls under the pointer, so the highlight has to keep
          // re-measuring the row it is on — without this it stays parked where
          // the row was when the pointer first entered it. It stops the moment
          // the panel starts closing, when there is nothing left to track.
          forceUpdateBounds={isPresent}
          hover={isPresent}
          mode="parent"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 40,
            mass: 0.6,
          }}
          value={null}
        >
          {toc.map((item) => (
            <HighlightItem asChild key={item.url} value={item.url}>
              <TOCItem
                className={cn(
                  "relative z-10 block rounded-lg py-1.5 pe-3 text-[13px] leading-snug no-underline! transition-colors",
                  "text-muted-foreground data-[active=true]:font-medium data-[active=true]:text-foreground",
                )}
                href={item.url}
                onClick={onNavigate}
                style={{
                  paddingInlineStart: `${0.75 + (item.depth - minDepth) * 0.75}rem`,
                }}
              >
                {item.title}
              </TOCItem>
            </HighlightItem>
          ))}
        </Highlight>
      </div>
    </motion.div>
  );
}
