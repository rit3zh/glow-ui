---
name: using-reacticx
description: Use when adding Reacticx components to a React Native or Expo project, when asked about "reacticx" or "reactctx" components, when wiring up the Reacticx CLI or its MCP server, or when integrating animated UI primitives from the Reacticx registry.
---

# Using Reacticx

## Overview

[Reacticx](https://reacticx.com) is a copy-paste component library for React
Native and Expo: 163 animated, gesture-driven components that are **copied into
the project as source**. There is no runtime package to install and nothing to
import from `node_modules` — once a component lands it is ordinary project code,
free to edit.

Two front doors onto the same registry:

| | Use when |
|---|---|
| **CLI** — `npx reacticx <command>` | a human is at a terminal, or a one-off add |
| **MCP server** — `@reacticx/mcp` | an agent is doing the work and wants structured results |

Both read the same registry, write to the same `outDir`, and rewrite imports the
same way. Pick whichever the surrounding session already has; do not mix them
mid-task without re-checking state with `reacticx diff` / `diff_components`.

## Before adding anything

1. **Know where files will land.** `npx reacticx config` (or the `get_config`
   tool) prints the resolved configuration with every default filled in. If the
   project has no `component.config.json`, defaults apply — `src/shared/components`,
   category structure, `@/shared/components` alias — which is rarely what an
   existing project wants. Run `reacticx init` / `init_config` first.
2. **Check it is not already there.** `reacticx list` shows the registry;
   `list_installed_components` (MCP) or a look inside `outDir` shows what the
   project already has. Re-adding silently discards local edits when `--overwrite`
   is passed.
3. **Read the component before wiring it up.** `reacticx info <name>` for the
   shape, `get_component_types` for the real prop types, `get_component_example`
   for a working call site. Guessing at props is the main source of wasted turns.

## Adding a component

```bash
npx reacticx add accordion                      # into the configured outDir
npx reacticx add accordion --dir src/components/ui   # somewhere else, once
npx reacticx add accordion --types --examples   # bring types and the demo screen
npx reacticx add accordion --dry                # show the plan, write nothing
npx reacticx add accordion --overwrite          # take the registry version
```

Use `bunx`, `npx`, or `pnpm dlx` to match the project's package manager.

What `add` does beyond copying files:

- **Rewrites imports.** Registry source imports `@/components/...`, `@/utils/...`
  and `@/helpers/...`. Those are rewritten to the project's own aliases from
  `component.config.json`, falling back to relative paths when no alias fits.
- **Follows dependencies.** A component that imports another registry component,
  or a shared helper, pulls it in too. `--no-deps` turns that off, and then the
  copied files will not compile until you supply those modules yourself.
- **Refuses to clobber.** Existing files are left alone unless `--overwrite`.
- **Verifies checksums** on every download.
- **Reports missing npm packages** and offers to install them. The MCP server
  reports them but never installs — run the command it hands back.

## After adding

1. Install any missing packages. Prefer `npx expo install <package>` over a bare
   `npm install` so versions match the project's Expo SDK.
2. **Rebuild the native target** if anything native landed (`npx expo run:ios`,
   `npx expo run:android`). A Metro restart is not enough, and this is the single
   most common reason a freshly added component crashes on launch.
3. Import from the configured alias, e.g. `import { Accordion } from "@/components/ui/molecules/accordion"`.
4. Type-check and lint. The copied source is now project code and is held to the
   project's own standards.

## Dependency facts worth knowing

- Nearly everything animates with `react-native-reanimated`; 40 components also
  need `react-native-worklets`, which is a **separate install** since Reanimated 4
  moved worklets into its own package.
- Skia is `@shopify/react-native-skia` — 45 components use it.
- Blur is `@sbaiahmed1/react-native-blur`, a **scoped npm package**. Do not
  install the unscoped `react-native-blur`; it is a different library.
- Icons come from `@expo/vector-icons`, `expo-symbols` or `@hugeicons/react-native`
  depending on the component.

`references/components.md` lists the exact dependency set per component.

## Common mistakes

- Adding a component before running `init`, so it lands in `src/shared/components`
  under an alias the project does not have.
- Skipping the native rebuild after a native dependency lands.
- Re-adding with `--overwrite` over a locally edited component. Run
  `reacticx diff <name>` first — it shows exactly what would be lost.
- Passing `--no-deps` and then wondering why the imports do not resolve.
- Installing the unscoped `react-native-blur`.
- Assuming a component exists because a similar name does. `reacticx list -s <term>`
  before you write the import; the CLI suggests near-misses on a typo.

## References

| File | What is in it |
|---|---|
| `references/components.md` | every component: CLI key, description, files, exact dependencies, docs URL. Generated from the registry, the site content and the component sources by `scripts/skills/generate-catalog.ts` |
| `references/cli.md` | every CLI command and flag, with the behaviour behind each one |
| `references/mcp.md` | the MCP server: setup, all 12 tools, resources, and the agent workflow |
| `references/configuration.md` | every `component.config.json` key, what it changes, and how paths resolve |
