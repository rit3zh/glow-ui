# Reacticx

React Native components you copy into your project. Nothing to install, nothing
to wrap your app in — the source lands in your repo and it's yours from there.

```bash
npx reacticx@latest init
npx reacticx@latest add tray
```

Built on Expo with Reanimated, Skia and Gesture Handler, so everything moves on
the UI thread.

### What's inside

163 components. Shaders and text effects, micro interactions, finished pieces
like tickets and receipts, a handful of charts, the plain primitives every app
needs, and whole screens you can drop in and edit.

Have a browse at [reacticx.com](https://www.reacticx.com).

### The CLI

`init` sets a project up and `add` copies something in. From there, `list` shows
everything, `info` looks closer at one thing, `diff` tells you what changed
upstream, and `remove` takes it back out again.

### For agents

Point your coding agent at the registry and let it install things for you:

```json
{ "mcpServers": { "reacticx": { "command": "npx", "args": ["-y", "@reacticx/mcp"] } } }
```

---

[Docs](https://www.reacticx.com/docs) ·
[Contributing](CONTRIBUTING.md) ·
[Discord](https://discord.gg/wCpFkYpyHA)

MIT © [rit3zh](https://github.com/rit3zh)
