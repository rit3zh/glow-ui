/**
 * A deliberately small YAML front matter reader/writer.
 *
 * The component pages only ever use flat `key: value` pairs, so a full YAML
 * parser would be weight for nothing — and, more importantly, a round trip
 * through one would reformat every file it touches. This reads the pairs and
 * edits the raw text in place, so a backfill changes exactly one line.
 */

export interface FrontMatter {
  values: Record<string, string>;
  /** Index of the line after the opening `---`. */
  start: number;
  /** Index of the closing `---`. */
  end: number;
  lines: string[];
}

function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 1) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'") && trimmed.length > 1)
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontMatter(raw: string): FrontMatter | undefined {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") return undefined;

  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end === -1) return undefined;

  const values: Record<string, string> = {};

  for (let index = 1; index < end; index += 1) {
    const line = lines[index]!;
    // Only top-level scalars — an indented line belongs to the value above it.
    if (/^\s/.test(line)) continue;

    const separator = line.indexOf(":");
    if (separator === -1) continue;

    values[line.slice(0, separator).trim()] = unquote(line.slice(separator + 1));
  }

  return { values, start: 1, end, lines };
}

/**
 * Quotes a value only when YAML would otherwise misread it.
 *
 * Plain scalars cover almost everything these pages carry, URLs included — a
 * colon only ends a key when a space follows it, so `https://…` is safe. The
 * pages are hand-written in that style, and quoting them all would be a large
 * diff that changes nothing.
 */
function serialize(value: string) {
  const needsQuotes =
    value === "" ||
    value !== value.trim() ||
    value.includes(": ") ||
    value.includes(" #") ||
    value.endsWith(":") ||
    /^[-?:,[\]{}#&*!|>'"%@`]/.test(value);

  return needsQuotes ? JSON.stringify(value) : value;
}

/**
 * Returns `raw` with `key: value` set, inserted after `afterKey` when the key is
 * new. Everything else — spacing, ordering, the body — is left untouched.
 */
export function setFrontMatterValue(
  raw: string,
  key: string,
  value: string,
  afterKey?: string,
): string {
  const parsed = parseFrontMatter(raw);
  if (!parsed) throw new Error("no front matter block");

  const { lines, end } = parsed;
  const line = `${key}: ${serialize(value)}`;

  const existing = lines.findIndex(
    (text, index) => index > 0 && index < end && text.startsWith(`${key}:`),
  );

  if (existing !== -1) {
    lines[existing] = line;
    return lines.join("\n");
  }

  const anchor = afterKey
    ? lines.findIndex(
        (text, index) => index > 0 && index < end && text.startsWith(`${afterKey}:`),
      )
    : -1;

  lines.splice(anchor === -1 ? end : anchor + 1, 0, line);
  return lines.join("\n");
}

/** Returns `raw` with `key` removed from the front matter, if it is there. */
export function removeFrontMatterKey(raw: string, key: string): string {
  const parsed = parseFrontMatter(raw);
  if (!parsed) return raw;

  const { lines, end } = parsed;
  const index = lines.findIndex(
    (text, at) => at > 0 && at < end && text.startsWith(`${key}:`),
  );
  if (index === -1) return raw;

  lines.splice(index, 1);
  return lines.join("\n");
}

/**
 * Pulls an inline preview video out of a page body.
 *
 * Pages used to carry their preview as a `<div><video src="…" /></div>` block
 * under the heading. That is data, not layout — it belongs in the front matter
 * where the registry can read it — so this lifts the URL out and drops the
 * block. Returns the URL and the rewritten body, or undefined when the page has
 * no such block.
 */
export function extractInlineVideo(raw: string): { url: string; body: string } | undefined {
  const block =
    /\n*<div[^>]*>\s*<video\b[^>]*?\ssrc=["']([^"']+)["'][^>]*\/>\s*<\/div>\n*/;

  const match = block.exec(raw);
  if (!match) return undefined;

  return {
    // Some blocks carry stray whitespace inside the attribute.
    url: match[1]!.trim(),
    // Collapse to a single blank line so the surrounding sections stay apart.
    body: raw.replace(block, "\n\n"),
  };
}
