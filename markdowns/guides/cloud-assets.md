# Cloud assets

Every recording, still and source file this library ships lives in Cloudflare R2, not in git.
One command puts it there, one command brings it back.

```bash
bun run cloud          # push everything that changed
bun run cloud status   # what is out of sync — changes nothing
bun run cloud pull     # restore the media folders on a fresh clone
bun run cloud doctor   # check tools, credentials and connectivity
```

---

## Why the media is not in git

The recordings are the heaviest thing the project produces — roughly **230 MB** across the
landing clips and the two preview encodings — and they are rewritten every time a component
is re-recorded. Committing them meant every clone carried every version of every clip ever
made, forever.

So the buckets hold the media and git holds the **ledgers** that describe it:

| Committed                        | What it is                                                   |
| -------------------------------- | ------------------------------------------------------------ |
| `cloudflare/sync/manifest.json`  | every landing asset: object key, path on disk, sha256, size  |
| `cloudflare/previews/manifest.json` | the same, for both preview encodings                      |
| `cloudflare/codebase/manifest.json` | every source file mirrored into the codebase bucket        |

The ledgers are the reason this is safe. They name every object well enough to rebuild the
folders byte for byte, which is exactly what `cloud pull` does.

These three folders are gitignored:

```
cloudflare/landing-assets/     # hover clips and stills for the site
cloudflare/v2-preview/         # QuickTime masters, alpha channel intact
cloudflare/v2-preview-webm/    # VP9 + alpha copies, built from the masters
```

---

## The pipeline

`bun run cloud` runs six steps, in this order, stopping at the first failure so a
half-finished upload is never followed by a registry claiming it worked.

| Step       | What it does                                                          |
| ---------- | --------------------------------------------------------------------- |
| `encode`   | builds the WebM half of every preview (needs ffmpeg — skipped without) |
| `assets`   | landing clips & stills → `reacticx-landing-assets`                     |
| `previews` | transparent page previews → `reacticx-v2-previews`                     |
| `codebase` | component source & generated types → `reacticx-codebase`               |
| `registry` | regenerates `registry.json` from `src/components`                      |
| `scaffold` | writes docs pages for components that have none                        |
| `docs`     | regenerates the sidebar and the website's typed registry               |

Order matters. Encoding comes first because the preview sync uploads what it produces; the
media syncs come before the registries because the generated TypeScript they write is what
the website reads its clip URLs out of.

Every step is a focused CLI in its own right and can be run alone:

```bash
bun run cloud --only assets,previews
bun run cloud --skip encode
bun run assets:sync --dry            # the same step, directly
```

### Flags

| Flag           | Effect                                                        |
| -------------- | ------------------------------------------------------------- |
| `--dry`, `-n`  | print each step's plan, change nothing                        |
| `--check`      | exit 1 when anything is out of sync — for CI                  |
| `--force`      | re-upload and re-encode everything, ignoring the ledgers      |
| `--prune`      | delete bucket objects whose local file is gone                |
| `--verify`     | HEAD every unchanged object, so a missing one is re-uploaded  |
| `--only <ids>` | run only these steps                                          |
| `--skip <ids>` | run everything except these                                   |
| `--keep-going` | do not stop at the first failing step                         |
| `--s3`/`--wrangler` | force an upload backend                                  |

---

## Nothing uploads twice

Each media sync decides per file:

1. **The ledger** — same sha256 means the bytes have not changed since the last upload.
2. **A remote HEAD** — free, credential-less, against the bucket's public origin. This is
   what heals a run when the ledger and the bucket disagree: a wiped bucket, an object
   deleted by hand, a run that died halfway.

A file that is in the bucket but not yet in the ledger is **adopted** rather than re-sent —
which is what makes the first run after a fresh clone cost a few hundred HEAD requests
instead of 120 MB of video.

An object whose local file is gone moves to the ledger's `orphaned` section. It stays in the
bucket, is reported every run, and `--prune` is what actually deletes it. Keeping it there
rather than dropping the row is deliberate: nothing else can list a private bucket, so an
entry silently removed would leave an object nobody could find again.

---

## Credentials

`wrangler login` is enough — that is the default path, and `pull` needs nothing at all.

For uploads that take seconds rather than minutes, put R2 API credentials in a `.env` at the
repo root. Every tool here reads it:

```bash
R2_ACCOUNT_ID=…
R2_ACCESS_KEY_ID=…
R2_SECRET_ACCESS_KEY=…
```

With those present the syncs use signed S3 requests (32 at a time) instead of spawning
wrangler once per file. `bun run cloud doctor` tells you which path you are on.

---

## On a fresh clone

```bash
bun install
bun run cloud pull     # 352 files, no credentials needed
```

`pull` reads the committed ledgers, downloads through the buckets' public origins, and
verifies the sha256 of every file it writes. A hash that does not match the ledger is an
error, not a silent overwrite — it means the object was replaced out of band.

---

## Adding an asset

1. Drop the file into `cloudflare/landing-assets/`, named `<component>-landing-asset.<ext>`.
   Video or still, both work — `.mp4` `.webm` `.mov` `.png` `.jpg` `.webp` `.avif` `.gif`.
2. Drop a preview master into `cloudflare/v2-preview/` if the component has one.
3. `bun run cloud`

Dimensions are read straight out of the file headers — PNG, JPEG, GIF, WebP and the ISO
container formats — so the gallery's justified row layout is settled at build time whether
or not ffmpeg is installed. ffprobe is only the fallback for a format the reader does not
know.

If two files reduce to the same component name (a clip later replaced by a still, say),
both still upload — the object key is the file name, so nothing collides in the bucket — and
the **newest** one is the one the site uses. The CLI names the file that lost, every run.

---

## Catalogues and the website

A component's folder under `src/components` decides which catalogue page it browses on. No
front matter to remember, no second place to update: moving the folder is the whole change.

| Folder                    | Catalogue      | Page                  |
| ------------------------- | -------------- | --------------------- |
| `src/components/charts/`     | Charts      | `/charts`             |
| `src/components/primitives/` | Primitives  | `/primitives`         |
| `src/components/pieces/`     | Pieces      | `/pieces-preview`     |
| everything else              | Components  | `/components-preview` |

`charts/` and `primitives/` are also docs sections in their own right, so the folder decides
the `category:` front matter too — the `docs` step writes it back into the `.mdx` rather than
reporting a conflict nobody would want resolved the other way.

The nav menu, the counts in it, and the hero's component count are all read off
`website/src/lib/components.generated.ts`. Adding a folder and running `bun run cloud` is
enough to make a new catalogue appear in the menu.

---

## Buckets

| Bucket                      | Holds                                    | Public origin |
| --------------------------- | ---------------------------------------- | ------------- |
| `reacticx-landing-assets`   | hover clips and stills                   | yes           |
| `reacticx-v2-previews`      | transparent page previews, both encodings | yes          |
| `reacticx-codebase`         | component source and generated types      | yes          |

The public origins are what the site reads from at build time, and what `pull` and every
existence check use — no credentials required for any read.
