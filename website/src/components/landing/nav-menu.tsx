"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "#/lib/utils";
import { useHoverItem } from "./hover-group";
import { SPRING } from "./motion";

/**
 * A trimmed adaptation of the motion navigation menu in iconiq
 * (MIT, Edwin Vakayil — https://github.com/edwinvakayil/iconiq): one
 * shared highlight pill that slides between triggers, and a single dropdown
 * panel that morphs its size and position between items instead of unmounting
 * and remounting per menu.
 */

export type NavMenuItem = {
  label: string;
  /** Top-level link. Mutually exclusive with `content`. */
  href?: string;
  /** Dropdown panel. Mutually exclusive with `href`. */
  content?: React.ReactNode;
  external?: boolean;
};

const panelVariants = {
  initial: (direction: number) => ({ x: 24 * direction, opacity: 0 }),
  active: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: -24 * direction, opacity: 0 }),
};

export function NavMenu({
  items,
  className,
}: {
  items: NavMenuItem[];
  className?: string;
}) {
  const rootRef = React.useRef<HTMLElement>(null);
  const triggerRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const measureRef = React.useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState<number | null>(null);
  const [direction, setDirection] = React.useState(1);
  const [panelX, setPanelX] = React.useState(0);
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const openItem = open !== null ? items[open] : null;

  /**
   * Centers the panel on its trigger, then pulls it back inside the viewport
   * when centering would push an edge off-screen — without this the panel
   * overflows on the left, since the first trigger sits near the window edge.
   */
  const positionPanel = React.useCallback((index: number, width: number) => {
    const root = rootRef.current;
    const trigger = triggerRefs.current[index];
    if (!(root && trigger)) return;

    const rootRect = root.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const ideal = triggerRect.left - rootRect.left + triggerRect.width / 2;

    if (width <= 0) {
      setPanelX(ideal);
      return;
    }

    const margin = 16;
    const viewport = document.documentElement.clientWidth;
    const half = width / 2;
    const left = rootRect.left + ideal - half;
    const right = rootRect.left + ideal + half;

    let adjustment = 0;
    if (left < margin) {
      adjustment = margin - left;
    } else if (right > viewport - margin) {
      adjustment = viewport - margin - right;
    }

    setPanelX(ideal + adjustment);
  }, []);

  const openAt = React.useCallback((index: number) => {
    setOpen((current) => {
      if (current === index) return current;
      if (current !== null) setDirection(index > current ? 1 : -1);
      return index;
    });
  }, []);

  // The panel is sized from a hidden copy of the active content so width and
  // height can animate rather than snap.
  React.useLayoutEffect(() => {
    const node = measureRef.current;
    if (!(node && openItem?.content)) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 || rect.height > 0) {
        setSize({ width: rect.width, height: rect.height });
        // Positioned from the fresh measurement rather than from `size` state,
        // so the panel lands clamped on its very first frame.
        if (open !== null) positionPanel(open, rect.width);
      }
    };

    update();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [openItem, open, positionPanel]);

  React.useEffect(() => {
    if (open === null) return;
    const onResize = () => positionPanel(open, size.width);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, size.width, positionPanel]);

  return (
    <nav
      className={cn("relative flex items-center", className)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(null);
      }}
      onPointerLeave={() => {
        setHovered(null);
        setOpen(null);
      }}
      ref={rootRef}
    >
      <ul className="flex items-center gap-0.5">
        {items.map((item, index) => {
          const isOpen = open === index;

          return (
            <li
              className="relative"
              key={item.label}
              onPointerEnter={() => {
                setHovered(index);
                if (item.content) openAt(index);
                else setOpen(null);
              }}
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
            >
              {hovered === index ? (
                <motion.span
                  className="absolute inset-0 -z-10 rounded-lg bg-[var(--nav-hover)]"
                  layoutId="nav-highlight"
                  transition={SPRING}
                />
              ) : null}

              {item.href ? (
                <NavLink external={item.external} href={item.href}>
                  {item.label}
                </NavLink>
              ) : (
                <button
                  aria-expanded={isOpen}
                  className={navItemClass}
                  onClick={() => (isOpen ? setOpen(null) : openAt(index))}
                  onFocus={() => {
                    setHovered(index);
                    openAt(index);
                  }}
                  type="button"
                >
                  {item.label}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    aria-hidden
                    className="ml-1.5 inline-flex"
                    transition={SPRING}
                  >
                    <ChevronDown className="size-3.5" />
                  </motion.span>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <motion.div
        animate={{ left: panelX }}
        className="-translate-x-1/2 absolute top-full z-50 flex justify-center pt-2"
        initial={false}
        transition={SPRING}
      >
        <motion.div
          animate={{
            width: openItem?.content ? size.width : 0,
            height: openItem?.content ? size.height : 0,
            opacity: openItem?.content ? 1 : 0,
            scale: openItem?.content ? 1 : 0.96,
          }}
          className="relative overflow-hidden rounded-2xl border border-[var(--nav-panel-border)] bg-[var(--nav-panel)] shadow-[var(--nav-panel-shadow)]"
          initial={false}
          transition={SPRING}
        >
          <AnimatePresence custom={direction} initial={false} mode="popLayout">
            {openItem?.content ? (
              <motion.div
                animate="active"
                className="p-2"
                custom={direction}
                exit="exit"
                initial="initial"
                key={openItem.label}
                transition={SPRING}
                variants={panelVariants}
              >
                {openItem.content}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 w-max p-2"
          ref={measureRef}
        >
          {openItem?.content}
        </div>
      </motion.div>
    </nav>
  );
}

const navItemClass =
  "inline-flex h-9 w-max items-center justify-center rounded-lg px-3.5 text-[0.8rem] text-[color:var(--nav-fg-muted)] transition-colors duration-200 hover:text-[color:var(--nav-fg)] focus-visible:text-[color:var(--nav-fg)] focus-visible:outline-none";

function NavLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a
        className={navItemClass}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={navItemClass} href={href}>
      {children}
    </Link>
  );
}

/**
 * Row used inside dropdown panels: a name, and what it holds under it.
 *
 * Panels are built out of nothing but these, so the row carries the whole
 * rhythm — roomy enough that two columns of them read as a contents page
 * rather than a dense list, and the same height with or without `meta`.
 */
export function NavPanelLink({
  href,
  label,
  meta,
}: {
  href: string;
  label: string;
  meta?: string;
}) {
  const hover = useHoverItem();

  return (
    <Link
      /* Above the group's travelling highlight, the same as the bar's icon
         cluster: the highlight paints over its items, so a row left under it
         had its label greyed out by the fill on hover. */
      className="relative z-20 flex min-h-[3.25rem] flex-col justify-center gap-1 rounded-xl px-4 py-3"
      href={href}
      {...hover}
    >
      <span className="text-[0.85rem] text-[color:var(--nav-fg)] leading-none">
        {label}
      </span>
      {meta ? (
        <span className="text-[color:var(--nav-fg-faint)] text-[0.72rem] leading-none">
          {meta}
        </span>
      ) : null}
    </Link>
  );
}
