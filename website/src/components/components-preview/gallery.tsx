"use client";

import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { PreviewCard } from "@/components/components-preview/preview-card";
import { toRows } from "@/components/components-preview/rows";
import { HoverGroup } from "@/components/landing/hover-group";
import { Chars, Reveal } from "@/components/landing/primitives";
import {
  componentCategories,
  type ComponentCategoryType,
  type GeneratedComponent,
} from "@/lib/components.generated";
import { cn } from "@/components/workspace-ui/lib/utils";

type Sort = "default" | "newest";

/** What each section says about itself, under its heading. */
const CATEGORY_BLURBS: Record<ComponentCategoryType, string> = {
  shaders: "Skia and GPU-backed surfaces, orbs and gradients",
  texts: "Type that reveals, waves, morphs and shimmers",
  "micro-interactions": "Small, tactile responses to a single gesture",
  primitives: "The plain interface furniture — switches, tabs, lists and dialogs",
  charts: "Data surfaces, drawn and animated on the device",
  components: "The building blocks — inputs, sheets, carousels and navigation",
};

const SORTS: { value: Sort; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
];

/** One curve for every transition on the page, so the whole thing agrees. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Case-insensitive match over the name, title and description. */
function matches(component: GeneratedComponent, needle: string) {
  if (!needle) return true;
  return (
    component.name.includes(needle) ||
    component.title.toLowerCase().includes(needle) ||
    component.description.toLowerCase().includes(needle)
  );
}

function byNewest(a: GeneratedComponent, b: GeneratedComponent) {
  return (Date.parse(b.lastModified) || 0) - (Date.parse(a.lastModified) || 0);
}

export interface GalleryProps {
  /** The catalogue this page browses. */
  items: readonly GeneratedComponent[];
  heading: string;
  intro: string;
  /** Placeholder for the search field. */
  searchLabel?: string;
  /**
   * Fall back to one flat section when the catalogue is too small to be worth
   * splitting — four headings over nine cards is filing, not navigation.
   */
  flatTitle?: string;
  flatBlurb?: string;
}

