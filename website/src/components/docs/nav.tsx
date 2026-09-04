"use client";

import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useSidebar } from "fumadocs-ui/provider";
import { motion } from "motion/react";

import { ThemeSwitcher } from "@/components/animate/theme-switcher";
import { Navbar } from "@/components/landing/navbar";
import { cn } from "@/components/workspace-ui/lib/utils";

const MENU_BAR_TRANSITION = { duration: 0.25, ease: [0.65, 0, 0.35, 1] } as const;

/** Hamburger that morphs into an X — the outer bars rotate into the cross
 * while the middle bar fades, rather than a hard icon swap. */
function MenuToggleIcon({ open }: { open: boolean }) {
  const barClassName = "absolute left-0 h-[1.5px] w-full rounded-full bg-current";

  return (
    <span className="relative block size-4">
      <motion.span
        className={barClassName}
        animate={{ top: open ? "7px" : "3px", rotate: open ? 45 : 0 }}
        transition={MENU_BAR_TRANSITION}
      />
      <motion.span
        className={barClassName}
        style={{ top: "7px" }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.12 }}
      />
      <motion.span
        className={barClassName}
        animate={{ top: open ? "7px" : "11px", rotate: open ? -45 : 0 }}
        transition={MENU_BAR_TRANSITION}
      />
    </span>
  );
}

/**
 * The docs top bar is the site bar.
 *
 * It used to be a second, smaller navigation of its own, which meant leaving
 * the landing page dropped you into a different set of doors than the one you
 * had just been using. `Navbar`'s `docs` variant is the same bar on an opaque
 * surface, and the two controls this section owns — the theme switch and the
 * sidebar toggle — ride along in its actions slot.
 */
export const Nav = () => {
  const { open, setOpen } = useSidebar();

  return (
    <Navbar
      variant="docs"
      actions={
        <>
          <ThemeSwitcher className="ml-1 max-md:hidden" />

          {/* Mobile page-tree toggle. The site drawer is a landing-page thing;
              here the sidebar is what the small screen opens. */}
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            className={cn(
              buttonVariants({
                color: "ghost",
                size: "icon-sm",
                className:
                  "ml-1 size-8! text-[color:var(--nav-fg-muted)] hover:bg-[var(--nav-hover)] hover:text-[color:var(--nav-fg)] md:hidden",
              }),
            )}
            onClick={() => setOpen((prev) => !prev)}
          >
            <MenuToggleIcon open={open} />
          </button>
        </>
      }
    />
  );
};
