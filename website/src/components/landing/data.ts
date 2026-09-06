import { components } from "@/lib/components.generated";
import { catalogues, componentCatalogue } from "@/lib/catalogues";

export const REPO = "https://github.com/rit3zh/reacticx";
export const DISCORD = "https://discord.gg/bvEpjhKgar";
export const TWITTER = "https://x.com/rit3zh";
export const BUY_ME_A_COFFEE = "https://buymeacoffee.com/rit3zh";

/**
 * What the hero claims the library holds.
 *
 * Counted from the registry rather than typed out — the hand-written number had
 * been 100 since well before there were 136 of them.
 */
export const COMPONENT_COUNT = components.length;

/**
 * The components browsing grid.
 *
 * Where a bare "Browse" or "components" link goes. It used to go to
 * `/components/dynamic-island` — a slug with no page behind it, so the CTA in
 * the bar, the hero, the note and the 404 all landed on another 404.
 */
export const BROWSE_HREF = componentCatalogue.browseHref;

/**
 * The docs root.
 *
 * `/docs/guides` was a folder that never existed; the guides are pages inside
 * `/docs` itself (installation, usage, the CLI).
 */
export const DOCS_HREF = "/docs";

/**
 * One real component page, for the links that say "start with a single
 * component" rather than "browse them all".
 *
 * Resolved through the registry so that a renamed slug falls back to the grid
 * instead of to a dead end.
 */
const FEATURED_SLUG = "apple-intelligence";

export const FEATURED_COMPONENT_HREF =
  components.find((component) => component.name === FEATURED_SLUG)?.href ??
  BROWSE_HREF;

export type NavCategory = {
  label: string;
  href: string;
  count: number;
};

/**
 * The nav's view of the four catalogues.
 *
 * `sections` is what the menu lists under a catalogue: for components that is
 * Shaders, Texts, Micro Interactions and Components; for the other three it is
 * one entry, because they are one section each. Each row links at the first
 * page in it, so it lands somewhere real.
 *
 * No blurb: the menus are rows and counts only. A line of prose above them
 * repeated the trigger that had just been hovered and read as an apology for
 * the list underneath it.
 */
export type NavCatalogue = {
  id: string;
  label: string;
  /** The browsing grid. */
  href: string;
  count: number;
  sections: NavCategory[];
  /** Every page in the catalogue — small catalogues list them outright. */
  pages: { label: string; href: string }[];
};

export const NAV_CATALOGUES: NavCatalogue[] = catalogues.map((catalogue) => ({
  id: catalogue.id,
  label: catalogue.label,
  href: catalogue.browseHref,
  count: catalogue.items.length,
  sections: catalogue.sections.map((section) => ({
    label: section.label,
    href: section.items[0]?.href ?? catalogue.browseHref,
    count: section.items.length,
  })),
  pages: catalogue.items.map((item) => ({
    label: item.title,
    href: item.href,
  })),
}));

/** The components catalogue on its own — the one with its own menu. */
export const NAV_COMPONENTS: NavCatalogue = NAV_CATALOGUES.find(
  (catalogue) => catalogue.id === componentCatalogue.id,
)!;

/**
 * Everything that is not a component: pieces, charts, primitives.
 *
 * They used to hang off the components menu, which said they were a kind of
 * component. They are not — so they get their own entries in the bar.
 */
export const NAV_OTHER_CATALOGUES: NavCatalogue[] = NAV_CATALOGUES.filter(
  (catalogue) => catalogue.id !== componentCatalogue.id,
);

/** Kept for the surfaces that just want one row per browsing page. */
export const NAV_CATEGORIES: NavCategory[] = NAV_CATALOGUES.map(
  (catalogue) => ({
    label: catalogue.label,
    href: catalogue.href,
    count: catalogue.count,
  }),
);

/** The components catalogue's docs sections, for its menu's second column. */
export const NAV_SECTIONS: NavCategory[] = NAV_COMPONENTS.sections;
