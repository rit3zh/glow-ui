# Adding a Component

Everything that has to happen between writing a component and it appearing on the
docs site, in order.

Most of it is scripted. The parts worth reading carefully are the two video
clips — they are the only step with a way to get it silently wrong.

---

## Overview

```
src/components/<group>/<name>/     the component
        │  sync:components
        ▼
app/components/<name>/index.tsx    the demo screen
        │
        ├──► generate-registry     registry.json, for `npx reacticx add`
        ├──► codebase:sync         core/ examples/ types/ → codebase bucket
        ├──► previews:sync         the transparent preview → previews bucket
        ├──► assets:sync           the hover clip → landing-assets bucket
        ▼
website/content/components/<name>.mdx
        │  components:sync
        └──► meta.json + components.generated.ts
```

---

## 1. Write the component

```
src/components/<group>/<name>/
  index.tsx
  types.ts
```

`<group>` is one of `atoms`, `base`, `charts`, `micro-interactions`,
`molecules`, `organisms` — see [categories.md](./categories.md).

`types.ts` is not optional if the component takes props: it is the file that
becomes the props table on the docs page. The name is flexible
(`types.ts`, `types/index.ts`, `<Pascal>.types.ts`, `<Pascal>.props.ts`), and
`types.ts` is the one to reach for.

Components under `screens/` and `templates/` are deliberately skipped by the
types pipeline, since they are compositions rather than props-driven building
blocks. The exception is one that gets its own docs page — that pulls it back in
automatically.

## 2. Scaffold the demo screen

```bash
bun run sync:components:once
```

Writes `app/components/<name>/index.tsx`, adds the `<Stack.Screen>` entry to
`app/_layout.tsx`, and regenerates `app/components/routes.generated.ts`. It never
overwrites a screen that already exists.

Then fill that screen in — it is what the docs show under **Usage**, so make it
the example you would want to read.

Leave `bun run sync:components` running in watch mode while you work if you
prefer.

## 3. Regenerate the CLI registry

```bash
bun run generate-registry
```

Writes `registry.json` and `src/components/registry.json`, which is what
`npx reacticx add <name>` reads.

---

## 4. Record the two clips

Two different clips, two different buckets, two different jobs.

| file | encoding | shown as |
| --- | --- | --- |
| `cloudflare/v2-preview/<name>-preview.mov` | QuickTime, HEVC **with alpha**, 1080×1080 | the large preview on the page |
| `cloudflare/landing-assets/<name>-landing-asset.mp4` | ordinary opaque MP4 | the loop on a card hover |

**The preview has to keep its alpha.** The docs float the component directly on
the page background, so a recording without transparency shows up as a black
rectangle. Record it transparent and hand over the QuickTime file untouched —
do not "convert it to MP4" first. That re-encode is what flattens the alpha onto
black, and it is why every preview in the bucket once had a black box behind it.

Check a clip before moving on:

```bash
ffmpeg -i cloudflare/v2-preview/<name>-preview.mov \
  -vf "alphaextract,scale=8:8" -vframes 1 -f rawvideo -pix_fmt gray - | xxd
```

Varying bytes means real alpha. `Requested planes not available` means the file
is opaque and needs re-recording.

## 5. Push the media

```bash
bun run previews:encode    # .mov → VP9+alpha .webm (skips ones already built)
bun run previews:sync      # uploads <name>-preview.mp4 and .webm
bun run assets:sync        # uploads the hover clip, regenerates landing-assets.generated.ts
```

