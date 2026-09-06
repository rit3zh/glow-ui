"use client";

import { HideIfEmpty } from "fumadocs-core/hide-if-empty";
import type { PageTree } from "fumadocs-core/server";
import {
  Sidebar,
  type SidebarComponents,
  SidebarContent,
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarFooter,
  SidebarItem,
  SidebarSeparator,
  SidebarViewport,
} from "fumadocs-ui/components/layout/sidebar";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { BaseLinkItem, type LinkItemType } from "fumadocs-ui/layouts/links";
import { getLinks } from "fumadocs-ui/layouts/shared";
import { useSidebar, useTreeContext } from "fumadocs-ui/provider";
import { isActive } from "fumadocs-ui/utils/is-active";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ThemeSwitcher } from "@/components/animate/theme-switcher";
import { cn } from "@/components/workspace-ui/lib/utils";
import { Separator } from "#/lib/attach-separator";

// ─── Effects toggle context ───────────────────────────────────────────
const EFFECTS_STORAGE_KEY = "sidebar-effects";

const EffectsContext = createContext<{
  enabled: boolean;
  toggle: () => void;
}>({ enabled: true, toggle: () => {} });

function EffectsProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(EFFECTS_STORAGE_KEY);
    return stored !== null ? stored === "true" : true;
  });

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(EFFECTS_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ enabled, toggle }), [enabled, toggle]);
  return (
    <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>
  );
}

function useEffects() {
  return useContext(EffectsContext);
}

// ─── Scroll to active link ─────────────────────────────────────────────
function useScrollToActive(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!active || hasScrolled.current || !ref.current) return;
    hasScrolled.current = true;
    const el = ref.current;
    const schedule =
      typeof requestIdleCallback !== "undefined"
        ? (cb: () => void) => requestIdleCallback(cb)
        : (cb: () => void) => setTimeout(cb, 100);
    const cancel =
      typeof cancelIdleCallback !== "undefined"
        ? (id: number) => cancelIdleCallback(id)
        : (id: number) => clearTimeout(id);
    const id = schedule(() => {
      const viewport = el.closest("[data-radix-scroll-area-viewport]");
      if (!(viewport instanceof HTMLElement)) return;
      const vpRect = viewport.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset =
        elRect.top - vpRect.top - vpRect.height / 2 + elRect.height / 2;
      if (Math.abs(offset) > 40) {
        viewport.scrollBy({ top: offset, behavior: "smooth" });
      }
    });
    return () => cancel(id as number);
  }, [active]);

  useEffect(() => {
    if (!active) hasScrolled.current = false;
  }, [active]);

  return ref;
}

// ─── Shared hover context ──────────────────────────────────────────────
interface HoverRect {
  top: number;
  height: number;
}

const HoverContext = createContext<{
  hovered: string | null;
  hoveredCenter: number | null;
  hoverRect: HoverRect | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setHovered: (
    v: string | null,
    center?: number | null,
    rect?: HoverRect | null,
  ) => void;
}>({
  hovered: null,
  hoveredCenter: null,
  hoverRect: null,
  containerRef: { current: null },
  setHovered: () => {},
});

