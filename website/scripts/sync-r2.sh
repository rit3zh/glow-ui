#!/bin/bash
# Syncs react-native source files to Cloudflare R2 bucket.
#
# Usage:
#   ./scripts/sync-r2.sh                                    # Upload all folders
#   ./scripts/sync-r2.sh --folder react-native-types         # Upload one folder
#   ./scripts/sync-r2.sh --folder react-native-types react-native-usage  # Upload multiple folders
#   ./scripts/sync-r2.sh react-native/button.tsx             # Upload a single file

set -euo pipefail

BUCKET="reacticx"
ALL_FOLDERS=("react-native" "react-native-usage" "react-native-types")

upload_file() {
  local file="$1"
  echo "  Uploading $file..."
  wrangler r2 object put "$BUCKET/$file" \
    --file "$file" \
    --content-type "text/plain" \
    --remote 2>&1 | grep -q "Upload complete" && echo "  Done: $file" || echo "  FAILED: $file"
}

sync_folder() {
  local folder="$1"
  if [ ! -d "$folder" ]; then
    echo "Folder not found: $folder"
    return 1
  fi

  local count=0
  echo "Syncing $folder/..."
  for file in "$folder"/*; do
    [ -f "$file" ] || continue
    upload_file "$file"
    ((count++))
  done
  echo "  $count files from $folder/"
}

# Parse --folder flag
if [ "${1:-}" = "--folder" ]; then
  shift
  if [ $# -eq 0 ]; then
    echo "Error: --folder requires at least one folder name"
    echo "Available: ${ALL_FOLDERS[*]}"
    exit 1
  fi

  for folder in "$@"; do
    sync_folder "$folder"
  done
  exit 0
fi

# Single file mode
if [ $# -ge 1 ]; then
  for file in "$@"; do
    if [ -f "$file" ]; then
      upload_file "$file"
    else
      echo "File not found: $file"
      exit 1
    fi
  done
  exit 0
fi

# Full sync mode (no args)
uploaded=0
for folder in "${ALL_FOLDERS[@]}"; do
  if [ ! -d "$folder" ]; then
    echo "Skipping $folder (not found)"
    continue
  fi

  echo "Syncing $folder/..."
  for file in "$folder"/*; do
    [ -f "$file" ] || continue
    upload_file "$file"
    ((uploaded++))
  done
done

echo ""
echo "Uploaded $uploaded files to R2 bucket '$BUCKET'."
