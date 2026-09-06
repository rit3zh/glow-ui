# `component.config.json` reference

One JSON file at the project root drives both the CLI and the MCP server. Every
key has a default, so the file only needs what differs — `reacticx init` writes
exactly that, and `reacticx config` / `get_config` print the resolved result with
every default filled in.

A typical file:

```json
{
  "$schema": "https://reacticx.com/schema/component.config.json",
  "outDir": "src/components/ui",
  "aliases": { "components": "@/components/ui" }
}
```

Everything below is what those two lines are layered on top of.

## Keys

### `outDir` — `"src/shared/components"`

Where components are written, relative to the project root. Absolute paths are
rejected. `--dir` (CLI) and `dir` (MCP) override it for a single run without
touching the file.

### `structure` — `"category"`

How component folders are laid out under `outDir`:

| Value | Result for `accordion` |
|---|---|
| `category` | `outDir/molecules/accordion` — grouped the way the registry is |
| `flat` | `outDir/accordion` — one folder per component |
| `mirror` | the library's own layout, nested paths and all |

This also decides where `diff`, `remove` and `list_installed_components` look, so
changing it after components are installed orphans what is already there.

### `typescript` — `true`

Whether the project is TypeScript. Registry source is TypeScript regardless; this
is a signal for how it is treated, not a transpile step.

### `aliases`

The import prefixes written into copied source.

| Key | Default | Points at |
|---|---|---|
| `components` | `"@/shared/components"` | `outDir` |
| `utils` | `"@/shared/utils"` | `paths.utils` |
| `hooks` | `"@/shared/hooks"` | `paths.hooks` |

**These must match the project's real path mapping** — `compilerOptions.paths` in
`tsconfig.json`, and whatever Babel/Metro resolver config backs it. `reacticx init`
reads `tsconfig.json` / `jsconfig.json` and suggests an alias that already works.

Set an alias to `""` to force relative imports for that root. An import that would
fall outside its root becomes relative automatically, alias or not.

### `paths`

Where non-component files go, relative to the project root.

| Key | Default | Holds |
|---|---|---|
| `utils` | `"src/shared/utils"` | shared helpers a component imports |
| `hooks` | `"src/shared/hooks"` | shared hooks |
| `types` | `"src/shared/types"` | published types, with `--types` |
| `examples` | `"src/shared/examples"` | example screens, with `--examples` |

### `include`

What an add pulls in by default.

| Key | Default | Effect |
|---|---|---|
| `types` | `false` | copy published types alongside the component |
| `examples` | `false` | copy the example screen |
| `dependencies` | `true` | follow imports into other registry components and shared helpers |

Turning `dependencies` off produces source with imports nothing satisfies. Leave
it on unless you are deliberately supplying those modules yourself.

### `overwrite` — `false`

Whether an add may replace existing files without asking. Leaving it `false` and
passing `--overwrite` per run is safer: it keeps an accidental re-add from
discarding local edits.

### `packageManager` — `"auto"`

`auto`, `bun`, `pnpm`, `yarn` or `npm`. `auto` picks by lockfile —
`bun.lockb`/`bun.lock`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json` — and
falls back to whichever manager is on `PATH`.

### `installDependencies` — `"prompt"`

What the CLI does about missing npm packages: `auto` installs them, `prompt` asks,
`never` only prints the command. The MCP server never installs regardless — it
always returns the command.

### `registry`

| Key | Default | Meaning |
|---|---|---|
| `origin` | the public R2 bucket URL | http(s) origin, no trailing slash |
| `index` | `"index.json"` | the file index, with per-file checksums |
| `registry` | `"core/registry.json"` | the component registry |
| `cache` | `3600` | TTL in seconds, or `false` to always refetch |

Listings are cached under `~/.cache/reacticx`, keyed by origin. Clear it with
`reacticx config --clear-cache` or the `refresh_registry` tool when a newly
published component does not appear.

## How a path is actually resolved

For `reacticx add accordion` with the typical config above:

1. `accordion` is `molecules/accordion` in the registry.
2. `structure: "category"` puts it at `src/components/ui/molecules/accordion`.
3. Its `@/components/…` imports are rewritten against `aliases.components`, giving
   `@/components/ui/…`.
4. `@/utils/…` and `@/helpers/…` imports resolve to `paths.utils` / `paths.hooks`,
   the files are copied there, and the imports are rewritten to `aliases.utils` /
   `aliases.hooks`.
5. Anything that lands outside an alias root is written as a relative import.

If step 3 produces an alias the bundler does not know, nothing errors at add time —
it fails later at type-check or at runtime. Confirming the alias resolves is the
single highest-value check after the first add.

## Validation

Invalid values fail loudly rather than being silently ignored: a non-relative
`outDir`, an unknown `structure`, `packageManager` or `installDependencies`, an
`origin` that is not http(s) or ends in a slash, a negative `cache`, or a
non-string alias. `reacticx config` reports the same problems against the file
already on disk.