function HoverProvider({
  children,
  containerRef,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [hovered, setHoveredState] = useState<string | null>(null);
  const [hoveredCenter, setHoveredCenter] = useState<number | null>(null);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);

  const stableSet = useCallback(
    (v: string | null, center?: number | null, rect?: HoverRect | null) => {
      setHoveredState(v);
      setHoveredCenter(center ?? null);
      setHoverRect(rect ?? null);
    },
    [],
  );

  const value = useMemo(
    () => ({
      hovered,
      hoveredCenter,
      hoverRect,
      containerRef,
      setHovered: stableSet,
    }),
    [hovered, hoveredCenter, hoverRect, containerRef, stableSet],
  );

  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

function useHover() {
  return useContext(HoverContext);
}

// ─── Floating hover highlight (single element) ─────────────────────────
function SidebarHoverHighlight() {
  const { hoverRect, hovered } = useHover();
  const { enabled } = useEffects();

  return (
    <AnimatePresence>
      {enabled && hovered && hoverRect && (
        <motion.div
          key="sidebar-hover-bg"
          className="pointer-events-none absolute z-0 rounded-md bg-accent/50"
          style={{ left: 25, right: 0 }}
          initial={false}
          animate={{
            top: hoverRect.top + 2,
            height: hoverRect.height - 4,
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 2000,
            damping: 50,
            mass: 0.5,
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Constants ─────────────────────────────────────────────────────────
const sidebarItemClassName =
  "relative hover:bg-transparent bg-transparent! ml-2 pl-4! py-1.5! data-[active=true]:bg-transparent";

const getIsActive = (pathname: string, href: string) =>
  href !== undefined && isActive(href, pathname, false);

const isRootFolder = (
  root: PageTree.Root | PageTree.Folder,
): root is PageTree.Folder => "type" in root && root.type === "folder";

// ─── Animated sidebar link ─────────────────────────────────────────────
const AnimatedSidebarLink = memo(function AnimatedSidebarLink({
  href,
  label,
  isActive: active,
  isNew,
  external,
  className,
  ...rest
}: {
  href: string;
  label: React.ReactNode;
  isActive: boolean;
  isNew?: boolean;
  external?: boolean;
  className?: string;
}) {
  const { hovered, setHovered, containerRef } = useHover();
  const isHovered = hovered === href;
  const itemRef = useScrollToActive(active);

  const opacity = active || isHovered ? 1 : 0.55;
  const x = active ? 8 : isHovered ? 6 : 0;

  return (
    <div className="relative">
      {/* Active indicator bar */}
      {active && (
        <motion.span
          layoutId="sidebar-active-bar"
          className="pointer-events-none absolute left-[4px] top-1/2 z-11 h-[1.8px] -translate-y-1/2 rounded-full bg-accent-pro"
          animate={{ width: 30 }}
          transition={{ type: "spring", stiffness: 800, damping: 40 }}
        />
      )}

      {/* Tick marks — outside the translating wrapper so they stay put. */}
      <motion.span
        className="pointer-events-none absolute left-0 top-1/2 h-px -translate-y-1/2 bg-foreground/50"
        animate={{ width: active ? 0 : isHovered ? 26 : 18 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
      <motion.span className="pointer-events-none absolute left-0 top-1/4 h-px w-[13px] bg-foreground/30" />
      <motion.span className="pointer-events-none absolute left-0 top-0 h-px w-[16px] bg-foreground/30" />
      <motion.span className="pointer-events-none absolute left-0 top-3/4 h-px w-[13px] bg-foreground/30" />

      <motion.div
        ref={itemRef}
        animate={{ opacity, x }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        style={{ transformOrigin: "left center" }}
      >
        <SidebarItem
          href={href}
          external={external}
          className={cn(sidebarItemClassName, className)}
          onMouseEnter={() => {
            const el = itemRef.current;
            const container = containerRef.current;
            if (el && container) {
              const elRect = el.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              setHovered(href, elRect.top + elRect.height / 2, {
                top: elRect.top - containerRect.top,
                height: elRect.height,
              });
            } else {
              setHovered(href);
            }
          }}
          onMouseLeave={() => setHovered(null)}
          {...rest}
        >
          <span
            className={cn(
              "relative z-1 inline-flex w-full items-center gap-2 pl-2.5 text-md transition-all duration-200 ease-out",
              // The accent marks "you are here"; hover previews it.
              active || isHovered ? "text-accent-pro" : "text-foreground",
            )}
          >
            {label}
            {isNew && (
              <span className="size-1.5 shrink-0 rounded-full bg-accent-pro" />
            )}
          </span>
        </SidebarItem>
      </motion.div>
    </div>
  );
});

// ─── Page tree items ───────────────────────────────────────────────────
export function SidebarPageTree(props: {
  components?: Partial<SidebarComponents>;
}) {
  const { root } = useTreeContext();
  const pathname = usePathname();

  return useMemo(() => {
    const { Separator: SeparatorSlot, Item } = props.components ?? {};

    function renderSidebarList(items: PageTree.Node[]): React.ReactNode[] {
      return items.map((item, i) => {
        if (item.type === "separator") {
          if (SeparatorSlot) return <SeparatorSlot key={i} item={item} />;
          return (
            <SidebarSeparator key={i} className="mb-3.5 mt-6 p-0!">
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        // A nested folder flattens: its index becomes a link and its children
        // follow at the same depth. The sidebar is a flat list of links by
        // design, so there is no disclosure to collapse into.
        if (item.type === "folder") {
          const url = item.index?.url;
          return (
            <Fragment key={url ?? i}>
              {url && (
                <AnimatedSidebarLink
                  href={url}
                  label={item.name}
                  isActive={getIsActive(pathname, url)}
                />
              )}
              {renderSidebarList(item.children)}
            </Fragment>
          );
        }

        if (Item) return <Item key={item.url} item={item} />;

        return (
          <AnimatedSidebarLink
            key={item.url}
            href={item.url}
            label={item.name}
            isActive={getIsActive(pathname, item.url)}
          />
        );
      });
    }

    return (
      <Fragment key={root.$id}>{renderSidebarList(root.children)}</Fragment>
    );
  }, [props.components, root, pathname]);
}

// ─── Link items (top-level links, menu items) ─────────────────────────
export function SidebarLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  const pathname = usePathname();

  if (item.type === "menu")
    return (
      <SidebarFolder {...props}>
        {item.url ? (
          <SidebarFolderLink href={item.url}>{item.text}</SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger>{item.text}</SidebarFolderTrigger>
        )}
        <SidebarFolderContent>
          {item.items.map((child, i) => (
            <SidebarLinkItem key={i} item={child} />
          ))}
        </SidebarFolderContent>
      </SidebarFolder>
    );

  if (item.type === "custom") {
    return <div {...props}>{item.children as React.ReactNode}</div>;
  }

  if ((item.type as string) === "separator") {
    const separator = item as unknown as {
      icon?: React.ReactNode;
      name: string;
    };
    return (
      <SidebarSeparator
        className="mb-2 ml-0! p-0!"
        style={{ paddingInlineStart: 0 }}
      >
        <Separator icon={separator.icon} name={separator.name} />
      </SidebarSeparator>
    );
  }

  return (
    <AnimatedSidebarLink
      href={item.url}
      label={item.text}
      isActive={getIsActive(pathname, item.url)}
      isNew={(item as { new?: boolean }).new === true}
      external={item.external}
      className={props.className}
    />
  );
}

// ─── Mobile drawer ──────────────────────────────────────────────────────
//
// Fumadocs' own `SidebarContentMobile` drives its slide with a CSS
// `@keyframes` animation on a `backdrop-filter: blur()` sibling — a
// combination WebKit is known to ghost/ double-paint mid-transition on iOS.
// Driving the same open/close through Motion (already used everywhere else
// in this nav) sidesteps that and gives us a spring feel to match.
const MOBILE_DRAWER_TRANSITION = { type: "spring", stiffness: 420, damping: 42, mass: 1 } as const;

function MobileSidebarDrawer({
  body,
  className,
}: {
  body: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          <motion.div
            key="mobile-sidebar-backdrop"
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
          <motion.aside
            key="mobile-sidebar-drawer"
            id="nd-sidebar-mobile"
            className={cn(
              "fixed inset-y-0 start-0 z-40 mt-16 flex w-[85%] max-w-[380px] flex-col border-e bg-background text-[15px] shadow-lg",
              className,
            )}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={MOBILE_DRAWER_TRANSITION}
          >
            {body}
          </motion.aside>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

// ─── Main sidebar ──────────────────────────────────────────────────────
export const DocsSidebar = ({
  sidebar: {
    footer: sidebarFooter,
    components: sidebarComponents,
    defaultOpenLevel,
    prefetch,
    ...asideProps
  } = {},
  ...props
}: DocsLayoutProps) => {
  const links = getLinks(props.links ?? [], props.githubUrl);
  const { root } = useTreeContext();
  const shouldRenderLayoutLinks = isRootFolder(root) && root.root === true;
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  // The tree and the links, shared by the docked and the mobile shells below.
  const body = (
    <>
      <div ref={sidebarScrollRef} className="min-h-0 flex-1">
        <SidebarViewport className="max-md:pt-2 [&_[data-radix-scroll-area-viewport]]:pb-4 md:[&_[data-radix-scroll-area-viewport]]:pb-14">
          <div ref={containerRef} className="relative">
            <SidebarHoverHighlight />
            {(shouldRenderLayoutLinks ? links : [])
              .filter((v) => v.type !== "icon")
              .map((item, i, list) => (
                <SidebarLinkItem
                  key={i}
                  item={item}
                  className={cn(
                    item.type !== "custom" && sidebarItemClassName,
                    i === list.length - 1 && "mb-4",
                  )}
                />
              ))}

            <SidebarPageTree components={sidebarComponents} />
          </div>
        </SidebarViewport>
      </div>

      <HideIfEmpty
        as={SidebarFooter}
        className="border-0 data-[empty=true]:hidden md:hidden"
      >
        <div className="flex items-center justify-end empty:hidden">
          {links
            .filter((item) => item.type === "icon")
            .map((item, i, arr) => (
              <BaseLinkItem
                key={i}
                item={item}
                className={cn(
                  buttonVariants({ size: "icon", color: "ghost" }),
                  "text-fd-muted-foreground md:[&_svg]:size-4.5",
                  i === arr.length - 1 && "me-auto",
                )}
                aria-label={item.label}
              >
                {item.icon}
              </BaseLinkItem>
            ))}

          <ThemeSwitcher />
        </div>
        {sidebarFooter}
      </HideIfEmpty>
    </>
  );

  // `SidebarContent` is `fixed`, which is what keeps the rail still while the
  // article scrolls. Switching it to `absolute` at 3xl — to line it up with the
  // centred `--breakpoint-3xl`-wide layout — costs exactly that, and the rail
  // scrolls away with the page. Offsetting the fixed element by the same
  // gutter lines it up without giving up the pinning.
  const asideClassName = cn(
    "bg-background md:mt-20 3xl:start-[calc((100vw-var(--breakpoint-3xl))/2)]!",
    asideProps.className,
  );

  return (
    <EffectsProvider>
      <HoverProvider containerRef={containerRef}>
        {/* `Sidebar` takes the shell as the `Content` and `Mobile` props rather
            than as children — passing children instead renders an empty rail,
            because the component simply never reads them. `SidebarContent` is
            what emits the `<aside>`, so the layout classes belong on it. */}
        <Sidebar
          defaultOpenLevel={defaultOpenLevel}
          prefetch={prefetch}
          Content={
            <SidebarContent {...asideProps} className={asideClassName}>
              {body}
            </SidebarContent>
          }
          Mobile={<MobileSidebarDrawer body={body} />}
        />
      </HoverProvider>
    </EffectsProvider>
  );
};
