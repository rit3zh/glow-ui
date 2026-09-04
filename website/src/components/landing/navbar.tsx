"use client";

import Link from "next/link";
import * as React from "react";

import { useScroll } from "@/hooks/use-scroll";
import { MetallicLogo } from "@/components/logo";
import { cn } from "#/lib/utils";
import {
  BROWSE_HREF,
  BUY_ME_A_COFFEE,
  DISCORD,
  DOCS_HREF,
  NAV_COMPONENTS,
  NAV_OTHER_CATALOGUES,
  REPO,
  TWITTER,
} from "./data";
import { EdgeBlur } from "./edge-blur";
import { HoverGroup, useHoverItem } from "./hover-group";
import { MobileNavTrigger } from "./mobile-nav";
import { NavMenu, NavPanelLink, type NavMenuItem } from "./nav-menu";

const STARS_CACHE_KEY = "reacticx:github-stars";
const STARS_TTL_MS = 30 * 60 * 1000;

function formatStars(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toLocaleString();
}

function useGithubStars() {
  const [stars, setStars] = React.useState<number | null>(null);

  React.useEffect(() => {
    try {
      const cached = window.sessionStorage.getItem(STARS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as { count: number; at: number };
        if (Date.now() - parsed.at < STARS_TTL_MS) {
          setStars(parsed.count);
          return;
        }
      }
    } catch {
      // Ignore unreadable cache payloads.
    }

    fetch("https://api.github.com/repos/rit3zh/reacticx")
      .then((res) => res.json() as Promise<{ stargazers_count?: number }>)
      .then((data) => {
        if (typeof data?.stargazers_count !== "number") return;
        setStars(data.stargazers_count);
        try {
          window.sessionStorage.setItem(
            STARS_CACHE_KEY,
            JSON.stringify({ count: data.stargazers_count, at: Date.now() }),
          );
        } catch {
          // Storage can be unavailable in private mode.
        }
      })
      .catch(() => undefined);
  }, []);

  return stars;
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        "inline-flex items-center gap-1.5 font-serif text-[1.15rem] text-[color:var(--nav-fg)] leading-none tracking-[-0.02em] transition-opacity duration-200 hover:opacity-70",
        className,
      )}
      href="/"
    >
      <MetallicLogo
        className="h-6 w-6 shrink-0"
        fallbackClassName="text-current"
      />
    </Link>
  );
}

/**
 * The catalogue a small menu lists, in full.
 *
 * Pieces, charts and primitives are ten, five and nine pages — small enough to
 * put the pages themselves in the menu rather than a link to a grid and a
 * count. That is also what tells them apart from Components at a glance: this
 * one is a contents page, that one is a set of doors.
 */
function CataloguePanel({
  catalogue,
}: {
  catalogue: (typeof NAV_OTHER_CATALOGUES)[number];
}) {
  return (
    <div className="flex w-[26rem] flex-col">
      <HoverGroup
        className="grid grid-cols-2 gap-x-2"
        highlightClassName="rounded-xl bg-[var(--nav-hover-soft)]"
      >
        {catalogue.pages.map((page) => (
          <NavPanelLink href={page.href} key={page.href} label={page.label} />
        ))}
      </HoverGroup>

      <HoverGroup
        className="mt-1 border-t border-[var(--nav-rule)] pt-1"
        highlightClassName="rounded-xl bg-[var(--nav-hover-soft)]"
      >
        <NavPanelLink
          href={catalogue.href}
          label={`Browse all ${catalogue.label.toLowerCase()}`}
          meta={`${catalogue.count} components`}
        />
      </HoverGroup>
    </div>
  );
}

const NAV_ITEMS: NavMenuItem[] = [
  {
    label: "Components",
    // The components catalogue, by docs section: Shaders, Texts, Micro
    // Interactions, Components. Pieces, charts and primitives are not sections
    // of this menu — they are their own catalogues, with their own menus beside
    // it. Listing all four here was what turned this into a menu of everything.
    //
    // Rows and nothing else. The panel carried a heading and a line of prose
    // about the catalogue, which the trigger you just hovered had already said.
    content: (
      <div className="flex w-[28rem] flex-col">
        <HoverGroup
          className="grid grid-cols-2 gap-x-2"
          highlightClassName="rounded-xl bg-[var(--nav-hover-soft)]"
        >
          {NAV_COMPONENTS.sections.map((section) => (
            <NavPanelLink
              href={section.href}
              key={section.label}
              label={section.label}
              meta={`${section.count} ${
                section.count === 1 ? "component" : "components"
              }`}
            />
          ))}
        </HoverGroup>

        <HoverGroup
          className="mt-1 border-t border-[var(--nav-rule)] pt-1"
          highlightClassName="rounded-xl bg-[var(--nav-hover-soft)]"
        >
          <NavPanelLink
            href={NAV_COMPONENTS.href}
            label="Browse all components"
            meta={`${NAV_COMPONENTS.count} components`}
          />
        </HoverGroup>
      </div>
    ),
  },
  ...NAV_OTHER_CATALOGUES.map((catalogue) => ({
    label: catalogue.label,
    content: <CataloguePanel catalogue={catalogue} />,
  })),
  { label: "Blocks", href: "/blocks" },
  { label: "Docs", href: DOCS_HREF },
];