`previews:sync` uploads the QuickTime master **byte for byte** under an `.mp4`
key. That is not a conversion — see [Why two encodings](#why-two-encodings)
below.

## 6. Push the source

```bash
bun run codebase:sync
```

Mirrors `src/components` → `core/`, `app/components` → `examples/`, and builds
`types/<name>/index.ts` from whatever the component names its type file. The
docs read all three from the bucket at build time, so this is what makes the
source panel, the file tree and the props table show the new component.

---

## 7. Write the docs page

```bash
cd website
bun run components:scaffold
```

Writes `content/components/<name>.mdx` from the source itself — dependency list
from the component's imports, props table from its types file. It never touches
a page that already exists, so rerunning only fills gaps.

Then edit two lines of front matter by hand:

```yaml
category: components
previewVideo: https://pub-364cfe31d5bf415e989f772c3ea4bbaf.r2.dev/<name>-preview.mp4
```

- `category` decides the sidebar section: `shaders`, `texts`,
  `micro-interactions` or `components`.
- `previewVideo` keeps the **`.mp4`** extension. The object is QuickTime, and the
  extension is load-bearing — again, see below.

`hoverVideo` needs no editing. It is derived from the landing-assets bucket, so
it appears on its own once `assets:sync` has run.

```bash
bun run components:sync
```

Regenerates `content/components/meta.json` (the sidebar) and
`src/lib/components.generated.ts` (the typed registry). Both derive from the same
sorted list, so they cannot disagree.

---

## Verify

```bash
bun run codebase:check                    # is the codebase bucket in sync?
cd website && bun run components:check    # are meta.json / the registry stale?
bun run dev                               # then open /components/<name>
```

On the page, the preview should sit on the page background with no black
rectangle behind it. If there is one, the clip lost its alpha at step 4.

---

## Why two encodings

No single video format is transparent in every browser, and each engine plays
the other's file *opaque* rather than refusing it — so a black box is the failure
mode, not a broken video.

| source | Safari | Chrome / Firefox / Zen |
| --- | --- | --- |
| `.mp4`, QuickTime bytes, `type='video/mp4; codecs="hvc1"'` | transparent | refuses the codec, falls through |
| `.webm`, VP9 + alpha, `type="video/webm"` | plays opaque | transparent |

So the page lists both, HEVC first. Three details make it work, and each one
fails silently if changed:

- **The `.mp4` is QuickTime, renamed, not remuxed.** Apple signals the alpha
  layer with QuickTime-specific atoms; remuxing into a real MP4 with `-c copy`
  drops them and the alpha decodes to zero.
- **It is served as `video/mp4`, not `video/quicktime`.** Gecko *accepts*
  quicktime, decodes the HEVC with no alpha path, and paints black.
- **`codecs="hvc1"` is required in the `type` attribute.** It is what makes Gecko
  refuse the file outright and reach the WebM below. Ordering alone does not
  work, because a source it can decode is a source it will use.

The WebM side has its own two traps, both handled in
`cloudflare/previews/encode.ts`:

- The alpha plane must be split out and merged back explicitly. ffmpeg
  negotiates the filter graph from the stream header, which reports `yuv420p`
  even though the decoder does return alpha — so a plain transcode drops it.
- `-auto-alt-ref 0` is required. libvpx discards the alpha plane when alt-ref
  frames are on, which is the default.

When checking a WebM, decode it with `-c:v libvpx-vp9`. ffmpeg's own native VP9
decoder does not expose alpha and will report a false negative on a file that is
perfectly fine.

---

## Command reference

Run from the repo root unless noted.

| command | does |
| --- | --- |
| `bun run sync:components` | watch `src/components`, scaffold demo screens, sync routes |
| `bun run sync:components:once` | the same, one pass |
| `bun run generate-registry` | `registry.json` for the CLI |
| `bun run previews:encode` | `.mov` → VP9+alpha `.webm` (`--force` to rebuild) |
| `bun run previews:sync` | previews bucket (`--dry` to preview) |
| `bun run assets:sync` | landing-assets bucket |
| `bun run codebase:sync` | `core/` `examples/` `types/` `helpers/` |
| `bun run codebase:check` | exit 1 if the bucket is stale |
| `bun run codebase:prune` | delete objects whose local file is gone |
| `website$ bun run components:scaffold` | write pages for components that have none |
| `website$ bun run components:sync` | sidebar + typed registry |
| `website$ bun run components:check` | exit 1 if those outputs are stale |
| `website$ bun run components:prune` | delete pages whose component is gone |

---

## Related

- [categories.md](./categories.md) — what each group under `src/components/` is for
- [component-structure.md](./component-structure.md) — how a component folder is laid out
- [compound-components.md](./compound-components.md) — the `createCompoundComponent` helper
- [working-with-reacticx.md](./working-with-reacticx.md) — project layout and automation
