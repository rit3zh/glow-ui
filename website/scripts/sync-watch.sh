#!/bin/bash
# Watches BOTH the component source tree and the website RN folders, and keeps
# Cloudflare R2 in sync as you edit.
#
# Two watchers run together:
#   1. src/components/** + examples/**  --(sync-website.ts --changed)-->  website/react-native*
#   2. website/react-native{,-usage,-types}/**  --(sync-r2.sh)-->  R2 bucket
#
# So a source edit flows: src -> flattened into website/react-native* -> uploaded.
# A direct edit to a website/react-native* file is uploaded as well.
# A given file results in a single upload (watcher 1 only writes, watcher 2 uploads).
#
# Usage:
#   ./scripts/sync-watch.sh        (or: bun run sync-r2:watch:all)
# Ctrl+C stops both watchers.

set -uo pipefail

WEBSITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ROOT_DIR="$(cd "$WEBSITE_DIR/.." && pwd)"
CHOKIDAR="$WEBSITE_DIR/node_modules/.bin/chokidar"

if [ ! -x "$CHOKIDAR" ]; then
  echo "chokidar not found at $CHOKIDAR — run 'bun install' in website/ first." >&2
  exit 1
fi

echo "Watching for changes (Ctrl+C to stop):"
echo "  src/components/**, examples/**  -> sync into website/react-native* -> R2"
echo "  website/react-native{,-usage,-types}/**  -> R2 directly"
echo

pids=()
cleanup() {
  trap - INT TERM EXIT
  kill "${pids[@]}" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# Watcher 1: component source -> website/react-native* (flatten, changed-only).
# Runs from the repo root so sync-website.ts resolves paths the usual way.
(
  cd "$ROOT_DIR" && exec "$CHOKIDAR" \
    'src/components/**/*.ts' \
    'src/components/**/*.tsx' \
    'examples/**/*.tsx' \
    --event add --event change \
    -c 'bun scripts/sync-website.ts --changed'
) &
pids+=($!)

# Watcher 2: website RN folders -> R2 (this is the existing sync-r2:watch).
(
  cd "$WEBSITE_DIR" && exec "$CHOKIDAR" \
    'react-native/**' \
    'react-native-usage/**' \
    'react-native-types/**' \
    --event add --event change \
    -c './scripts/sync-r2.sh {path}'
) &
pids+=($!)

wait