/**
 * One target in the bar's icon cluster.
 *
 * The fill comes from the group's travelling highlight, so the item paints no
 * background of its own — it only lifts its own colour on hover, and sits
 * above the highlight so the mark never dims under it.
 */
function NavIconLink({
  children,
  className,
  href,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
  label: string;
}) {
  const hover = useHoverItem();

  return (
    <a
      aria-label={label}
      className={cn(
        "relative z-20 inline-flex size-8 items-center justify-center rounded-lg text-[color:var(--nav-fg-faint)] transition-colors duration-200 hover:text-[color:var(--nav-fg)]",
        className,
      )}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      {...hover}
    >
      {children}
    </a>
  );
}

/**
 * The site bar.
 *
 * `docs` is the same bar standing over a documentation page: it keeps its own
 * near-black surface rather than dissolving into the page, because every colour
 * in the menus below it is a dark one, and it carries whatever chrome that
 * section owns — theme switch, sidebar toggle — in `actions`. It also drops the
 * drawer trigger: the docs shell has its own mobile navigation, and the drawer
 * needs a provider that only the landing pages mount.
 */
export function Navbar({
  variant = "landing",
  actions,
}: {
  variant?: "landing" | "docs";
  actions?: React.ReactNode;
} = {}) {
  const scrolled = useScroll(8);
  const stars = useGithubStars();
  const docs = variant === "docs";

  return (
    <header
      className={cn(
        "site-nav fixed inset-x-0 top-0 z-[150]",
        docs &&
          "site-nav--docs border-[var(--nav-rule)] border-b bg-[var(--nav-bg)] backdrop-blur-xl",
      )}
    >
      {docs ? null : (
        <EdgeBlur
          className={cn(
            "transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0",
          )}
          position="top"
        />
      )}

      <div
        className={cn(
          "relative z-10 flex h-16 w-full items-center justify-between gap-4 px-5 md:px-8",
          !docs && "lg:h-14",
        )}
      >
        <div className="flex min-w-0 items-center gap-6">
          {/* Below `lg` the trigger takes the wordmark's slot, so the drawer's
              close affordance sits exactly where the hamburger was. The bar
              carries four catalogues now, which is more than fits beside the
              star count at `md`. */}
          {docs ? null : <MobileNavTrigger className="-ml-2.5 lg:hidden" />}
          <Wordmark className={cn(docs ? "inline-flex" : "hidden lg:inline-flex")} />
          <NavMenu className="hidden lg:flex" items={NAV_ITEMS} />
        </div>

        <div className="flex items-center gap-1">
          {/*
            One cluster, one highlight. Four separate `hover:bg` boxes sat in a
            row cross-fading against each other; here the pill travels between
            them on the same spring the menus use, and the icons rest dim so
            the white CTA beside them stays the only bright thing in the bar.
          */}
          <HoverGroup
            className="hidden items-center lg:flex"
            highlightClassName="rounded-lg bg-[var(--nav-hover-soft)]"
          >
            <NavIconLink href={DISCORD} label="Reacticx on Discord">
              {/* Optical sizing: the marks have very different widths at a
                  common box, so each is set to look the same weight rather
                  than measure the same. */}
              <DiscordMark className="size-[1.05rem]" />
            </NavIconLink>

            <NavIconLink href={TWITTER} label="Reacticx on X">
              <XMark className="size-[0.8rem]" />
            </NavIconLink>

            <NavIconLink href={BUY_ME_A_COFFEE} label="Buy me a coffee">
              <CoffeeMark className="size-[0.9rem]" />
            </NavIconLink>

            <NavIconLink
              className="w-auto gap-2 px-2.5"
              href={REPO}
              label="Reacticx on GitHub"
            >
              <GithubMark className="size-[0.9rem]" />
              <span className="text-[0.8rem] tabular-nums">
                {stars === null ? "—" : formatStars(stars)}
              </span>
            </NavIconLink>
          </HoverGroup>

          {/* The bar's one rule: chrome on the left of it, the action on the
              right. Without it the CTA read as a fifth item in the cluster. */}
          <span
            aria-hidden
            className="mx-1.5 hidden h-4 w-px bg-[var(--nav-rule)] lg:block"
          />

          <Link
            className="inline-flex h-8 items-center rounded-lg bg-[var(--nav-cta)] px-3 font-medium text-[0.8rem] text-[color:var(--nav-cta-fg)] leading-none tracking-[-0.01em] transition-[transform,opacity] duration-200 hover:opacity-85 active:scale-[0.97]"
            href={BROWSE_HREF}
          >
            Browse
          </Link>

          {actions}
        </div>
      </div>
    </header>
  );
}

export function XMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function DiscordMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function CoffeeMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m20.216 6.415-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 0 0-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 0 0-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 0 1-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 0 1 3.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 0 1-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 0 1-4.743.295 37.059 37.059 0 0 1-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0 0 11.343.376.483.483 0 0 1 .535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 0 1 .39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 0 1-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 0 1-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 0 0-1.322-.238c-.826 0-1.491.284-2.26.613z" />
    </svg>
  );
}
