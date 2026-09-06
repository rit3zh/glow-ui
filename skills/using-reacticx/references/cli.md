# Reacticx CLI reference

```bash
npx reacticx <command> [options]     # bunx / pnpm dlx work the same
npx reacticx                          # no command: prints the landing help
npx reacticx <command> --help         # flags for one command
```

The CLI acts on the **current working directory**. There is no `--cwd`; `cd` to
the project first.

---

## `init` — write `component.config.json`

```bash
npx reacticx init            # interactive
npx reacticx init -y         # accept every default, ask nothing
npx reacticx init -f         # replace an existing config
npx reacticx init -d src/components/ui
```

| Flag | Effect |
|---|---|
| `-y, --yes` | take the defaults, no prompts |
| `-f, --force` | overwrite an existing `component.config.json` |
| `-d, --dir <path>` | set `outDir` without being asked |

Interactively it offers the three `structure` modes (`category`, `flat`,
`mirror`), and it reads `tsconfig.json` / `jsconfig.json` `compilerOptions.paths`
to suggest an import alias that already works in the project. Only values that
differ from the defaults are written, so the file stays short.

Run this **before** the first `add`. Without it, defaults apply and components
land in `src/shared/components` under the `@/shared/components` alias.

---

## `add` — copy components in

```bash
npx reacticx add accordion
npx reacticx add accordion pressable toast     # several at once
npx reacticx add                                # interactive multi-select
```

| Flag | Effect |
|---|---|
| `-o, --overwrite` | replace files that already exist |
| `-d, --dir <path>` | write here instead of the configured `outDir`, this run only |
| `-t, --types` | also copy the component's published types into `paths.types` |
| `-e, --examples` | also copy the example screen into `paths.examples` |
| `--no-deps` | do not follow imports into other components or shared helpers |
| `--no-install` | never install missing npm packages |
| `--dry` | print the plan, write nothing |
| `-y, --yes` | no prompts; safe defaults (never overwrites, never installs) |

Behaviour:

- **Import rewriting.** `@/components/…`, `@/utils/…` and `@/helpers/…` in the
  registry source become the project's aliases from `component.config.json`. When
  no alias fits, a relative path is written instead — the result compiles either way.
- **Dependency following.** Registry components and shared helpers that the files
  import are copied too, each reported with the component that pulled it in.
  `--no-deps` disables this and leaves the imports dangling.
- **Conflicts.** Existing files are never overwritten silently. Interactively you
  are asked; with `-y` or `--dry` the run stops and lists them.
- **Checksums.** Every download is verified against the registry index hash.
- **Missing packages.** Imports of packages that are not in `package.json` are
  collected and offered for install with the detected package manager. `--no-install`
  reduces this to a printed command.
- **Unresolved imports.** Anything starting with `@/` that the registry cannot
  supply is listed under "unresolved" — you provide those yourself.

---

## `list` (alias `ls`) — browse the registry

```bash
npx reacticx list
npx reacticx list -c molecules
npx reacticx list -s sheet
npx reacticx list --json
```

| Flag | Effect |
|---|---|
| `-c, --category <name>` | one category only |
| `-s, --search <query>` | filter by name substring |
| `--json` | print the raw registry JSON — the machine-readable form |

Categories: `atoms`, `base`, `blocks`, `charts`, `micro-interactions`,
`molecules`, `organisms`, `pieces`, `primitives`, `screens`, `templates`.

---

## `info` — inspect one component

```bash
npx reacticx info accordion
```

Prints the category, source path, file list with sizes, whether types and an
example exist, and whether the component is already installed in this project. On
a typo it suggests the closest names.

---

## `diff` — check installed components against the registry

```bash
npx reacticx diff              # everything installed
npx reacticx diff accordion    # one component
```

Reports files that were **modified** locally and files that are **missing** from
an installed component. Import rewriting is replayed before comparing, so the
alias changes `add` made are not reported as drift — only genuine edits are.

Run this before `add --overwrite` on anything you may have edited.

---

## `remove` (alias `rm`) — delete an installed component

```bash
npx reacticx remove accordion
npx reacticx rm accordion toast -y
```

| Flag | Effect |
|---|---|
| `-y, --yes` | skip the confirmation |

Deletes the component's directory under `outDir`. It does **not** remove shared
helpers that came along with it, and it does not touch `package.json` — packages
installed for the component stay installed.

---

## `config` — show the resolved configuration

```bash
npx reacticx config
npx reacticx config --json
npx reacticx config --clear-cache
```

| Flag | Effect |
|---|---|
| `--json` | the resolved config as JSON, every default filled in |
| `--clear-cache` | drop the cached registry listings for this origin |

It warns when no `component.config.json` exists, and resolves `packageManager: "auto"`
to the manager it actually detected.

The registry is cached under `~/.cache/reacticx` for `registry.cache` seconds
(default 3600). `--clear-cache` is the fix when a newly published component does
not show up.

---

## `create` — scaffold a new Expo app

```bash
npx reacticx create
npx reacticx create my-app
```

Runs `create-expo-app` with the detected package manager, offering a blank
TypeScript, blank JavaScript, or Expo Router tabs template, then sets Reacticx up
in the new project.

---

## Exit behaviour

Errors print a short message plus a hint and exit non-zero. An unknown command or
component name gets a "did you mean" suggestion rather than a stack trace, so a
typo is cheap to recover from.