export function ComponentsGallery({
  items,
  heading,
  intro,
  searchLabel = "Search… (or just explore)",
  flatTitle,
  flatBlurb,
}: GalleryProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Typing stays responsive: the input updates immediately, the 113-card grid
  // re-filters at React's convenience.
  const deferredQuery = useDeferredValue(query);
  const needle = deferredQuery.trim().toLowerCase();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const filtered = useMemo(
    () => items.filter((component) => matches(component, needle)),
    [items, needle],
  );

  /**
   * Sorting by date collapses the categories.
   *
   * "Newest" is a question about the whole catalogue — splitting the answer
   * across four headings would bury the actual newest component under whichever
   * section it happens to belong to.
   */
  const sections = useMemo(() => {
    if (flatTitle) {
      return [
        {
          key: "all",
          title: flatTitle,
          blurb: flatBlurb ?? "",
          items: sort === "newest" ? [...filtered].sort(byNewest) : filtered,
        },
      ];
    }

    if (sort === "newest") {
      return [
        {
          key: "newest",
          title: "Newest Components",
          blurb: "Sorted from the most recent release to the oldest.",
          items: [...filtered].sort(byNewest),
        },
      ];
    }

    return componentCategories
      .map((category) => ({
        key: category.type,
        title: category.label,
        blurb: CATEGORY_BLURBS[category.type],
        items: filtered.filter(
          (component) => component.categoryType === category.type,
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [filtered, flatBlurb, flatTitle, sort]);

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: EASE };

  return (
    <>
      {/* The header enters the way the landing hero does: the heading per
          character on numeric-text's curve, then the intro and the controls
          rising behind it. Every catalogue page opens at the top of the
          document, so it runs on mount rather than on scroll — the grid below
          keeps its own in-view reveals. */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-9 px-5 pt-36 text-center sm:pt-44">
        <div className="space-y-4">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.25rem)] font-normal leading-[1.03] tracking-[-0.02em] text-ink">
            {/* Keyed on the heading so a client-side move between catalogues
                replays the entrance instead of leaving the old line settled. */}
            <Chars delay={0.05} immediate key={heading} spread={1.4}>
              {heading}
            </Chars>
          </h1>
          <Reveal
            as="p"
            blur={14}
            className="mx-auto max-w-md text-[17px] leading-relaxed text-ink/55"
            delay={0.26}
            immediate
            key={intro}
          >
            {intro}
          </Reveal>
        </div>

        <Reveal
          className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
          delay={0.38}
          immediate
        >
          <div className="group relative w-full sm:max-w-sm">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40 transition-colors duration-200 group-focus-within:text-accent-pro"
            />
            <input
              aria-label="Search components"
              className={cn(
                "h-11 w-full rounded-full border-[0.5px] border-white/10 bg-white/[0.03] pr-4 pl-11",
                "text-[15px] text-ink placeholder:text-ink/35",
                "transition-[border-color,background-color,box-shadow] duration-200",
                "hover:bg-white/[0.05]",
                "focus:border-accent-pro/40 focus:bg-white/[0.05] focus:outline-none",
                "focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-accent-pro)_14%,transparent)]",
              )}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchLabel}
              type="search"
              value={query}
            />
          </div>

          <SortToggle
            onChange={setSort}
            reducedMotion={reducedMotion}
            value={sort}
          />
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-24 pb-32 sm:px-8">
        {sections.length === 0 ? (
          <p className="py-24 text-center text-[15px] text-ink/50">
            Nothing matches <span className="text-ink">{query}</span>.
          </p>
        ) : (
          // Keyed on the sort so switching modes crossfades the whole list
          // rather than re-labelling headings in place.
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-24"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key={sort}
              transition={transition}
            >
              {sections.map((section) => (
                <section key={section.key}>
                  <header className="mb-10">
                    <h2 className="flex items-start gap-2 font-serif text-[clamp(1.9rem,3.5vw,2.75rem)] font-normal leading-tight tracking-[-0.015em] text-ink">
                      {section.title}
                      <sup className="mt-[0.35em] font-sans text-[0.85rem] text-accent-pro">
                        {section.items.length}
                      </sup>
                    </h2>
                    <p className="mt-1 text-[15px] text-ink/50">
                      {section.blurb}
                    </p>
                  </header>

                  {/* One highlight travels between cards instead of each card
                      cross-fading its own — the same plate the landing page
                      uses, so hovering across the grid reads as movement. */}
                  {/* Justified rows rather than a fixed grid: each card's
                      width is proportional to its clip's aspect, so every card
                      in a row lands on the same media height and none of them
                      is cropped to fit a box it never matched. */}
                  <HoverGroup
                    className="flex flex-col gap-4"
                    highlightClassName="rounded-[18px] bg-white/[0.045] ring-[0.5px] ring-inset ring-accent-pro/20"
                  >
                    {toRows(section.items).map((row) => (
                      <div
                        className="flex flex-col gap-4 md:flex-row"
                        key={row.map((item) => item.name).join("|")}
                      >
                        {row.map((component) => (
                          <PreviewCard
                            component={component}
                            key={component.name}
                            reducedMotion={reducedMotion}
                            standalone={row.length === 1}
                          />
                        ))}
                      </div>
                    ))}
                  </HoverGroup>
                </section>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </>
  );
}

/**
 * The sort switch, with the selected pill sliding between options.
 *
 * `layoutId` hands the move to the layout engine, so the pill travels as one
 * object instead of two backgrounds swapping opacity.
 */
function SortToggle({
  value,
  onChange,
  reducedMotion,
}: {
  value: Sort;
  onChange: (next: Sort) => void;
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-label="Sort components"
      className="flex shrink-0 items-center gap-1 rounded-full border-[0.5px] border-white/10 bg-white/[0.03] p-1"
      role="group"
    >
      {SORTS.map((option) => {
        const selected = value === option.value;

        return (
          <button
            aria-pressed={selected}
            className={cn(
              "relative rounded-full px-4 py-2 text-[14px] transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pro/45",
              selected ? "text-accent-pro" : "text-ink/50 hover:text-ink/85",
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {selected ? (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent-pro/12 ring-[0.5px] ring-inset ring-accent-pro/25"
                layoutId="components-sort-pill"
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 36 }
                }
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
