interface ITicketPathArgs {
  readonly width: number;
  readonly height: number;
  readonly radius: number;
  /** Horizontal position of the tear line, measured from the left edge */
  readonly tearX: number;
  readonly notchRadius: number;
}

/**
 * Builds the ticket silhouette as a single path: a rounded rectangle followed
 * by two circular subpaths sitting on the tear line. Rendered with
 * `fillRule="evenodd"` the circles punch through, so whatever is behind the
 * ticket shows in the notches — the RN stand-in for a CSS mask.
 */
function buildTicketPath({
  width,
  height,
  radius,
  tearX,
  notchRadius,
}: ITicketPathArgs): string {
  const r = Math.min(radius, width / 2, height / 2);

  const body = [
    `M${r} 0`,
    `H${width - r}`,
    `A${r} ${r} 0 0 1 ${width} ${r}`,
    `V${height - r}`,
    `A${r} ${r} 0 0 1 ${width - r} ${height}`,
    `H${r}`,
    `A${r} ${r} 0 0 1 0 ${height - r}`,
    `V${r}`,
    `A${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");

  if (notchRadius <= 0) return body;

  return [
    body,
    circle(tearX, 0, notchRadius),
    circle(tearX, height, notchRadius),
  ].join(" ");
}

/** A closed circle subpath, drawn as two arcs */
function circle(cx: number, cy: number, r: number): string {
  return [
    `M${cx - r} ${cy}`,
    `a${r} ${r} 0 1 0 ${r * 2} 0`,
    `a${r} ${r} 0 1 0 ${-r * 2} 0`,
    "Z",
  ].join(" ");
}

/** Deterministic bar heights: the same code always prints the same barcode */
function buildBars(seed: string, count: number): number[] {
  const source = seed.length > 0 ? seed : "ticket";
  return Array.from(
    { length: count },
    (_, i) => 1 + ((source.charCodeAt(i % source.length) + i * 5) % 3),
  );
}

export { buildTicketPath, buildBars };
export type { ITicketPathArgs };
