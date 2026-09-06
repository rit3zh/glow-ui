# @reacticx/mcp

Model Context Protocol server for [Reacticx](https://www.reacticx.com/) — the
copy-paste component library for React Native and Expo.

It gives an AI coding agent the same registry the `reacticx` CLI uses: browse the
catalog, read a component's source, types and example, and copy components into a
project with imports rewritten for that project's aliases.

```bash
npx @reacticx/mcp
```

The server speaks MCP over stdio, so it is normally launched by a client rather
than by hand.

## Setup

Claude Code:

```bash
claude mcp add reacticx -- npx -y @reacticx/mcp
```

Any client that reads an `mcp.json` / `claude_desktop_config.json`:

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
explicitly with `--root`, or pass `projectRoot` on individual tool calls.

## Options

| Flag | What it does |
|------|--------------|
| `--root <path>` | project the write tools act on (default: cwd) |
| `--read-only` | expose the registry, refuse every write |
| `--registry <origin>` | registry origin, overriding the project config |
| `--cache <seconds>` | registry cache TTL |
| `--no-cache` | always refetch the registry |
| `-v, --version` | print the version |
| `-h, --help` | print help |

`REACTICX_MCP_ROOT`, `REACTICX_MCP_READ_ONLY=1` and `REACTICX_MCP_REGISTRY` set
the same three things through the environment, for clients that only pass env.

## Tools

| Tool | What it does |
|------|--------------|
| `get_usage_guide` | the Reacticx workflow, including the dependency rules that trip people up |
| `list_components` | the catalog, filtered by category or name |
| `get_component` | one component's metadata, and whether it is installed here |
| `get_component_source` | the full source of a component's files |
| `get_component_types` | the published prop types |
| `get_component_example` | the example screen |
| `get_config` | the resolved config, every default filled in |
| `init_config` | write `component.config.json` |
| `list_installed_components` | which registry components already exist in the project |
| `add_components` | copy components in, rewriting imports (`dryRun` supported) |
| `diff_components` | which installed files drift from the registry |
| `refresh_registry` | drop the cached registry and refetch |

Resources: `reacticx://registry` for the whole catalog as JSON, and
`reacticx://component/{name}` for one component's source as Markdown.

## Behaviour worth knowing

- **Nothing is installed for you.** `add_components` reports missing npm packages
  and the exact install command; running it stays a human decision. Native
  dependencies still need a rebuild (`npx expo run:ios`), not just a Metro restart.
- **Existing files are never clobbered silently.** An add that would overwrite
  comes back with `status: "blocked"` until you pass `overwrite: true`.
- **Writes stay inside the project root.** A `dir` that escapes it is refused.
- **Downloads are checksummed** against the registry index.
- `--read-only` is the safe posture for shared or untrusted clients: the catalog
  stays browsable, every write tool refuses.

## Development

```bash
bun install
bun run check   # typecheck, build, then a stdio smoke test against the live registry
```

MIT
