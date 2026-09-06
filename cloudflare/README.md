# Cloudflare

Everything this project stores outside git: the recordings, the stills, and a mirror of the
component source. Three buckets, one CLI.

> Full guide: [`markdowns/guides/cloud-assets.md`](../markdowns/guides/cloud-assets.md)

```bash
bun run cloud            # push whatever changed
bun run cloud status     # report drift, change nothing
bun run cloud pull       # restore the media folders (no credentials needed)
bun run cloud doctor     # check tools, credentials, connectivity
```

## Layout

```
cloudflare/
├─ cli/                     the orchestrator — order, flags, preflight
│  ├─ index.ts              push / pull / status / doctor
│  └─ steps.ts              the pipeline, in dependency order
│
├─ lib/                     shared by every tool here
│  ├─ r2.ts                 S3 + wrangler backends, HEAD, list, download
│  ├─ manifest.ts           the upload ledger (keyed by object key)
│  ├─ dimensions.ts         pixel size, read from file headers
│  └─ env.ts                credentials, incl. a repo-root .env
│
├─ sync/                    landing clips & stills → reacticx-landing-assets
├─ previews/                page previews → reacticx-v2-previews (+ the encoder)
├─ codebase/                component source → reacticx-codebase
├─ pull/                    the restore path, driven by the ledgers
├─ generated/               AUTO-GENERATED asset registry — never edit
│
├─ landing-assets/          gitignored — hover clips and stills
├─ v2-preview/              gitignored — QuickTime masters, alpha intact
└─ v2-preview-webm/         gitignored — VP9 + alpha copies
```

The three media folders are **not in git**. The `manifest.json` next to each sync is, and it
describes every object well enough to rebuild them byte for byte.

## The individual CLIs

Each step of the pipeline is a real CLI with its own `--help`, and can be run alone:

```bash
bun run assets:sync          # landing clips & stills
bun run previews:sync        # page previews, both encodings
bun run previews:encode      # rebuild the WebM copies (needs ffmpeg)
bun run codebase:sync        # component source and generated types
```

All of them take `--dry`, `--check`, `--force`, `--prune` and `--s3` / `--wrangler`.

## Naming

The file name drives everything. Trailing `-landing-page-asset`, `-landing-asset`,
`-landing-page` and `-asset` are stripped to get the component name:

| file                                      | name               |
| ----------------------------------------- | ------------------ |
| `accordion-landing-asset.mp4`             | `accordion`        |
| `bouncy-accordion-landing-page-asset.mp4` | `bouncy-accordion` |
| `avatar-landing-asset.png`                | `avatar`           |

Previews follow the same idea: `<slug>-preview.mov` in `v2-preview/` becomes
`<slug>-preview.mp4` in the bucket, paired with a `.webm` built by the encoder.

## Consuming the generated registry

```ts
import { landingAssets, getLandingAssetURL } from "@/cloudflare/generated/landing-assets";

getLandingAssetURL("accordion");
// https://pub-….r2.dev/accordion-landing-asset.mp4
```

Each entry carries `name`, `title`, `fileName`, `kind`, `contentType`, `bucketKey`,
`bucketURL`, `size`, `hash`, and `width` / `height` / `aspect`. `LandingAssetName` is a
literal union, so a typo is a compile error.

`kind` is `"video"` or `"image"`, so a renderer can branch without sniffing the extension;
`landingVideos` and `landingImages` are pre-filtered.

The same data is written to `website/src/lib/landing-assets.generated.ts` so the Workers
build stays self-contained. The website wraps it in a query API at
`website/src/lib/landing-assets.ts` — import from there, not from the `.generated` file.
