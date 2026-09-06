# constants

App-wide constants and configuration shared across the project.

| File                    | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `component.config.json` | Reference `reacticx` CLI config — every key, at its default. |

`component.config.json` is the full shape the CLI understands, written out in
full so it doubles as documentation. A real project only needs the keys it wants
to change; everything else falls back to the same defaults shown here.

The `$schema` line points at
[`website/public/schema/component.config.json`](../website/public/schema/component.config.json),
so editors complete and validate the file. Keep the two in step when a key is
added.
