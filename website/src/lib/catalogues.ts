import {
  componentCategories,
  componentGroups,
  components,
  type ComponentGroup,
  type GeneratedComponent,
} from "@/lib/components.generated";

/**
 * The four catalogues, as navigation sees them.
 *
 * The library holds four different kinds of thing and they were all being
 * listed as one: pieces filed under `---Components---`, charts and primitives
 * hanging off the components menu, and the components grid introducing itself
 * as "every piece". A catalogue is the unit that fixes that — it owns a
 * browsing grid, a run of docs pages, and its own entry in the nav.
 *
 * Everything here is derived from the generated registry, so a component moving
 * between folders under `src/components` moves it here too, with no edit.
 */

export interface CatalogueSection {
  label: string;
  items: readonly GeneratedComponent[];
}

export interface Catalogue {
  id: ComponentGroup;
  label: string;
  /** The browsing grid this catalogue lives on. */
  browseHref: string;
  /** One line on what kind of thing this catalogue holds. */
  blurb: string;
  items: readonly GeneratedComponent[];
  /**
   * Docs sections, in sidebar order.
   *
   * Only the component catalogue is split — Shaders, Texts, Micro Interactions,
   * Components. The other three are small enough that one heading each is
   * navigation and four would be filing.
   */
  sections: CatalogueSection[];
}

const BLURBS: Record<ComponentGroup, string> = {
  component: "Shaders, type, micro interactions and the building blocks",
  piece: "Finished objects — tickets, receipts, cards and badges",
  chart: "Data surfaces, drawn and animated on the device",
  primitive: "The plain interface furniture — switches, tabs, lists, dialogs",
};

function sectionsFor(
  id: ComponentGroup,
  items: readonly GeneratedComponent[],
  label: string,
): CatalogueSection[] {
  if (id !== "component") return [{ label, items }];

  return componentCategories
    .map((category) => ({
      label: category.label,
      items: items.filter((item) => item.categoryType === category.type),
    }))
    .filter((section) => section.items.length > 0);
}

export const catalogues: Catalogue[] = componentGroups.map((group) => {
  const items = components.filter((component) => component.group === group.id);

  return {
    id: group.id,
    label: group.label,
    browseHref: group.href,
    blurb: BLURBS[group.id],
    items,
    sections: sectionsFor(group.id, items, group.label),
  };
});

/** The catalogue everything falls back to — and the biggest one by far. */
export const componentCatalogue = catalogues.find(
  (catalogue) => catalogue.id === "component",
)!;

const catalogueBySlug = new Map<string, Catalogue>(
  catalogues.flatMap((catalogue) =>
    catalogue.items.map((item) => [item.name, catalogue] as const),
  ),
);

export function catalogueForSlug(slug: string): Catalogue | undefined {
  return catalogueBySlug.get(slug);
}

/**
 * The catalogue a docs URL belongs to.
 *
 * Resolved from the slug rather than the path prefix: components, pieces and
 * charts share `/components/<slug>`, so the prefix cannot tell them apart.
 */
export function catalogueForPath(pathname: string): Catalogue {
  const slug = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return catalogueForSlug(slug) ?? componentCatalogue;
}
