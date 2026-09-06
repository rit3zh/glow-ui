/**
 * The one card surface every docs block sits on — the code panels, the file
 * tree and the props table.
 *
 * They stack directly on top of each other down the page, so any difference in
 * ground colour, border or radius reads as a mistake. Defined once here rather
 * than repeated per component, where the copies drift apart.
 */
export const docsSurface =
  "relative w-full max-w-full overflow-hidden rounded-2xl border-[0.5px] border-border/70 bg-code-surface";

/**
 * Horizontal padding that lines a block's first glyph up with the code inside
 * a code panel. Blocks with their own inner padding subtract it from this.
 */
export const DOCS_SURFACE_PX = 20;
