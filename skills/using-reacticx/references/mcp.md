# Reacticx MCP server

`@reacticx/mcp` puts the registry behind Model Context Protocol tools, so an
agent can browse, read and copy components without shelling out to the CLI and
parsing its output. Same registry, same config file, same import rewriting.

```bash
npx @reacticx/mcp
```

It speaks MCP over stdio, so a client launches it — running it by hand only shows
a readiness line on stderr.

## Setup

Claude Code:

```bash
claude mcp add reacticx -- npx -y @reacticx/mcp
```

Any client with an `mcp.json` / `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "reacticx": {
      "command": "npx",
      "args": ["-y", "@reacticx/mcp"]
    }
  }
}
```

The project the write tools act on is the directory the server starts in. Pin it
with `--root`, or pass `projectRoot` on individual calls when one client spans
several projects.

| Flag | Effect |
|---|---|
| `--root <path>` | project the write tools act on (default: cwd) |
| `--read-only` | expose the registry, refuse every write |
| `--registry <origin>` | registry origin, overriding the project config |
| `--cache <seconds>` | registry cache TTL |
| `--no-cache` | always refetch the registry |

`REACTICX_MCP_ROOT`, `REACTICX_MCP_READ_ONLY=1` and `REACTICX_MCP_REGISTRY` set
the same three things through the environment.

## Tools

### Orientation

| Tool | Returns |
|---|---|
| `get_usage_guide` | the whole Reacticx workflow, including the dependency rules. Read it once per session before the first add |
| `get_config` | the resolved config for a project, whether a `component.config.json` exists, and the registry version |
| `refresh_registry` | drops the cache and refetches — the fix when a newly published component is missing |

### Discovery

| Tool | Arguments | Returns |
|---|---|---|
| `list_components` | `category?`, `search?` | component names grouped by category, plus registry totals |
| `get_component` | `name` | category, file list with sizes, whether types/example exist, whether it is installed here and where |
| `get_component_source` | `name`, `file?` | full source, fenced per file. Registry `@/` imports intact — `add_components` rewrites them |
| `get_component_types` | `name` | the published prop types. **The reliable answer to "what props does this take"** |
| `get_component_example` | `name` | the example screen — the fastest read on how the props fit together |

### Project state

| Tool | Arguments | Returns |
|---|---|---|
| `list_installed_components` | — | which registry components already exist in the project, and where |
| `diff_components` | `name?` | installed files that are modified or missing versus the registry, with rewriting replayed so alias changes are not false positives |

### Writes

| Tool | Arguments | Notes |
|---|---|---|
| `init_config` | `outDir?`, `structure?`, `componentsAlias?`, `typescript?`, `installDependencies?`, `packageManager?`, `force?` | writes `component.config.json`; refuses to clobber without `force: true` |
| `add_components` | `components[]`, `dir?`, `includeTypes?`, `includeExamples?`, `followDependencies?`, `overwrite?`, `dryRun?` | copies components in and rewrites imports |

Every tool also takes `projectRoot` to target a project other than the server's root.

## `add_components` in detail

The response is JSON with a `status` of `written`, `dry-run` or `blocked`:

- `blocked` means files already exist — nothing was written. Call again with
  `overwrite: true`, after checking `diff_components` if the files may have been
  edited.
- `groups` shows what came from where, including components pulled in as
  dependencies and the reason each was added.
- `missingPackages` and `installCommand` list npm packages the copied source
  imports that the project does not have. **The server never installs them** —
  surface the command and let the human run it.
- `unresolvedImports` lists `@/` imports the registry cannot supply. Those need
  hand-written modules.
- `notes` carries situational warnings, such as a missing config file or the
  native-rebuild reminder.

## Safety posture

- Writes are confined to the project root; a `dir` that escapes it is refused.
- Existing files are never overwritten without an explicit `overwrite: true`.
- Nothing is installed and no shell command is ever run.
- Downloads are checksummed against the registry index.
- `--read-only` leaves the whole catalog browsable while refusing every write —
  the right default for a shared or untrusted client.

## Resources

| URI | Content |
|---|---|
| `reacticx://registry` | the whole catalog as JSON |
| `reacticx://component/{name}` | one component's source as Markdown |

Resources suit clients that let a human attach context by hand; the tools suit an
agent working through a task.

## Recommended order for an agent

1. `get_usage_guide` — once per session.
2. `get_config` → `init_config` if there is no config file.
3. `list_components` → `get_component` / `get_component_types` / `get_component_example`.
4. `list_installed_components` — do not add what is already there.
5. `add_components` with `dryRun: true` when the destination matters, then for real.
6. Report `installCommand` to the human, and remind them to rebuild the native
   target if anything native landed.
