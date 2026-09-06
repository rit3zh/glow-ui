import chalk from "chalk";
import ora, { type Ora } from "ora";
import prompts, { type PromptObject } from "prompts";

export const c = chalk;
export const accent = chalk.hex("#8AA9FF");
export const muted = chalk.hex("#6B7280");

const ANSI = /\x1b\[[0-9;]*m/g;
const RESET = "\x1b[0m";

const GLYPH = {
  topLeft: "╭",
  topRight: "╮",
  bottomLeft: "╰",
  bottomRight: "╯",
  horizontal: "─",
  vertical: "│",
  ok: "✓",
  warn: "!",
  fail: "✗",
  dot: "·",
  arrow: "→",
} as const;

const MAX_WIDTH = 78;
const MIN_WIDTH = 48;
const PADDING = 2;

export function width() {
  const columns = process.stdout.columns ?? MAX_WIDTH;
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, columns - 4));
}

export function innerWidth() {
  return width() - 2 - PADDING * 2;
}

export function visible(text: string) {
  return text.replace(ANSI, "").length;
}

export function clip(text: string, limit: number) {
  if (visible(text) <= limit) return text;

  let out = "";
  let seen = 0;
  let index = 0;

  while (index < text.length && seen < limit - 1) {
    if (text[index] === "\x1b") {
      const end = text.indexOf("m", index);
      if (end === -1) break;
      out += text.slice(index, end + 1);
      index = end + 1;
      continue;
    }
    out += text[index];
    index += 1;
    seen += 1;
  }

  return out + "…" + (out.includes("\x1b") ? RESET : "");
}

export function shorten(value: string, limit: number) {
  if (value.length <= limit) return value;
  const head = Math.ceil((limit - 1) / 2);
  const tail = Math.floor((limit - 1) / 2);
  return `${value.slice(0, head)}…${value.slice(value.length - tail)}`;
}

export type Row = string | { kind: "gap" } | { kind: "rule"; label?: string };

export const row = {
  gap: (): Row => ({ kind: "gap" }),
  rule: (label?: string): Row => ({ kind: "rule", label }),
  text: (text: string): Row => text,
  dim: (text: string): Row => muted(text),
  item: (text: string): Row => `${muted(GLYPH.dot)} ${text}`,
  ok: (text: string): Row => `${chalk.green(GLYPH.ok)} ${text}`,
  warn: (text: string): Row => `${chalk.yellow(GLYPH.warn)} ${text}`,
  fail: (text: string): Row => `${chalk.red(GLYPH.fail)} ${text}`,
  field: (label: string, value: string, labelWidth = 16): Row =>
    `${muted(label.padEnd(labelWidth))}${value}`,
  path: (value: string): Row => muted(shorten(value, innerWidth())),
};

export interface BoxOptions {
  title?: string;
  badge?: string;
  rows: Row[];
  color?: (text: string) => string;
}

export function box({ title, badge, rows, color = muted }: BoxOptions) {
  const total = width();
  const inner = innerWidth();
  const bar = (count: number) => GLYPH.horizontal.repeat(Math.max(0, count));
  const pad = " ".repeat(PADDING);
  const lines: string[] = [];

  const heading = title ? ` ${chalk.bold(title)} ` : "";
  const stamp = badge ? ` ${muted(badge)} ` : "";
  const filler = total - 2 - visible(heading) - visible(stamp);

  lines.push(
    color(GLYPH.topLeft + bar(1)) +
      heading +
      color(bar(filler - 1)) +
      stamp +
      color(GLYPH.topRight),
  );

  const spaced: Row[] = [];
  for (const source of rows) {
    const entries = typeof source === "string" ? source.split("\n") : [source];

    for (const entry of entries) {
      const isRule = typeof entry === "object" && entry.kind === "rule";
      const previous = spaced[spaced.length - 1];
      const previousIsGap =
        typeof previous === "object" && previous.kind === "gap";

      if (isRule && spaced.length > 0 && !previousIsGap) spaced.push(row.gap());
      spaced.push(entry);
    }
  }

  for (const entry of spaced) {
    if (typeof entry === "object") {
      if (entry.kind === "gap") {
        lines.push(
          color(GLYPH.vertical) + " ".repeat(total - 2) + color(GLYPH.vertical),
        );
        continue;
      }
      const label = entry.label ? `${muted(entry.label)} ` : "";
      lines.push(
        color(GLYPH.vertical) +
          pad +
          label +
          color(bar(inner - visible(label))) +
          pad +
          color(GLYPH.vertical),
      );
      continue;
    }

    const content = clip(entry, inner);
    const fill = " ".repeat(Math.max(0, inner - visible(content)));
    lines.push(
      color(GLYPH.vertical) +
        pad +
        content +
        fill +
        pad +
        color(GLYPH.vertical),
    );
  }

  lines.push(color(GLYPH.bottomLeft + bar(total - 2) + GLYPH.bottomRight));

  console.log();
  for (const line of lines) console.log(`  ${line}`);
  console.log();
}

export const ui = {
  box,
  row,

  hint(text: string) {
    console.log(`  ${muted(text)}`);
    console.log();
  },

  commands(entries: [string, string][]): Row[] {
    const inner = innerWidth();
    const labelWidth = Math.max(...entries.map(([label]) => label.length)) + 2;

    return entries.map(
      ([label, description]) =>
        accent(label.padEnd(labelWidth)) +
        muted(clip(description, inner - labelWidth)),
    );
  },

  spinner(text: string): Ora {
    return ora({ text: muted(text), spinner: "dots", indent: 2 }).start();
  },

  async ask<T extends string>(
    questions: PromptObject<T> | PromptObject<T>[],
  ): Promise<prompts.Answers<T>> {
    console.log();
    const answers = await prompts(questions, {
      onCancel() {
        console.log();
        console.log(`  ${muted("cancelled")}`);
        console.log();
        process.exit(0);
      },
    });
    console.log();
    return answers;
  },
};

export function bail(text: string, hints: string[] = []): never {
  box({
    title: "failed",
    color: chalk.red,
    rows: [row.fail(text), ...hints.map((hint) => row.dim(hint))],
  });
  process.exit(1);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function closest(input: string, candidates: string[], limit = 5) {
  const needle = input.toLowerCase();

  const scored = candidates
    .map((candidate) => {
      const name = candidate.toLowerCase();
      if (name === needle) return { candidate, score: 0 };
      if (name.startsWith(needle)) return { candidate, score: 1 };
      if (name.includes(needle)) return { candidate, score: 2 };

      const distance = editDistance(needle, name);
      const tolerance = Math.max(2, Math.floor(needle.length / 3));
      return {
        candidate,
        score: distance <= tolerance ? 3 + distance : Infinity,
      };
    })
    .filter((entry) => Number.isFinite(entry.score))
    .sort(
      (a, b) => a.score - b.score || a.candidate.localeCompare(b.candidate),
    );

  return scored.slice(0, limit).map((entry) => entry.candidate);
}

function editDistance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        previous[j]! + 1,
        current[j - 1]! + 1,
        previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }

  return previous[b.length]!;
}
