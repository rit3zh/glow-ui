"use client";

import {
  animate,
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { cn } from "#/lib/utils";
import {
  BUY_ME_A_COFFEE,
  DISCORD,
  DOCS_HREF,
  NAV_COMPONENTS,
  NAV_OTHER_CATALOGUES,
  REPO,
  TWITTER,
} from "./data";
import { SPRING_SOFT } from "./motion";

/**
 * The mobile navigation is a push drawer: the whole page becomes a rounded card
 * that slides right and shrinks while the menu is revealed underneath it.
 *
 * Every surface — card, scrim, panel — is driven by one shared `progress` value
 * rather than by its own animation, so the card edge and the panel edge can
 * never drift apart by even a frame. That single source is what makes the whole
 * gesture read as one piece of material moving instead of three synced ones.
 */

/** Drawer width: a fraction of the viewport, with a hard ceiling on big phones. */
const PANEL_VW = 0.72;
const PANEL_MAX = 300;

/** Resting geometry of the page card once the drawer is fully open. */
const SHELL_SCALE = 0.92;
const SHELL_RADIUS = 26;
const SCRIM_OPACITY = 0.3;

/**
 * `closing` exists because the card is only viewport-pinned while the drawer is
 * out. Unpinning it on the first frame of the close would put a scaled element
 * back into document flow, and it would fold in on the document's centre
 * instead of the viewport's. So the pin is held until the spring settles.
 */
type Phase = "closed" | "open" | "closing";

type MobileNavContextValue = {
  open: boolean;
  /** True from the first frame of opening until the close animation settles. */
  active: boolean;
  progress: MotionValue<number>;
  /** Panel width and the card's pre-pin offset, both measured at open time. */
  width: number;
  offset: number;
  shellRef: React.RefObject<HTMLDivElement | null>;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const MobileNavContext = React.createContext<MobileNavContextValue | null>(null);

/**
 * How far the card's content will jump when the card is pinned to the viewport,
 * so the jump can be cancelled out.
 *
 * A card that spans the whole document is sitting in normal flow, and pinning
 * it lifts its content by the current scroll offset. A card no taller than the
 * viewport holds content that is already pinned by something else — GSAP's
 * ScrollSmoother does exactly this — and nothing moves, so nothing is owed.
 */
function measureOffset(shell: HTMLElement | null) {
  if (!shell || shell.offsetHeight <= window.innerHeight) return 0;
  // Clamped: the card is the first in-flow element on the page, so a positive
  // top would only ever mean it was measured in a state it should not be in.
  return Math.min(0, shell.getBoundingClientRect().top);
}

function useMobileNav() {
  const value = React.useContext(MobileNavContext);
  if (!value) {
    throw new Error("useMobileNav must be used inside <MobileNavProvider>");
  }
  return value;
}

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const shellRef = React.useRef<HTMLDivElement>(null);
  const phaseRef = React.useRef<Phase>("closed");
  const scrollRef = React.useRef(0);

  const [phase, setPhase] = React.useState<Phase>("closed");
  const [geometry, setGeometry] = React.useState({
    width: PANEL_MAX,
    offset: 0,
  });

  const active = phase !== "closed";

  const setOpen = React.useCallback((next: boolean) => {
    if (next === (phaseRef.current === "open")) return;

    if (next) {
      // Only a card that is still in normal flow can be measured. Reopening
      // mid-close finds it already pinned and transformed, where the same reads
      // return the pinned geometry and would compensate for a shift that has
      // already been applied — so the numbers from the first open are kept.
      if (phaseRef.current === "closed") {
        scrollRef.current = window.scrollY;
        setGeometry({
          width: Math.min(window.innerWidth * PANEL_VW, PANEL_MAX),
          offset: measureOffset(shellRef.current),
        });
      }
      phaseRef.current = "open";
      setPhase("open");
      return;
    }

    phaseRef.current = "closing";
    setPhase("closing");
  }, []);

  const toggle = React.useCallback(
    () => setOpen(phaseRef.current !== "open"),
    [setOpen],
  );

  React.useEffect(() => {
    if (phase === "closed") return;

    const controls = animate(
      progress,
      phase === "open" ? 1 : 0,
      reduceMotion ? { duration: 0.2 } : SPRING_SOFT,
    );

    if (phase === "closing") {
      controls.then(() => {
        // Reopening mid-close stops these controls, but a stopped animation can
        // still settle its promise — ignore it unless we are still closing.
        if (phaseRef.current !== "closing") return;
        phaseRef.current = "closed";
        setPhase("closed");
      });
    }

    return () => controls.stop();
  }, [phase, progress, reduceMotion]);

  // GSAP's ScrollSmoother pins an explicit height on <body>, so pinning the card
  // does not collapse the document and the scroll offset survives on its own.
  // The restore below is the safety net for the plain, smoother-less case.
  React.useLayoutEffect(() => {
    if (!active) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
      if (window.scrollY !== scrollRef.current) {
        window.scrollTo(0, scrollRef.current);
      }
    };
  }, [active]);

  React.useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    // Crossing into the desktop layout hides the trigger, so the drawer has to
    // let go of the page rather than stay pinned with no way to dismiss it.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [active, setOpen]);

  const value = React.useMemo<MobileNavContextValue>(
    () => ({
      open: phase === "open",
      active,
      progress,
      width: geometry.width,
      offset: geometry.offset,
      shellRef,
      setOpen,
      toggle,
    }),
    [phase, active, progress, geometry, setOpen, toggle],
  );

  return (
    <MobileNavContext.Provider value={value}>
      {children}
    </MobileNavContext.Provider>
  );
}

