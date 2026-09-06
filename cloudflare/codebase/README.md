# Codebase sync

Mirrors the library source into the R2 bucket `reacticx-codebase`, so a consumer
(the CLI, the website, a registry) can fetch any file by key.

Public origin: <https://pub-028ac77ff44d4123aed5b9b6592ec08d.r2.dev>

| bucket folder                        | local source                            |
| ------------------------------------ | --------------------------------------- |
| `core/`                              | `src/components`                        |
| `examples/`                          | `app/components`                        |
| `helpers/create-compound-component/` | `src/utils/create-compound-component`   |
| `shared/`                            | `src/helpers`                           |

Paths are mirrored verbatim: `src/components/base/button/index.tsx` becomes
`core/base/button/index.tsx`.

```
cloudflare/codebase/
├─ index.ts        the CLI
├─ config.ts       bucket, the three folders, ignores, content types
├─ manifest.json   ledger of what has been uploaded (committed)
└─ lib/
   ├─ files.ts     directory walk + hashing
   ├─ manifest.ts  read/write the ledger
   └─ r2.ts        wrangler and direct-S3 backends
```

## Usage

```bash
bun run codebase:sync          # upload new/changed files
bun run codebase:sync:dry      # show the plan, change nothing
bun run codebase:check         # exit 1 if anything is out of sync (CI)
bun run codebase:prune         # also delete objects with no local file
bun run codebase:verify        # HEAD every object, re-upload anything missing

bun cloudflare/codebase/index.ts --force            # re-upload everything
bun cloudflare/codebase/index.ts --only core        # one folder
bun cloudflare/codebase/index.ts --only core,helpers
bun cloudflare/codebase/index.ts --help
```

## How duplicates are avoided

`wrangler` has no `r2 object list`, so `manifest.json` is the record: it stores
the sha256 of every uploaded file, and a file is only sent when it is **new** or
its **hash changed**. Keep it committed.

That ledger is local, so it can drift — a wiped bucket, a failed run on another
machine, an object deleted by hand. `--verify` settles it: a `HEAD` against the
public origin for every file the manifest calls unchanged, and anything missing
gets queued for upload. It needs no credentials and takes a couple of seconds for
the whole bucket, so it is worth running in CI. `--force` is the bigger hammer —
it re-uploads everything and rebuilds the ledger from scratch.

Files removed locally stay in the bucket until you pass `--prune`; a normal run
just warns about them.

## `index.json`

Since the bucket cannot be listed, every full sync uploads an `index.json` at the
root describing all objects:

```json
{
  "bucket": "reacticx-codebase",
  "generatedAt": "…",
  "total": 585,
  "folders": {
    "core": {
      "prefix": "core",
      "source": "src/components",
      "files": [{ "path": "base/button/index.tsx", "key": "core/base/button/index.tsx", "size": 7134, "hash": "…", "contentType": "text/plain; charset=utf-8" }]
    },
    "examples": { … },
    "helpers": { … }
  }
}
```

An `--only` run leaves `index.json` alone, so a scoped sync can never publish a
listing that is missing the folders it did not look at.

## Backends

**wrangler** (default) — uses whatever `wrangler login` you already have. Every
upload is a process spawn (~3s), so a from-scratch sync of ~600 files takes a few
minutes. Incremental runs are instant.

**Direct S3** — set all three and the CLI switches automatically:

```bash
export R2_ACCOUNT_ID=…
export R2_ACCESS_KEY_ID=…
export R2_SECRET_ACCESS_KEY=…
```

Create the key pair in the Cloudflare dashboard under R2 → API → *Manage API
tokens*, scoped to `reacticx-codebase` with Object Read & Write. This path signs
requests itself (SigV4) and uploads 32 at a time, turning a full sync into
seconds. Force either backend with `--s3` or `--wrangler`.

## What is skipped

Dotfiles, `.DS_Store`, `node_modules`, `__tests__`, `__snapshots__`, empty files,
and anything over 5 MB. All of that lives in `config.ts` — `ignoreNames`,
`maxFileSize`, and `contentTypes`.

Code is served as `text/plain; charset=utf-8` so it renders in a browser rather
than downloading.

## Adding a folder

Add an entry to `sources` in `config.ts` with an `id`, `dir`, and `prefix`, and
add the id to the `SourceId` union. Nothing else needs to change.
