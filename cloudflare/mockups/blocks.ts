/**
 * The blocks tree, read as the source of truth for a mockup's category.
 *
 * `src/components/blocks/<category>/<slug>/index.tsx` already says which
 * category a block belongs to, and a screenshot's file name cannot. Deriving it
 * from the tree means a new block plus its screenshot needs no config edit at
 * all — which is the only version of this that stays correct, since a table
 * nobody is forced to update is a table that silently goes stale.
 */
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { blockDirFixes, config, isCategoryId, type CategoryId } from "./config";

export interface Block {
  /** Directory name under the category — usually the mockup slug. */
  dir: string;
  category: CategoryId;
  /** Path to the block's `index.tsx`, relative to the repo root. */
  entry: string;
}

/** Every block in the tree, keyed by directory name. */
export async function readBlocks(): Promise<Map<string, Block>> {
  const blocks = new Map<string, Block>();

  // No blocks tree is not fatal — the mockups still upload, they just fall back
  // to the category table.
  const categories = await readdir(config.blocksDir, { withFileTypes: true }).catch(
    () => [],
  );

  for (const category of categories) {
    if (!category.isDirectory() || !isCategoryId(category.name)) continue;

    const entries = await readdir(join(config.blocksDir, category.name), {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;

      blocks.set(entry.name, {
        dir: entry.name,
        category: category.name,
        entry: join("src", "components", "blocks", category.name, entry.name, "index.tsx"),
      });
    }
  }

  return blocks;
}

/** The block a mockup slug belongs to, allowing for the odd spelling drift. */
export function blockFor(blocks: Map<string, Block>, slug: string) {
  return blocks.get(blockDirFixes[slug] ?? slug) ?? blocks.get(slug);
}
