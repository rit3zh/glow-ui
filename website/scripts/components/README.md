# Component registry

Turns the component `.mdx` pages into the two things that have to agree with
them: the docs sidebar and a typed registry the rest of the site can import.

```
app/components/<name>/            a component with no page yet
        │  scaffold
        ▼
content/components/*.mdx          the source of truth
        │  sync
        ├──► content/components/meta.json        fumadocs sidebar
        └──► src/lib/components.generated.ts     [{ categoryType, name, … }]
```

## Usage

```bash
bun run components:scaffold    # write pages for components that have none
bun run components:sync        # regenerate both outputs
bun run components:sync:dry    # show what would change
bun run components:check       # exit 1 if the outputs are stale (CI)
bun run components:prune       # delete pages whose component no longer exists

bun scripts/components/index.ts --no-backfill
bun scripts/components/scaffold.ts --only metal,tray --dry
```

## Categories

`category` in a page's front matter decides which section it lands in:

| `categoryType`       | sidebar separator        |
| -------------------- | ------------------------ |
| `shaders`            | `---Shaders---`          |
| `texts`              | `---Texts---`            |
| `micro-interactions` | `---Micro Interactions---` |
| `components`         | `---Components---`       |

```mdx
---
title: Aurora
category: shaders
description: A Skia-based animated aurora effect
icon: SwatchBook
---
```

To move a component to another section, change that one line and re-run.

Pages are sorted alphabetically inside their section, and sections keep the order
in `config.ts`. Both outputs derive from the same sorted list, so they can never
disagree.

## Backfill

Pages written before `category` existed inherit the section they already sit
under in `meta.json`, and the CLI writes it back into the file. After one run the
`.mdx` files are the only input and both outputs are disposable — regenerate them
at any time.

The front matter writer edits the raw text, inserting a single line after
`title:`. It does not round-trip through a YAML parser, so nothing else in the
file is reformatted. `--no-backfill` skips the write and keeps reading categories
out of `meta.json`.

A page with no category anywhere falls back to `components` and is listed in the
output, so it is visible rather than silently misfiled.

## Videos

Each page carries two clips:

| front matter    | source bucket             | shown                        |
| --------------- | ------------------------- | ---------------------------- |
| `hoverVideo`    | `reacticx-landing-assets` | short loop, card on hover     |
| `previewVideo`  | the preview origins       | full demo, the page itself    |

`hoverVideo` is **derived, not authored** — a component has one exactly when a
landing asset has been recorded for it, so `bun run assets:sync` followed by
`components:sync` is all it takes to attach one. `previewVideo` is authored, and
was split out of the older single `video:` key.

Pages that used to carry their preview inline as a `<div><video src="…" /></div>`
block are migrated automatically: the URL is hoisted into `previewVideo` and the
markup removed.

Every run reports which pages are still missing a clip in either slot.

## Scaffolding new pages

`components:scaffold` writes a page for every folder in `app/components` that has
no `.mdx` yet. It derives what it can from the component's own source:

- **dependencies** from the real imports in `src/components/**` and
  `app/components/**`, so the install block cannot drift from the code
- **props table** from the generated `types/<name>/index.ts`, picking the
  public root interface over the internal `*Context` / `*State` ones
- **hover video** from the landing-asset bucket

Title, icon, description and category are the parts a generator cannot infer, so
they live in `scaffold-data.ts`. A component missing from that table is still
scaffolded — title guessed from the slug — and listed in the output.

Existing pages are never touched; rerunning only fills gaps. Full-screen designs
documented under `/templates` are skipped via `templateSlugs`.

## Orphaned pages

A page is orphaned when its component has no folder left in **either**
`src/components` or `app/components` — it documents something that has been
deleted. Every run lists them; `--prune` deletes the `.mdx` and drops it from
both outputs.

Having source in only one of the two is not orphaned. A component with core
source but no example still documents fine, so it is reported separately rather
than removed.

## The file tree

`<ComponentFiles name="…" />` renders the component's folder as it actually is,
read from the bucket: every file, nested directories included.

```
your-project/components/templates/parallax-header
  index.ts
  ParallaxHeader.props.ts
  components/     AnimatedHeader.tsx, AnimatedNavBar.tsx, …
  constants/
  helpers/
  hooks/
  types/
```

Loose files come first with the entry point at the top, then subfolders, which
start collapsed. The install path is the component's real location in the
library, not a guess.

The older `<ComponentSource name="…" />` showed a single file and is rewritten to
`<ComponentFiles>` on sync, so no page can drift back to hiding most of what a
component ships.

## Adding a component

1. `bun run components:scaffold` (add an entry to `scaffold-data.ts` first, for a
   real title and description).
2. Edit the generated `.mdx`.
3. `bun run components:sync`
4. Commit the `.mdx`, `meta.json`, and `components.generated.ts`.

## Consuming the registry

```ts
import {
  components,
  componentsIn,
  getComponent,
  type ComponentName,
} from "@/lib/components.generated";

componentsIn("shaders");          // every shader page, in sidebar order
getComponent("aurora")?.title;    // "Aurora"
components.length;                // 111
```

`ComponentName` is a literal union of every slug, so a typo is a compile error.
