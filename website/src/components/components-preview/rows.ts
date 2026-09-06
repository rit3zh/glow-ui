import type { GeneratedComponent } from "@/lib/components.generated";

/** Used for a component whose clip has not been measured. */
export const DEFAULT_ASPECT = 1.6;

export const aspectOf = (component: GeneratedComponent) =>
  component.hoverAspect ?? DEFAULT_ASPECT;

/**
 * How much total aspect a row should carry.
 *
 * A row's media height is the container width divided by the sum of its
 * aspects, so these are really height bounds in disguise: at a ~1216px content
 * width, 3.2 is a ~380px-tall row and 4.4 is a ~276px one. Rows are packed
 * toward `TARGET` and never closed below `MIN`, which is what stops two tall
 * phone captures from forming a row 700px high — and, at these values, what
 * pairs the wide banners up instead of letting one span the page alone.
 *
 * Across the catalogue this lands every row between 216px and 371px, median
 * 286px, with no row left holding a single card.
 */
const TARGET_WEIGHT = 4.4;
const MIN_WEIGHT = 3.2;

/** Never more than this many cards abreast, however narrow they are. */
const MAX_PER_ROW = 4;

const sumAspect = (row: readonly GeneratedComponent[]) =>
  row.reduce((total, item) => total + aspectOf(item), 0);

/**
 * Packs components into justified rows.
 *
 * Greedy with one look-ahead: a card joins the current row unless the row is
 * already at least `MIN_WEIGHT` and adding it would land further from `TARGET`
 * than closing would. A trailing row too light to stand on its own is folded
 * back into the row above rather than left to stretch one card across the full
 * width. Input order is stable, so the server and client pack identically.
 */
export function toRows(items: readonly GeneratedComponent[]) {
  const rows: GeneratedComponent[][] = [];

  let current: GeneratedComponent[] = [];
  let weight = 0;

  for (const item of items) {
    const aspect = aspectOf(item);

    const full = current.length >= MAX_PER_ROW;
    const overshoots =
      weight >= MIN_WEIGHT &&
      Math.abs(weight + aspect - TARGET_WEIGHT) > Math.abs(weight - TARGET_WEIGHT);

    if (current.length > 0 && (full || overshoots)) {
      rows.push(current);
      current = [];
      weight = 0;
    }

    current.push(item);
    weight += aspect;
  }

  if (current.length > 0) rows.push(current);

  // The last row is the only one that can end up under-weight. Folding it into
  // its predecessor is better than a lone tall card blown up to full width —
  // the row above just gets slightly shorter.
  const last = rows.at(-1);
  if (rows.length > 1 && last && sumAspect(last) < MIN_WEIGHT) {
    rows.pop();
    rows[rows.length - 1]!.push(...last);
  }

  return rows;
}
