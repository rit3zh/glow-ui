/**
 * Generates `.source/` (the fumadocs content map and its compiled config).
 *
 * `next dev` only triggers this when it loads `next.config.mjs` in a process
 * whose argv carries `dev`, which Next 16 does not guarantee — and the
 * `fumadocs-mdx` CLI deletes `.source/` after compiling, taking
 * `source.config.mjs` with it. Calling `start` directly does both halves and
 * leaves them in place.
 */
import { start } from "fumadocs-mdx/next";

await start(false, "source.config.ts", ".source");
