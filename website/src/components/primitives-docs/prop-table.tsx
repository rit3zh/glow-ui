import { extractProps } from "#/lib/parse-props";
import {
  CODEBASE_FOLDERS,
  fetchCodebaseFile,
  resolveCodebaseKey,
} from "@/lib/codebase";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * One type's props: Prop / Type / Default / Description, ruled as a grid.
 *
 * Built from `div`s carrying grid roles rather than from a `<table>`, and that
 * is not a stylistic choice. The docs prose sets `.ux #docs-body table`, `th`
 * and `td` — ID-specificity rules that beat any utility class, and that no
 * `not-prose` can switch off, because they are plain descendant selectors
 * rather than prose variants. A real table here came out with a grey header,
 * the framework's own padding, and a `my-4` margin floating it inside its own
 * border. The roles keep the semantics; those rules simply do not apply.
 *
 * Rows come from one of two places. `type` is written in the MDX — the same
 * shape Unlumen's `TypeTable` takes — and is what a page uses when it has
 * something to say about a prop. With no `type`, rows are read out of
 * `types/<slug>/index.ts` in the codebase bucket, which gets the names and the
 * signatures right for free.
 */

export interface PropEntry {
  type: string;
  description?: string;
  default?: string;
  required?: boolean;
}

/**
 * Prop / Type / Default / Description. The last one takes what is left.
 *
 * An inline style rather than `grid-cols-[…]`. The arbitrary value has to carry
 * `minmax(0,1fr)`, and Tailwind does not emit a class for it — which does not
 * fail loudly, it just leaves the rows with no template at all, and four cells
 * with nowhere to go stack into a column.
 */
const COLUMNS = "grid";

const COLUMN_STYLE = {
  gridTemplateColumns: "20% 26% 16% minmax(0, 1fr)",
} as const;

const CELL = "px-5 py-3.5";

/** Em dash, not a hyphen — a hyphen next to a type reads as part of it. */
const EMPTY = "—";

interface Row {
  name: string;
  type: string;
  description?: string;
  default?: string;
}

async function loadRows(name: string, slug?: string): Promise<Row[]> {
  if (!slug) return [];

  const key = await resolveCodebaseKey(CODEBASE_FOLDERS.types, slug, "index.ts");
  const source = key ? await fetchCodebaseFile(key) : null;
  if (!source) return [];

  return extractProps(source, name).map((prop) => ({
    name: prop.name,
    type: prop.type,
    description: prop.description,
    default: prop.defaultValue,
  }));
}

export async function PropTable({
  name,
  slug,
  type,
}: {
  /** The exported interface, e.g. `ITabsRoot`. Optional when `type` is given. */
  name?: string;
  /** The primitive the page documents — the bucket lookup key. */
  slug?: string;
  /** Props written in the MDX, which win over anything in the bucket. */
  type?: Record<string, PropEntry>;
}) {
  const rows: Row[] = type
    ? Object.entries(type).map(([key, prop]) => ({
        name: key,
        type: prop.type,
        description: prop.description,
        default: prop.default,
      }))
    : await loadRows(name ?? "", slug);

  if (rows.length === 0) {
    return (
      <div className="not-prose my-6 rounded-xl border border-border px-5 py-3.5 text-sm text-muted-foreground">
        No props found for <code className="font-mono">{name}</code>.
      </div>
    );
  }

  return (
    <div className="not-prose my-6 overflow-x-auto">
      <div
        className="min-w-[36rem] overflow-hidden rounded-xl border border-border"
        role="table"
      >
        <div
          className={cn(COLUMNS, "border-b border-border")}
          role="row"
          style={COLUMN_STYLE}
        >
          {["Prop", "Type", "Default", "Description"].map((label, index) => (
            <div
              className={cn(
                CELL,
                "text-[15px] font-semibold text-foreground",
                index < 3 && "border-r border-border",
              )}
              key={label}
              role="columnheader"
            >
              {label}
            </div>
          ))}
        </div>

        {rows.map((row, index) => (
          <div
            className={cn(
              COLUMNS,
              index < rows.length - 1 && "border-b border-border",
            )}
            key={row.name}
            role="row"
            style={COLUMN_STYLE}
          >
            <div
              className={cn(
                CELL,
                "border-r border-border font-mono text-sm break-words text-foreground",
              )}
              role="cell"
            >
              {row.name}
            </div>
            <div
              className={cn(
                CELL,
                "border-r border-border font-mono text-sm break-words text-foreground",
              )}
              role="cell"
            >
              {row.type}
            </div>
            <div
              className={cn(
                CELL,
                "border-r border-border font-mono text-sm",
                row.default ? "text-foreground" : "text-muted-foreground",
              )}
              role="cell"
            >
              {row.default ?? EMPTY}
            </div>
            <div
              className={cn(CELL, "text-sm leading-relaxed text-muted-foreground")}
              role="cell"
            >
              {row.description ?? EMPTY}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
