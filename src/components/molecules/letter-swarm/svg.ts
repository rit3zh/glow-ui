import type { ISwarmOutline, TSwarmBox, TSwarmFillRule } from "./types";

const MARKUP = /<\s*(path|rect|circle|ellipse|polygon)\b([^>]*)>/gi;

function attribute(source: string, name: string): string | null {
  const match = source.match(
    new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"),
  );

  return match ? (match[2] ?? match[3] ?? null) : null;
}

function numeric(source: string, name: string, fallback = 0): number {
  const raw = attribute(source, name);
  const value = raw === null ? NaN : parseFloat(raw);

  return Number.isFinite(value) ? value : fallback;
}

function readBox(
  input: number | readonly [number, number] | TSwarmBox | string | undefined,
): TSwarmBox | null {
  if (input === undefined || input === null) return null;

  if (typeof input === "number") {
    return input > 0 ? [0, 0, input, input] : null;
  }

  const parts =
    typeof input === "string"
      ? input
          .trim()
          .split(/[\s,]+/)
          .map(Number)
      : [...input];

  if (parts.some((part) => !Number.isFinite(part))) return null;

  if (parts.length === 2) {
    const [width, height] = parts as [number, number];

    return width > 0 && height > 0 ? [0, 0, width, height] : null;
  }

  if (parts.length === 4) {
    const [x, y, width, height] = parts as [number, number, number, number];

    return width > 0 && height > 0 ? [x, y, width, height] : null;
  }

  return null;
}

function rectangle(attrs: string): string {
  const x = numeric(attrs, "x");
  const y = numeric(attrs, "y");
  const width = numeric(attrs, "width");
  const height = numeric(attrs, "height");

  if (width <= 0 || height <= 0) return "";

  const rx = Math.min(numeric(attrs, "rx", numeric(attrs, "ry")), width / 2);
  const ry = Math.min(numeric(attrs, "ry", rx), height / 2);

  if (rx <= 0 || ry <= 0) {
    return `M${x},${y}h${width}v${height}h${-width}Z`;
  }

  return (
    `M${x + rx},${y}h${width - rx * 2}` +
    `a${rx},${ry} 0 0 1 ${rx},${ry}v${height - ry * 2}` +
    `a${rx},${ry} 0 0 1 ${-rx},${ry}h${-(width - rx * 2)}` +
    `a${rx},${ry} 0 0 1 ${-rx},${-ry}v${-(height - ry * 2)}` +
    `a${rx},${ry} 0 0 1 ${rx},${-ry}Z`
  );
}

function oval(attrs: string, circular: boolean): string {
  const cx = numeric(attrs, "cx");
  const cy = numeric(attrs, "cy");
  const rx = circular ? numeric(attrs, "r") : numeric(attrs, "rx");
  const ry = circular ? numeric(attrs, "r") : numeric(attrs, "ry");

  if (rx <= 0 || ry <= 0) return "";

  return (
    `M${cx - rx},${cy}` +
    `a${rx},${ry} 0 1 0 ${rx * 2},0` +
    `a${rx},${ry} 0 1 0 ${-rx * 2},0Z`
  );
}

function polygon(attrs: string): string {
  const raw = attribute(attrs, "points");

  if (!raw) return "";

  const numbers = raw
    .trim()
    .split(/[\s,]+/)
    .map(Number)
    .filter(Number.isFinite);

  if (numbers.length < 6) return "";

  let data = `M${numbers[0]},${numbers[1]}`;

  for (let i = 2; i + 1 < numbers.length; i += 2)
    data += `L${numbers[i]},${numbers[i + 1]}`;

  return `${data}Z`;
}

function looksLikeMarkup(input: string): boolean {
  return input.includes("<") && input.includes(">");
}

function fromMarkup(markup: string): ISwarmOutline {
  const commands: string[] = [];

  let fillRule: TSwarmFillRule = "nonzero";
  let match: RegExpExecArray | null;

  MARKUP.lastIndex = 0;

  while ((match = MARKUP.exec(markup)) !== null) {
    const tag = match[1]!.toLowerCase();
    const attrs = match[2] ?? "";

    const data =
      tag === "path"
        ? (attribute(attrs, "d") ?? "")
        : tag === "rect"
          ? rectangle(attrs)
          : tag === "polygon"
            ? polygon(attrs)
            : oval(attrs, tag === "circle");

    if (!data.trim()) continue;

    if ((attribute(attrs, "fill-rule") ?? "").toLowerCase() === "evenodd")
      fillRule = "evenodd";

    commands.push(data);
  }

  return {
    commands,
    box: readBox(attribute(markup, "viewBox") ?? undefined),
    fillRule,
  };
}

function readOutline(
  outline: string | readonly string[],
  box: number | readonly [number, number] | TSwarmBox | string | undefined,
  fillRule: TSwarmFillRule | undefined,
): ISwarmOutline {
  const given = readBox(box);

  if (typeof outline === "string" && looksLikeMarkup(outline)) {
    const parsed = fromMarkup(outline);

    return {
      commands: parsed.commands,
      box: given ?? parsed.box,
      fillRule: fillRule ?? parsed.fillRule,
    };
  }

  const commands = (Array.isArray(outline) ? outline : [outline as string])
    .map((command) => String(command).trim())
    .filter(Boolean);

  return { commands, box: given, fillRule: fillRule ?? "nonzero" };
}

export { readBox, readOutline, fromMarkup, looksLikeMarkup };
