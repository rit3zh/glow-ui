"use client";

import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { IPhoneMockup } from "@/components/blocks-preview/iphone-mockup";
import { HoverGroup, useHoverItem } from "@/components/landing/hover-group";
import { Chars, Reveal } from "@/components/landing/primitives";
import { cn } from "@/components/workspace-ui/lib/utils";
import type {
  Mockup,
  MockupCategory,
  MockupCategoryId,
} from "@/lib/v2-mockups.generated";

/** One curve for every transition on the page, so the whole thing agrees. */
const EASE = [0.22, 1, 0.36, 1] as const;

/** Case-insensitive match over the slug, title and category. */
function matches(mockup: Mockup, needle: string) {
  if (!needle) return true;
  return (
    mockup.name.includes(needle) ||
    mockup.title.toLowerCase().includes(needle) ||
    mockup.category.includes(needle)
  );
}

export interface BlocksGalleryProps {
  categories: readonly MockupCategory[];
  blocks: readonly Mockup[];
  heading: string;
  intro: string;
  searchLabel?: string;
}

/**
 * The blocks catalogue.
 *
 * The same page as `/primitives` — the hero entering per character, a search
 * field, then one section per category — with the card swapped: a block is a
 * whole screen, and a screen reads as one when it is inside the phone it was
 * captured on rather than floating in a rounded rectangle.
 *
 * Filtering by category is a row of chips rather than the sort toggle the
 * component catalogues carry. There are no release dates behind these, so
 * "newest" has nothing to sort on, and four categories over nineteen screens is
 * few enough to switch between directly.
 */
export function BlocksGallery({
  categories,
  blocks,
  heading,
  intro,
  searchLabel = "Search blocks…",
}: BlocksGalleryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MockupCategoryId | "all">("all");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Typing stays responsive: the input updates immediately, the grid
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

  const sections = useMemo(
    () =>
      categories
        .filter((entry) => category === "all" || entry.id === category)
        .map((entry) => ({
          ...entry,
          items: blocks.filter(
            (block) => block.category === entry.id && matches(block, needle),
          ),
        }))
        .filter((section) => section.items.length > 0),
    [blocks, categories, category, needle],
  );

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: EASE };

  return (
    <>
      {/* The header enters the way the other catalogues do: the heading per
          character, then the intro and the controls rising behind it. The page
          opens at the top of the document, so it runs on mount rather than on
          scroll — the grid below keeps its own in-view reveals. */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-9 px-5 pt-36 text-center sm:pt-44">
        <div className="space-y-4">
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.25rem)] font-normal leading-[1.03] tracking-[-0.02em] text-ink">
            <Chars delay={0.05} immediate spread={1.4}>
              {heading}
            </Chars>
          </h1>
          <Reveal
            as="p"
            blur={14}
            className="mx-auto max-w-md text-[17px] leading-relaxed text-ink/55"
            delay={0.26}
            immediate
          >
            {intro}
          </Reveal>
        </div>

        <Reveal
          className="flex w-full flex-col items-center gap-4"
          delay={0.38}
          immediate
        >
          <div className="group relative w-full sm:max-w-sm">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40 transition-colors duration-200 group-focus-within:text-accent-pro"
            />
            <input
              aria-label="Search blocks"
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

          <CategoryFilter
            categories={categories}
            onChange={setCategory}
            reducedMotion={reducedMotion}
            value={category}
          />
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-24 pb-32 sm:px-8">
        {sections.length === 0 ? (
          <p className="py-24 text-center text-[15px] text-ink/50">
            Nothing matches <span className="text-ink">{query}</span>.
          </p>
        ) : (
          // Keyed on the filter so switching categories crossfades the whole
          // list rather than re-labelling headings in place.
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-24"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key={category}
              transition={transition}
            >
              {sections.map((section) => (
                // The id is what a block page's category link comes back to.
                <section className="scroll-mt-28" id={section.id} key={section.id}>
                  <header className="mb-10">
                    <h2 className="flex items-start gap-2 font-serif text-[clamp(1.9rem,3.5vw,2.75rem)] font-normal leading-tight tracking-[-0.015em] text-ink">
                      {section.title}
                      <sup className="mt-[0.35em] font-sans text-[0.85rem] text-accent-pro">
                        {section.items.length}
                      </sup>
                    </h2>
                    <p className="mt-1 text-[15px] text-ink/50">
                      {section.description}
                    </p>
                  </header>

                  {/* One highlight travels between cards instead of each card
                      cross-fading its own — the same plate the rest of the site
                      uses, so moving across the grid reads as movement. */}
                  <HoverGroup
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                    highlightClassName="rounded-[22px] bg-white/[0.045] ring-[0.5px] ring-inset ring-accent-pro/20"
                  >
                    {section.items.map((block) => (
                      <BlockCard
                        block={block}
                        key={block.name}
                        reducedMotion={reducedMotion}
                      />
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

function BlockCard({
  block,
  reducedMotion,
}: {
  block: Mockup;
  reducedMotion: boolean;
}) {
  // Registers the card with the section's shared highlight.
  const hover = useHoverItem();

  return (
    <Link
      className={cn(
        "group relative z-1 flex min-w-0 flex-col gap-3 rounded-[22px] p-3",
        // The surface is the travelling highlight behind it, so the card holds
        // no background of its own — two plates would double up in transit.
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pro/50",
      )}
      href={`/blocks/${block.name}`}
      {...hover}
      style={{
        // Offscreen cards skip layout and paint entirely; the intrinsic size
        // keeps the scrollbar honest while they are skipped.
        contentVisibility: "auto",
        containIntrinsicSize: "auto 420px",
      }}
    >
      <IPhoneMockup
        alt={`${block.title} — ${block.category} block`}
        className={cn(
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          !reducedMotion && "group-hover:-translate-y-1",
        )}
        src={block.bucketURL}
      />

      <div className="flex items-baseline justify-between gap-3 px-0.5">
        <span className="truncate text-[15px] text-ink/85 transition-colors duration-200 group-hover:text-accent-pro">
          {block.title}
        </span>
      </div>
    </Link>
  );
}

/**
 * The category switch, with the selected pill sliding between options.
 *
 * `layoutId` hands the move to the layout engine, so the pill travels as one
 * object instead of several backgrounds swapping opacity.
 */
function CategoryFilter({
  categories,
  value,
  onChange,
  reducedMotion,
}: {
  categories: readonly MockupCategory[];
  value: MockupCategoryId | "all";
  onChange: (next: MockupCategoryId | "all") => void;
  reducedMotion: boolean;
}) {
  const options = [
    { id: "all" as const, label: "All" },
    ...categories.map((category) => ({
      id: category.id,
      label: category.title,
    })),
  ];

  return (
    <div
      aria-label="Filter blocks by category"
      className="no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto rounded-full border-[0.5px] border-white/10 bg-white/[0.03] p-1"
      role="group"
    >
      {options.map((option) => {
        const selected = value === option.id;

        return (
          <button
            aria-pressed={selected}
            className={cn(
              "relative shrink-0 rounded-full px-4 py-2 text-[14px] transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pro/45",
              selected ? "text-accent-pro" : "text-ink/50 hover:text-ink/85",
            )}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            {selected ? (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-accent-pro/12 ring-[0.5px] ring-inset ring-accent-pro/25"
                layoutId="blocks-category-pill"
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
