# Working with reacticx

A guide for contributors — how the project is structured, how automation works, and how to add a component.

---

## Directory Layout

```
src/components/         # Source of truth — components live here
  ai/                   # AI-related components
  atoms/                # Atomic/primitive components
  base/                 # Base UI components
  charts/               # Data visualization components
  micro-interactions/   # Small animated interactions
  primitives/           # Plain interface furniture — switches, tabs, lists, dialogs
  molecules/            # Composite components
  organisms/            # Complex organisms
  screens/              # Full-screen layouts
  templates/            # Page templates
  index.ts              # Barrel export for the library
  registry.json         # Auto-generated component registry

app/                    # Expo Router demo app
  _layout.tsx           # Root layout — auto-updated with <Stack.Screen> entries
  components/           # Demo screens, one per component
    <component>/
      index.tsx         # Auto-generated demo screen
    routes.generated.ts # Auto-generated route data

scripts/                # Automation scripts
  sync-components.ts    # Main sync — watch, scan, scaffold, write
  rewatch-components.ts # Teardown + rebuild all demo screens
  sync-website.ts       # Sync components to the docs website
  commit.ts             # Interactive commit helper
  cli/
    generate-registry/  # Generates registry.json

cloudflare/             # Media and source that live in R2, not in git
  cli/                  # `bun run cloud` — push, pull, status, doctor
  sync/ previews/       # The media syncs, and their committed ledgers
  codebase/             # Mirrors src/components into a bucket for the docs
                        # See markdowns/guides/cloud-assets.md

reacticx-cli/           # CLI for adding components to user projects
```

---

## How the Sync System Works

The core automation is `bun sync:components` (`scripts/sync-components.ts`). It does four things on every change:

### 1. Scan

Reads every category folder under `src/components/` and identifies which folders contain real components (looks for `index.tsx`, `index.ts`, `{name}.tsx`, or `{PascalCase}.tsx`).

Components are deduplicated by name and sorted alphabetically.

### 2. Scaffold

For any component that doesn't already have a demo screen in `app/components/<name>/`, creates `app/components/<name>/index.tsx` from a template with proper naming (PascalCase, camelCase, kebab-case, title).

Existing screens are never overwritten — scaffold only fills gaps.

### 3. Layout

Rewrites the auto-managed block in `app/_layout.tsx` (between `@generated:component-routes:start` and `@generated:component-routes:end` markers) with `<Stack.Screen>` entries for every component that has a demo screen.

### 4. Routes data

Writes `app/components/routes.generated.ts` — a typed array of `ComponentRoute` objects used by the demo app to render the component list.

### Flags

| Flag | Effect |
|------|--------|
| `--once` | Single scan then exit (no watch) |
| `--dry` | Print what would change, write nothing |
| `--no-scaffold` | Skip screen creation, only update layout + routes |

---

## Adding a New Component

1. Create your component folder under the appropriate category:
   ```
   src/components/<category>/my-component/
     ├── index.tsx        # Component code
     ├── my-component.tsx # (alternative entrypoint)
   ```
   Replace `<category>` with one of: `ai`, `atoms`, `base`, `charts`, `micro-interactions`, `molecules`, `organisms`, `screens`, `templates`.

2. Export it from `src/components/index.ts`:
   ```ts
   export { MyComponent } from "./<category>/my-component";
   ```

3. Run the sync:
   ```bash
   bun sync:components
   ```
   This will:
   - Detect the new component
   - Create `app/components/my-component/index.tsx` demo screen
   - Add `<Stack.Screen name="components/my-component" />` to `app/_layout.tsx`
   - Update `app/components/routes.generated.ts`
   - Update `src/components/registry.json`

4. Test in the demo app:
   ```bash
   bun start        # Expo Go
   # or
   bun ios          # iOS simulator
   # or
   bun android      # Android emulator
   ```

---

## Key Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `sync-components.ts` | `bun sync:components` | Watch components, scaffold screens, update layout + routes |
| `sync-components.ts --once` | `bun sync:components:once` | Single pass scan (no watch) |
| `rewatch-components.ts` | `bun rewatch:components` | Delete all demo screens and regenerate from scratch |
| `sync-website.ts` | `bun sync` | Copy components to website/ for the docs site |
| `commit.ts` | `bun commit` | Interactive conventional commit helper |
| `generate-registry/index.ts` | `bun generate-registry` | Regenerate registry.json from source |

---

## Files That Change

When you add, rename, or remove a component, the sync touches:

| File | What changes |
|------|-------------|
| `app/components/<name>/index.tsx` | Created for new components, never modified after |
| `app/_layout.tsx` | `<Stack.Screen>` entries added/removed |
| `app/components/routes.generated.ts` | Route list regenerated |
| `src/components/registry.json` | Registry regenerated |

All of these are auto-generated — never edit them by hand. If something is wrong, fix the source component and re-run the sync.

---

## CLI Tool

The `reacticx-cli/` package is a separate CLI for users to add reacticx components to their own projects:

```bash
npx reacticx add button
npx reacticx list
npx reacticx create my-app
```

It's published to npm as `reacticx` and has its own README.

---

## Development Tips

- **Watch mode**: Run `bun sync:components` in a terminal tab — it watches `src/components/` and re-syncs automatically on every change.
- **Dry run**: Use `bun sync:components --once --dry` to see what would change without writing anything.
- **Prettier**: All generated files are automatically formatted — make sure `prettier` is available.
- **Component naming**: Use kebab-case for folder names. The sync automatically derives PascalCase (for exports), camelCase (for variables), and Title Case (for display).
- **Registry**: The `registry.json` and `routes.generated.ts` files are the source of truth for the demo app and the docs site. Run `bun generate-registry` if you need to refresh them independently.