/**
 * Wraps everything that should slide away — i.e. the scrolling page, but not the
 * fixed header, which stays put so the trigger and the CTA never move.
 */
export function MobileNavShell({ children }: { children: React.ReactNode }) {
  const { active, progress, width, offset, shellRef, setOpen } = useMobileNav();
  const scrim = useTransform(progress, [0, 1], [0, SCRIM_OPACITY]);

  // Written straight to the node instead of through a motion component: this
  // element wraps the entire scroll surface, and any inline transform left on it
  // while closed would turn it into the containing block for the page's own
  // fixed layers (ScrollSmoother's wrapper among them). Manual writes let the
  // property be removed outright rather than parked at an identity value.
  React.useEffect(() => {
    const node = shellRef.current;
    if (!node) return;

    if (!active) {
      node.style.transform = "";
      node.style.borderRadius = "";
      return;
    }

    const write = (value: number) => {
      const scale = 1 - (1 - SHELL_SCALE) * value;
      node.style.transform = `translate3d(${width * value}px, 0, 0) scale(${scale})`;
      node.style.borderRadius = `${SHELL_RADIUS * value}px`;
    };

    write(progress.get());
    return progress.on("change", write);
  }, [active, width, progress, shellRef]);

  return (
    <div
      className={cn(
        active &&
          "fixed inset-0 z-[100] origin-left overflow-hidden shadow-[-16px_0_48px_rgba(0,0,0,0.55)] will-change-transform",
      )}
      ref={shellRef}
    >
      {/* Holds the page at the scroll position it had when it was pinned. Only
          applied when it is actually needed, so no transform is created at rest. */}
      <div
        style={
          active && offset
            ? { transform: `translate3d(0, ${offset}px, 0)` }
            : undefined
        }
      >
        {children}
      </div>

      {active ? (
        <motion.button
          aria-label="Close menu"
          className="absolute inset-0 z-[1] cursor-default bg-black"
          onClick={() => setOpen(false)}
          style={{ opacity: scrim }}
          type="button"
        />
      ) : null}
    </div>
  );
}

type DrawerLink = {
  label: string;
  href: string;
  external?: boolean;
};

const PRIMARY_LINKS: DrawerLink[] = [
  { label: "Home", href: "/" },
  { label: NAV_COMPONENTS.label, href: NAV_COMPONENTS.href },
  { label: "Blocks", href: "/blocks" },
  { label: "Docs", href: DOCS_HREF },
];

/**
 * Pieces, charts and primitives — the catalogues that are not components.
 *
 * They sit in their own tier rather than in the list above, for the same reason
 * they have their own menus on the desktop bar: a piece is a finished object
 * and a chart is a data surface, and running all four together as one column
 * said they were four flavours of the same thing.
 */
const CATALOGUE_LINKS: DrawerLink[] = NAV_OTHER_CATALOGUES.map((catalogue) => ({
  label: catalogue.label,
  href: catalogue.href,
}));

const SECONDARY_LINKS: DrawerLink[] = [
  { label: "GitHub", href: REPO, external: true },
  { label: "X", href: TWITTER, external: true },
  { label: "Discord", href: DISCORD, external: true },
  { label: "Buy me a coffee", href: BUY_ME_A_COFFEE, external: true },
];

