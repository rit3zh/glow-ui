import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_DIR = path.join(ROOT, "src/components");
const EXAMPLES_DIR = path.join(ROOT, "examples");
const WEBSITE_RN = path.join(ROOT, "website/react-native");
const WEBSITE_TYPES = path.join(ROOT, "website/react-native-types");
const WEBSITE_USAGE = path.join(ROOT, "website/react-native-usage");

const DRY = process.argv.includes("--dry");
const VERBOSE = process.argv.includes("--verbose") || DRY;
const CHANGED_ONLY = process.argv.includes("--changed");

function getChangedFiles(): Set<string> {
  // Both staged and unstaged tracked changes, plus untracked.
  const out = execSync("git status --porcelain", { cwd: ROOT, encoding: "utf8" });
  const files = new Set<string>();
  for (const line of out.split("\n")) {
    if (!line.trim()) continue;
    // Porcelain format: "XY path" or "XY old -> new"
    const pathPart = line.slice(3);
    const finalPath = pathPart.includes(" -> ") ? pathPart.split(" -> ")[1] : pathPart;
    files.add(path.resolve(ROOT, finalPath.trim()));
  }
  return files;
}

const CATEGORIES = [
  "ai",
  "atoms",
  "base",
  "micro-interactions",
  "molecules",
  "organisms",
  "screens",
  "templates",
];

// Nested components that live more than 1 level under a category.
// Each entry is the path relative to src/components.
const NESTED_COMPONENTS = ["templates/sheet/floating-sheet"];

type Component = {
  name: string;
  dir: string;
  mainFile: string;
  typesFile: string | null;
};

function toPascal(kebab: string): string {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function toKebab(name: string): string {
  // PascalCase → kebab-case (e.g. "FloatingSheet" → "floating-sheet")
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function inspectFolder(dir: string): Component | null {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  const folderName = path.basename(dir);
  const pascalName = /^[A-Z]/.test(folderName) ? folderName : toPascal(folderName);
  const files = entries.filter((e) => !e.isDirectory()).map((e) => e.name);
  const mainCandidates = [
    "index.tsx",
    `${pascalName}.tsx`,
    `${folderName}.tsx`,
  ];
  const main = mainCandidates.find((f) => files.includes(f));
  if (!main) return null;
  const typesCandidates = ["types.ts", `${pascalName}.types.ts`];
  const typesFile = typesCandidates.find((f) => files.includes(f)) ?? null;
  return {
    name: toKebab(folderName),
    dir,
    mainFile: main,
    typesFile,
  };
}

function findComponents(): Component[] {
  const out: Component[] = [];
  for (const category of CATEGORIES) {
    const catDir = path.join(COMPONENTS_DIR, category);
    if (!fs.existsSync(catDir)) continue;
    for (const entry of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const c = inspectFolder(path.join(catDir, entry.name));
      if (c) out.push(c);
    }
  }
  for (const rel of NESTED_COMPONENTS) {
    const c = inspectFolder(path.join(COMPONENTS_DIR, rel));
    if (c) out.push(c);
    else console.warn(`! nested component not found: ${rel}`);
  }
  return out;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyIfChanged(src: string, dest: string): "skip" | "update" | "create" {
  const srcContent = fs.readFileSync(src, "utf8");
  const exists = fs.existsSync(dest);
  if (exists) {
    const destContent = fs.readFileSync(dest, "utf8");
    if (destContent === srcContent) return "skip";
  }
  if (!DRY) {
    ensureDir(path.dirname(dest));
    fs.writeFileSync(dest, srcContent);
  }
  return exists ? "update" : "create";
}

function syncComponents(changed: Set<string> | null) {
  const all = findComponents();
  const components = changed
    ? all.filter((c) =>
        [...changed].some((f) => f.startsWith(c.dir + path.sep) || f === c.dir),
      )
    : all;
  const stats = { created: 0, updated: 0, skipped: 0, typesCreated: 0, typesUpdated: 0, typesSkipped: 0 };
  const collisions = new Map<string, string[]>();

  for (const c of components) {
    const existing = collisions.get(c.name) ?? [];
    existing.push(path.relative(ROOT, c.dir));
    collisions.set(c.name, existing);
  }
  for (const [name, dirs] of collisions) {
    if (dirs.length > 1) {
      console.warn(`! name collision "${name}": ${dirs.join(", ")} — last one wins`);
    }
  }

  for (const c of components) {
    const mainResult = copyIfChanged(
      path.join(c.dir, c.mainFile),
      path.join(WEBSITE_RN, `${c.name}.tsx`),
    );
    if (mainResult === "create") stats.created++;
    else if (mainResult === "update") stats.updated++;
    else stats.skipped++;
    if (VERBOSE && mainResult !== "skip") {
      console.log(`  ${mainResult.padEnd(6)} react-native/${c.name}.tsx`);
    }

    if (c.typesFile) {
      const typesResult = copyIfChanged(
        path.join(c.dir, c.typesFile),
        path.join(WEBSITE_TYPES, `${c.name}.ts`),
      );
      if (typesResult === "create") stats.typesCreated++;
      else if (typesResult === "update") stats.typesUpdated++;
      else stats.typesSkipped++;
      if (VERBOSE && typesResult !== "skip") {
        console.log(`  ${typesResult.padEnd(6)} react-native-types/${c.name}.ts`);
      }
    }
  }
  return stats;
}

function syncExamples(changed: Set<string> | null) {
  const stats = { created: 0, updated: 0, skipped: 0 };
  if (!fs.existsSync(EXAMPLES_DIR)) return stats;

  const files = fs
    .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
    .filter((e) => !e.isDirectory() && e.name.endsWith(".tsx"))
    .filter((e) =>
      changed ? changed.has(path.join(EXAMPLES_DIR, e.name)) : true,
    );

  for (const f of files) {
    const result = copyIfChanged(
      path.join(EXAMPLES_DIR, f.name),
      path.join(WEBSITE_USAGE, f.name),
    );
    if (result === "create") stats.created++;
    else if (result === "update") stats.updated++;
    else stats.skipped++;
    if (VERBOSE && result !== "skip") {
      console.log(`  ${result.padEnd(6)} react-native-usage/${f.name}`);
    }
  }
  return stats;
}

const changed = CHANGED_ONLY ? getChangedFiles() : null;
console.log(
  DRY
    ? `Dry run — no files will be written.${CHANGED_ONLY ? " (changed only)" : ""}\n`
    : `Syncing src → website...${CHANGED_ONLY ? " (changed only)" : ""}\n`,
);

const compStats = syncComponents(changed);
const usageStats = syncExamples(changed);

console.log("\nSummary:");
console.log(
  `  react-native/        ${compStats.created} created, ${compStats.updated} updated, ${compStats.skipped} unchanged`,
);
console.log(
  `  react-native-types/  ${compStats.typesCreated} created, ${compStats.typesUpdated} updated, ${compStats.typesSkipped} unchanged`,
);
console.log(
  `  react-native-usage/  ${usageStats.created} created, ${usageStats.updated} updated, ${usageStats.skipped} unchanged`,
);

if (DRY) console.log("\n(dry run — re-run without --dry to apply)");
