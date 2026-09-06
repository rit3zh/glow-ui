/**
 * rewatch-components.ts
 * -----------------------------------------------------------------------------
 * Destroys every generated demo screen under `app/components/` and the
 * generated data file, then re-runs `sync-components.ts --once` to re-scaffold
 * everything from scratch.
 *
 * Use this when you've changed the screen template in sync-components.ts and
 * want every existing screen to pick up the new template.
 *
 * Usage:
 *   bun scripts/rewatch-components.ts
 * -----------------------------------------------------------------------------
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = path.resolve(__dirname, "..");
const APP_COMPONENTS_DIR = path.join(ROOT, "app/components");
const GENERATED_FILE = path.join(APP_COMPONENTS_DIR, "routes.generated.ts");
const SYNC_SCRIPT = path.join(ROOT, "scripts/sync-components.ts");

function clearDirectory(dir: string): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

async function main(): Promise<void> {
  console.log(`🧹 removing demo screens in app/components/ …`);
  clearDirectory(APP_COMPONENTS_DIR);

  if (fs.existsSync(GENERATED_FILE)) {
    fs.rmSync(GENERATED_FILE, { force: true });
    console.log(`  removed routes.generated.ts`);
  }

  console.log(`🔄 re-running sync-components …`);
  const result = execSync(`bun ${SYNC_SCRIPT} --once`, {
    cwd: ROOT,
    stdio: "inherit",
  });

  console.log(`✔ rewatch complete`);
}

main().catch((err) => {
  console.error("✖ rewatch failed:", err);
  process.exit(1);
});
