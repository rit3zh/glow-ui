/**
 * changelog/index.ts
 * -----------------------------------------------------------------------------
 * Derives the changelog from git and writes `lib/changelog.generated.ts`, which
 * the `<Changelog />` MDX component renders on `/docs/changelog`.
 *
 * Nothing here is authored by hand:
 *   • releases        → annotated/lightweight tags, newest first
 *   • unreleased      → commits after the newest tag
 *   • what changed    → the Conventional Commit prefix on each subject
 *   • links           → the commit hash, against the public repo
 *
 * Release plumbing is dropped on the way through: `chore(release):` bumps,
 * `[skip ci]` markers, merge commits, and commits whose subject repeats one
 * already listed in the same release.
 *
 * Usage:
 *   bun scripts/changelog/index.ts          # write the data file
 *   bun scripts/changelog/index.ts --dry    # print a summary, write nothing
 * -----------------------------------------------------------------------------
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../../..");
const OUTPUT = path.resolve(HERE, "../../lib/changelog.generated.ts");

/** Commit links point at the public repo, which is not always `origin`. */
const REPO_URL = process.env.CHANGELOG_REPO ?? "https://github.com/rit3zh/reacticx";

/** Conventional Commit type → the heading it is listed under. */
const GROUPS = {
  Added: ["feat"],
  Fixed: ["fix", "revert"],
  Changed: ["perf", "refactor", "style", "chore", "build", "ci", "test"],
  Docs: ["docs"],
} as const;

type GroupLabel = keyof typeof GROUPS;

const GROUP_ORDER = Object.keys(GROUPS) as GroupLabel[];

const LABEL_FOR = new Map<string, GroupLabel>(
  GROUP_ORDER.flatMap((label) => GROUPS[label].map((type) => [type, label])),
);

/** Subjects that describe the release process rather than the product. */
const NOISE =
  /^(chore\(release\)|release|bump|merge branch|merge pull request|v?\d+\.\d+\.\d+$)/i;

const CONVENTIONAL = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/;

const dry = process.argv.includes("--dry");

interface Entry {
  label: GroupLabel;
  scope?: string;
  breaking: boolean;
  subject: string;
  hash: string;
}

interface Release {
  version: string;
  date: string;
  entries: Entry[];
}

function git(...args: string[]) {
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  }).trim();
}

/** Tags newest first, so each release can be read as a range. */
function tags(): { name: string; date: string }[] {
  const raw = git(
    "tag",
    "--sort=-creatordate",
    "--format=%(refname:short)\t%(creatordate:short)",
  );
  if (!raw) return [];

  return raw.split("\n").map((line) => {
    const [name, date] = line.split("\t");
    return { name: name!, date: date! };
  });
}

/** Strip the leading emoji and whitespace a few older commits carry. */
function clean(subject: string) {
  return subject
    .replace(/^[^\p{L}\p{N}(]+/u, "")
    .replace(/\s*\[skip ci\]\s*$/i, "")
    .trim();
}

function sentence(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parse(line: string): Entry | null {
  const separator = line.indexOf("\t");
  const hash = line.slice(0, separator);
  const subject = clean(line.slice(separator + 1));

  if (!subject || NOISE.test(subject)) return null;

  const match = CONVENTIONAL.exec(subject);

  // A commit without a type still describes a change — list it under Changed
  // rather than dropping it, since older history predates the convention.
  if (!match) {
    return {
      label: "Changed",
      breaking: false,
      subject: sentence(subject),
      hash,
    };
  }

  const [, type, scope, breaking, rest] = match;
  const label = LABEL_FOR.get(type!.toLowerCase()) ?? "Changed";

  return {
    label,
    scope: scope ?? undefined,
    breaking: Boolean(breaking),
    subject: sentence(clean(rest!)),
    hash,
  };
}

function entriesIn(range: string): Entry[] {
  const raw = git("log", "--no-merges", "--format=%h\t%s", range);
  if (!raw) return [];

  const seen = new Set<string>();
  const entries: Entry[] = [];

  for (const line of raw.split("\n")) {
    const entry = parse(line);
    if (!entry) continue;

    const key = `${entry.label}::${entry.scope ?? ""}::${entry.subject.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    entries.push(entry);
  }

  return entries.sort(
    (a, b) =>
      GROUP_ORDER.indexOf(a.label) - GROUP_ORDER.indexOf(b.label) ||
      (a.scope ?? "").localeCompare(b.scope ?? "") ||
      a.subject.localeCompare(b.subject),
  );
}

function build(): Release[] {
  const releases: Release[] = [];
  const all = tags();

  const unreleased = entriesIn(all.length > 0 ? `${all[0]!.name}..HEAD` : "HEAD");
  if (unreleased.length > 0) {
    releases.push({
      version: "Unreleased",
      date: git("log", "-1", "--format=%cs"),
      entries: unreleased,
    });
  }

  for (const [index, tag] of all.entries()) {
    const previous = all[index + 1];
    const range = previous ? `${previous.name}..${tag.name}` : tag.name;
    const entries = entriesIn(range);

    // Tags cut from the same commit as the one before produce empty ranges;
    // there is nothing to say about those, so they are left out.
    if (entries.length === 0) continue;

    releases.push({
      version: tag.name.replace(/^v/, ""),
      date: tag.date,
      entries,
    });
  }

  return releases;
}

const releases = build();
const total = releases.reduce((sum, release) => sum + release.entries.length, 0);

process.stdout.write(
  `${releases.length} release(s) · ${total} change(s)${
    releases[0]?.version === "Unreleased"
      ? ` · ${releases[0].entries.length} unreleased`
      : ""
  }\n`,
);

if (dry) {
  for (const release of releases.slice(0, 5)) {
    process.stdout.write(
      `  ${release.version.padEnd(12)} ${release.date}  ${release.entries.length}\n`,
    );
  }
  process.stdout.write("dry run — nothing written\n");
} else {
  const file = `// Generated by scripts/changelog/index.ts — do not edit by hand.
// Regenerate with \`bun run changelog\`.

export interface ChangelogEntry {
  label: "Added" | "Fixed" | "Changed" | "Docs";
  scope?: string;
  breaking: boolean;
  subject: string;
  hash: string;
}

export interface ChangelogRelease {
  version: string;
  date: string;
  entries: ChangelogEntry[];
}

export const repositoryUrl = ${JSON.stringify(REPO_URL)};

export const changelog: ChangelogRelease[] = ${JSON.stringify(releases, null, 2)};
`;

  fs.writeFileSync(OUTPUT, file, "utf8");
  process.stdout.write(`wrote ${path.relative(REPO_ROOT, OUTPUT)}\n`);
}
