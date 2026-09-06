import {
  changelog,
  repositoryUrl,
  type ChangelogEntry,
  type ChangelogRelease,
} from "#/lib/changelog.generated";

import { cn } from "@/components/workspace-ui/lib/utils";

/** Releases shown open; everything older sits behind one disclosure. */
const OPEN = 3;

const LABEL_ORDER = ["Added", "Fixed", "Changed", "Docs"] as const;

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? date : formatter.format(parsed);
}

function groupEntries(entries: ChangelogEntry[]) {
  return LABEL_ORDER.map((label) => ({
    label,
    entries: entries.filter((entry) => entry.label === label),
  })).filter((group) => group.entries.length > 0);
}

function Entry({ entry }: { entry: ChangelogEntry }) {
  return (
    <li className="flex items-baseline justify-between gap-4 py-1 text-sm leading-relaxed">
      <span className="min-w-0 text-foreground">
        {entry.breaking && (
          <span className="mr-1.5 font-mono text-[10px] uppercase tracking-widest">
            breaking
          </span>
        )}
        {entry.scope && (
          <span className="text-muted-foreground">{entry.scope} </span>
        )}
        {entry.subject}
      </span>

      <a
        className="shrink-0 font-mono text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
        href={`${repositoryUrl}/commit/${entry.hash}`}
        rel="noreferrer"
        target="_blank"
      >
        {entry.hash}
      </a>
    </li>
  );
}

function Release({ release }: { release: ChangelogRelease }) {
  const groups = groupEntries(release.entries);

  return (
    <section className="border-border border-t py-7 first:border-t-0 first:pt-0">
      <header className="mb-4 flex items-baseline justify-between gap-4">
        <h3
          className={cn(
            "font-mono text-sm text-foreground",
            release.version === "Unreleased" && "text-muted-foreground",
          )}
        >
          {release.version}
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(release.date)} · {release.entries.length}
        </span>
      </header>

      {groups.map((group) => (
        <div className="mb-4 last:mb-0" key={group.label}>
          <h4 className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {group.label}
          </h4>
          <ul>
            {group.entries.map((entry) => (
              <Entry entry={entry} key={`${entry.hash}-${entry.subject}`} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/**
 * The changelog, rendered from git history.
 *
 * Data comes from `lib/changelog.generated.ts`, which `bun run changelog`
 * rewrites from the commits themselves — nothing on this page is authored.
 */
export function Changelog() {
  const recent = changelog.slice(0, OPEN);
  const older = changelog.slice(OPEN);

  return (
    <div className="not-prose mt-8">
      {recent.map((release) => (
        <Release key={release.version} release={release} />
      ))}

      {older.length > 0 && (
        <details className="group border-border border-t">
          <summary className="cursor-pointer list-none py-4 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">
            <span className="group-open:hidden">
              Show {older.length} earlier releases
            </span>
            <span className="hidden group-open:inline">
              Hide earlier releases
            </span>
          </summary>

          <div className="pb-2">
            {older.map((release) => (
              <Release key={release.version} release={release} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
