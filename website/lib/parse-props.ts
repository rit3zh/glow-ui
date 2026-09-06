export interface ParsedProp {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
}

/** `@default 12` / `@defaultValue "auto"` on its own comment line. */
const DEFAULT_TAG = /^@default(?:Value)?\s+(.+)$/;

/**
 * Pull the `@default` tag out of a member's comment lines — it is a column of
 * its own in the table, not part of the prose.
 */
function splitComment(commentLines: string[]) {
  const prose: string[] = [];
  let defaultValue: string | undefined;

  for (const line of commentLines) {
    const tag = DEFAULT_TAG.exec(line);
    if (tag) {
      defaultValue = tag[1].replace(/[.;,]+$/, "").trim();
      continue;
    }
    prose.push(line);
  }

  return { description: prose.join(" ") || undefined, defaultValue };
}

/**
 * The declaration bodies these files use are hand-written and uniform — one
 * member per line, no computed keys, no declaration merging — so they are read
 * with a scanner rather than by loading the TypeScript compiler, which would
 * otherwise have to ship in the server bundle for a build-time-only concern.
 */
function extractBody(source: string, name: string) {
  // A generic parameter list can sit between the name and the body, and an
  // interface can extend before it.
  const generics = "(?:<[^>]*>)?";
  const declaration = new RegExp(
    `(?:^|\\n)\\s*(?:export\\s+)?(?:` +
      `type\\s+${name}${generics}\\s*=\\s*|` +
      `(?:interface|enum)\\s+${name}${generics}\\s*(?:extends[^{]+)?` +
      `)\\{`,
  ).exec(source);

  if (!declaration) return null;

  const start = declaration.index + declaration[0].length;
  let depth = 1;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index);
    }
  }

  return null;
}

/**
 * Split the body into members, one per line.
 *
 * Splitting on `;` would be the obvious rule, but a member's type can be an
 * arrow or a generic that carries its own punctuation — `() => void` alone
 * makes a naive bracket counter go negative. These files put one member on one
 * line, so lines are the unit, and a member only ends once every bracket it
 * opened is closed again.
 */
function splitMembers(body: string) {
  const members: string[] = [];
  let depth = 0;
  let current: string[] = [];

  const hasCode = () =>
    current.some((line) => {
      const trimmed = line.trim();
      return (
        trimmed.length > 0 &&
        !trimmed.startsWith("/") &&
        !trimmed.startsWith("*")
      );
    });

  for (const line of body.split("\n")) {
    current.push(line);

    for (const char of line) {
      if ("{([".includes(char)) depth += 1;
      else if ("})]".includes(char)) depth -= 1;
    }

    // A comment sitting on its own line belongs to the member below it, so
    // the buffer is only flushed once it holds an actual declaration.
    if (depth <= 0 && hasCode()) {
      members.push(current.join("\n"));
      current = [];
      depth = 0;
    }
  }

  if (hasCode()) members.push(current.join("\n"));

  return members;
}

const MEMBER =
  /^(?:readonly\s+)?([A-Za-z_$][\w$]*|"[^"]+"|\[[^\]]+\])(\?)?\s*:\s*([\s\S]+)$/;

/** An enum member — `Circular = "circular"` — carries a value, not a type. */
const ENUM_MEMBER = /^([A-Za-z_$][\w$]*)\s*=\s*([\s\S]+)$/;

function parseMember(raw: string): ParsedProp | null {
  const commentLines: string[] = [];
  const codeLines: string[] = [];

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (
      trimmed.startsWith("/**") ||
      trimmed.startsWith("*") ||
      trimmed.startsWith("//") ||
      trimmed.startsWith("*/")
    ) {
      const text = trimmed
        .replace(/^\/\*\*?/, "")
        .replace(/\*\/$/, "")
        .replace(/^\*\s?/, "")
        .replace(/^\/\/\s?/, "")
        .trim();
      if (text) commentLines.push(text);
      continue;
    }

    codeLines.push(trimmed);
  }

  const code = codeLines.join(" ").trim();
  if (!code) return null;

  const { description, defaultValue } = splitComment(commentLines);

  const match = MEMBER.exec(code);

  if (!match) {
    const enumMatch = ENUM_MEMBER.exec(code);
    if (!enumMatch) return null;

    return {
      name: enumMatch[1],
      type: enumMatch[2].replace(/[;,]+$/, "").trim(),
      required: true,
      description,
      defaultValue,
    };
  }

  const [, name, optional, type] = match;

  return {
    name,
    // The line separator rides along with the type and is not part of it.
    type: type
      .replace(/\s+/g, " ")
      .replace(/[;,]+$/, "")
      .trim(),
    required: !optional,
    description,
    defaultValue,
  };
}

/**
 * Read one exported type or interface out of the source text of a component's
 * `types/<component>/index.ts`, fetched from the codebase bucket.
 */
export function extractProps(source: string, name: string): ParsedProp[] {
  const body = extractBody(source, name);
  if (!body) return [];

  return splitMembers(body)
    .map(parseMember)
    .filter((prop): prop is ParsedProp => prop !== null);
}