const listVariants = {
  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  open: { transition: { delayChildren: 0.06, staggerChildren: 0.04 } },
};

/**
 * Rows arrive on the same rise-and-unblur curve the headline copy uses, so the
 * menu reads as part of the page's motion vocabulary rather than a stock sheet.
 */
const itemVariants = {
  closed: {
    opacity: 0,
    x: -16,
    filter: "blur(6px)",
    transition: { duration: 0.16 },
  },
  open: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
  },
};

const flatVariants = {
  closed: { opacity: 0, x: -16, transition: { duration: 0.16 } },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
  },
};

export function MobileNavDrawer() {
  const { active, open, progress, width, setOpen } = useMobileNav();
  const reduceMotion = useReducedMotion();
  const x = useTransform(progress, [0, 1], [-width, 0]);

  if (!active) return null;

  const rowVariants = reduceMotion ? flatVariants : itemVariants;

  return (
    <motion.aside
      aria-label="Site menu"
      className="fixed inset-y-0 left-0 z-[90] flex flex-col overflow-y-auto overscroll-contain bg-[#060606] pt-24 pr-5 pb-10 pl-6 lg:hidden"
      style={{ x, width }}
    >
      <motion.nav
        animate={open ? "open" : "closed"}
        className="flex flex-col"
        initial="closed"
        variants={listVariants}
      >
        <ul className="flex flex-col gap-7">
          {PRIMARY_LINKS.map((link) => (
            <motion.li key={link.label} variants={rowVariants}>
              <DrawerRow
                className="font-semibold text-[1.3rem] text-ink tracking-[-0.02em]"
                link={link}
                onNavigate={() => setOpen(false)}
              />
            </motion.li>
          ))}
        </ul>

        <motion.div
          aria-hidden
          className="my-8 h-px w-full bg-white/10"
          variants={flatVariants}
        />

        <motion.p
          className="mb-4 text-[0.65rem] uppercase tracking-[0.08em] text-ink-faint"
          variants={flatVariants}
        >
          Catalogues
        </motion.p>

        <ul className="flex flex-col gap-5">
          {CATALOGUE_LINKS.map((link) => (
            <motion.li key={link.label} variants={rowVariants}>
              <DrawerRow
                className="font-medium text-[1.05rem] text-ink tracking-[-0.015em]"
                link={link}
                onNavigate={() => setOpen(false)}
              />
            </motion.li>
          ))}
        </ul>

        <motion.div
          aria-hidden
          className="my-8 h-px w-full bg-white/10"
          variants={flatVariants}
        />

        <ul className="flex flex-col gap-5">
          {SECONDARY_LINKS.map((link) => (
            <motion.li key={link.label} variants={rowVariants}>
              <DrawerRow
                className="font-medium text-[0.95rem] text-ink-muted"
                link={link}
                onNavigate={() => setOpen(false)}
              />
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    </motion.aside>
  );
}

function DrawerRow({
  link,
  className,
  onNavigate,
}: {
  link: DrawerLink;
  className?: string;
  onNavigate: () => void;
}) {
  const classes = cn(
    "inline-flex w-max items-center transition-opacity duration-200 active:opacity-60",
    className,
  );

  if (link.external) {
    return (
      <a
        className={classes}
        href={link.href}
        onClick={onNavigate}
        rel="noopener noreferrer"
        target="_blank"
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link className={classes} href={link.href} onClick={onNavigate}>
      {link.label}
    </Link>
  );
}

const barClass =
  "absolute left-0 block h-[1.5px] w-4 origin-center rounded-full bg-ink";

/** Three rules that fold into a cross on the same spring as the drawer itself. */
export function MobileNavTrigger({ className }: { className?: string }) {
  const { open, toggle } = useMobileNav();

  return (
    <button
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className={cn(
        "relative flex size-10 items-center justify-center",
        className,
      )}
      onClick={toggle}
      type="button"
    >
      <span className="relative block h-3 w-4">
        <motion.span
          animate={open ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
          className={barClass}
          style={{ top: 0 }}
          transition={SPRING_SOFT}
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }}
          className={barClass}
          style={{ top: 5 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          animate={open ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
          className={barClass}
          style={{ top: 10 }}
          transition={SPRING_SOFT}
        />
      </span>
    </button>
  );
}
