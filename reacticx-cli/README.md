# reacticx

React Native components, copied into your project.

```bash
npx reacticx init          # once, per project
npx reacticx add accordion # as often as you like
```

Nothing is installed as a dependency. `add` writes the component's source into
your repo, rewrites its imports to match your paths, and gets out of the way —
the files are yours to edit from that point on.

## Where the files come from

Everything is read from **`reacticx-codebase`**, the R2 bucket that mirrors the
library source one object per file:

| prefix                    | holds                                          |
| ------------------------- | ---------------------------------------------- |
| `core/…`                  | the components themselves                      |
| `types/<component>/`      | the component's extracted public types          |
| `examples/<component>/`   | the screen that documents it                   |
| `helpers/…`, `shared/…`   | what a component's `@/…` imports point at      |

The bucket cannot be listed over HTTP, so `index.json` at its root describes
every object — key, size, sha256, content type. That listing decides which files
a component has, and every download is checked against its hash before it
touches your disk. `core/registry.json` supplies the metadata around it:
category, repo path, the component list `list` prints.

## Commands

| Command                        | What it does                                          |
| ------------------------------ | ----------------------------------------------------- |
| `reacticx init`                | write `component.config.json`                          |
| `reacticx add [components…]`   | copy components in — omit names to pick from a list    |
| `reacticx list`                | every component in the registry                        |
| `reacticx info <component>`    | what one contains, and whether it is installed          |
| `reacticx diff [component]`    | compare what you have against the registry             |
| `reacticx remove <components…>`| delete an installed component                          |
| `reacticx config`              | print the configuration as the CLI resolves it         |
| `reacticx create [name]`       | scaffold a new Expo app with reacticx set up            |

### `add`

| Flag                | Effect                                                    |
| ------------------- | --------------------------------------------------------- |
| `-o, --overwrite`   | replace files that already exist                           |
| `-d, --dir <path>`  | write somewhere other than the configured `outDir`         |
| `-t, --types`       | also copy the component's public types                     |
| `-e, --examples`    | also copy the example screen                               |
| `--no-deps`         | do not follow imports into other components                |
| `--no-install`      | never install missing npm packages                         |
| `--dry`             | show what would be written, write nothing                  |
| `-y, --yes`         | no prompts — safe defaults for everything                  |

Adding one component adds what it needs. The source is scanned for `@/…`
imports, and anything that maps into the bucket — another component, a shared
hook, a helper — is fetched too and reported as `required by <component>`.

Imports are then rewritten to your own paths, so nothing arrives pointing at the
library's internal aliases.

### Missing npm packages

The registry is a mirror of source, not a package index, so there is no
dependency list to trust. Instead the imports in the files just written are read
back, anything already in your `package.json` is dropped, and what remains is
offered for install with your own package manager. `installDependencies` in the
config decides whether that is a prompt, automatic, or never.

## Configuration

`component.config.json`, in the project root. Every key is optional.

```json
{
  "$schema": "https://reacticx.com/schema/component.config.json",
  "outDir": "src/shared/components",
  "structure": "category",
  "aliases": { "components": "@/shared/components" },
  "include": { "dependencies": true }
}
```

| Key                   | Default                   | Meaning                                                                |
| --------------------- | ------------------------- | ---------------------------------------------------------------------- |
| `outDir`              | `src/shared/components`   | where components are written                                            |
| `structure`           | `category`                | `category`, `flat`, or `mirror` — how folders nest inside `outDir`      |
| `typescript`          | `true`                    | the library ships TypeScript source                                     |
| `aliases.components`  | `@/shared/components`     | import prefix written into copied files; empty means relative imports    |
| `aliases.utils`       | `@/shared/utils`          | same, for helpers                                                       |
| `aliases.hooks`       | `@/shared/hooks`          | same, for hooks                                                         |
| `paths.utils`         | `src/shared/utils`        | where helpers land on disk                                              |
| `paths.hooks`         | `src/shared/hooks`        | where hooks land                                                        |
| `paths.types`         | `src/shared/types`        | where extracted types land                                              |
| `paths.examples`      | `src/shared/examples`     | where example screens land                                              |
| `include.dependencies`| `true`                    | follow `@/…` imports and copy what they point at                        |
| `include.types`       | `false`                   | copy the public types too                                               |
| `include.examples`    | `false`                   | copy the example screen too                                             |
| `overwrite`           | `false`                   | replace existing files without asking                                   |
| `packageManager`      | `auto`                    | `auto` reads your lockfile                                              |
| `installDependencies` | `prompt`                  | `auto`, `prompt`, or `never`                                            |
| `registry.origin`     | the public bucket origin  | point this at your own mirror to serve a private registry               |
| `registry.index`      | `index.json`              | key of the file listing                                                 |
| `registry.registry`   | `core/registry.json`      | key of the component metadata                                           |
| `registry.cache`      | `3600`                    | seconds the listings are cached; `false` disables it                    |

`reacticx config` prints the whole thing with the defaults filled in, and exits
non-zero if anything is invalid. `reacticx config --clear-cache` drops the
cached listings.

### Structures

```
category   outDir/molecules/accordion/index.tsx
flat       outDir/accordion/index.tsx
mirror     outDir/blocks/bottom-sheet/airbnb-v1/index.tsx
```

### Aliases

Copied files are written against your aliases, not the library's:

```diff
- import { SquircleView } from "@/components/base/squircle-view";
+ import { SquircleView } from "@/shared/components/base/squircle-view";
```

Set an alias to `""` and the same import comes out relative instead, so a
project with no path mapping still compiles.

## Development

```bash
bun install
bun run check          # typecheck, build, then the smoke tests
bun run dev            # rebuild on save
bun run link           # put `reacticx` on your PATH, pointing at dist/
```

| Script                | What it does                                    |
| --------------------- | ----------------------------------------------- |
| `bun run build`       | bundle to `dist/`                                |
| `bun run dev`         | rebuild on save                                  |
| `bun run typecheck`   | `tsc --noEmit`                                   |
| `bun run test`        | smoke tests against the real registry            |
| `bun run test:verbose`| the same, printing every command's output        |
| `bun run check`       | typecheck + build + test                         |
| `bun run format`      | prettier over `src/` and `test/`                 |
| `bun run clean`       | remove `dist/`                                   |
| `bun run link`        | link `reacticx` into your PATH                   |
| `bun run unlink`      | undo it                                          |

`test/smoke.mjs` drives the built CLI in a throwaway project per test — config
resolution and merging, every structure, alias rewriting, dependency
pull-through and dedup, nested folders, binary integrity, error paths, and box
geometry at several terminal widths. It hits the live bucket, so it needs a
network connection. Run a subset by name:

```bash
bun run test alias
bun run test diff remove
```

## Layout

```
src/
├─ index.ts        command wiring
├─ commands/       one file per command
├─ core/           config, registry client, collection, rewriting, deps
├─ ui/             the output style — gutter, spinner, prompts
└─ typings/        every shared type
```

MIT.
