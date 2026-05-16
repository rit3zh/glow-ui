import fs from "fs";
import path from "path";

const COMPONENTS_DIR = "./src/components";
const OUTPUT_FILES = ["./registry.json", `${COMPONENTS_DIR}/registry.json`];

const CATEGORY_FOLDERS = [
  "ai",
  "atoms",
  "base",
  "micro-interactions",
  "molecules",
  "organisms",
  "screens",
  "templates",
];

const IGNORE_FILES = ["index.ts"];

interface FolderEntry {
  name: string;
  files: string[];
}

interface ComponentEntry {
  name: string;
  category: string;
  files: string[];
  folders: FolderEntry[];
  path: string;
}

function isComponentFolder(dirPath: string): boolean {
  const files = fs.readdirSync(dirPath);
  // A component folder must have an index.ts, index.tsx, or a main component file
  const folderName = path.basename(dirPath);
  const pascalName = folderName
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  return files.some(
    (f) =>
      f === "index.tsx" ||
      f === "index.ts" ||
      f === `${pascalName}.tsx` ||
      f === `${folderName}.tsx`,
  );
}

function getFilesInFolder(dir: string): string[] {
  let items: fs.Dirent[];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  return items
    .filter(
      (item) =>
        !item.isDirectory() &&
        (item.name.endsWith(".tsx") || item.name.endsWith(".ts")) &&
        !IGNORE_FILES.includes(item.name),
    )
    .map((item) => item.name);
}

function getFoldersWithFiles(dir: string): FolderEntry[] {
  const folders: FolderEntry[] = [];

  let items: fs.Dirent[];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return folders;
  }

  for (const item of items) {
    if (!item.isDirectory()) continue;

    const fullPath = path.join(dir, item.name);
    const folderFiles = getAllFilesInFolderRecursively(fullPath);

    if (folderFiles.length > 0) {
      folders.push({
        name: item.name,
        files: folderFiles.sort(),
      });
    }
  }

  return folders;
}

function getAllFilesInFolderRecursively(
  dir: string,
  baseDir: string = dir,
): string[] {
  const files: string[] = [];

  let items: fs.Dirent[];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (item.isDirectory()) {
      files.push(...getAllFilesInFolderRecursively(fullPath, baseDir));
    } else if (item.name.endsWith(".tsx") || item.name.endsWith(".ts")) {
      // Don't filter out index.ts in subfolders - only root index.ts is ignored
      files.push(relativePath);
    }
  }

  return files;
}

function scanDirectory(
  dir: string,
  category: string = "",
  depth: number = 0,
  parentIsComponent: boolean = false,
): ComponentEntry[] {
  const entries: ComponentEntry[] = [];

  let items: fs.Dirent[];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return entries;
  }

  for (const item of items) {
    if (!item.isDirectory()) continue;

    const fullPath = path.join(dir, item.name);
    const folderName = item.name;

    let currentCategory = category;
    if (CATEGORY_FOLDERS.includes(folderName) && depth === 0) {
      currentCategory = folderName;
      // Category folders are not components, recurse into them
      entries.push(
        ...scanDirectory(fullPath, currentCategory, depth + 1, false),
      );
      continue;
    }

    if (isComponentFolder(fullPath)) {
      const rootFiles = getFilesInFolder(fullPath);
      const folders = getFoldersWithFiles(fullPath);

      if (rootFiles.length > 0 || folders.length > 0) {
        entries.push({
          name: folderName,
          category: currentCategory || "base",
          files: rootFiles.sort(),
          folders: folders,
          path: fullPath.replace(/^\.\//, ""),
        });
      }

      // Don't recurse into subfolders of a component (they're already captured in folders)
      continue;
    }

    entries.push(...scanDirectory(fullPath, currentCategory, depth + 1, false));
  }

  return entries;
}

function generateRegistry() {
  const components = scanDirectory(COMPONENTS_DIR);

  const uniqueComponents = components.filter(
    (c, index, self) =>
      (c.files.some((f) => f.endsWith(".tsx")) ||
        c.folders.some((folder) =>
          folder.files.some((f) => f.endsWith(".tsx")),
        )) &&
      index === self.findIndex((t) => t.name === c.name),
  );

  const registry = {
    version: "1.0.0",
    totalComponents: uniqueComponents.length,
    categories: [...new Set(uniqueComponents.map((c) => c.category))].sort(),
    components: Object.fromEntries(
      uniqueComponents
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => [
          c.name,
          {
            name: c.name,
            category: c.category,
            path: c.path,
            folders: c.folders,
            files: c.files.sort(),
          },
        ]),
    ),
  };

  for (const outputFile of OUTPUT_FILES) {
    fs.writeFileSync(outputFile, JSON.stringify(registry, null, 2));
  }

  console.log(`\n✅ Generated ${OUTPUT_FILES.join(", ")}`);
  console.log(`📦 Total components: ${uniqueComponents.length}`);
  console.log(`📁 Categories: ${registry.categories.join(", ")}\n`);

  for (const cat of registry.categories) {
    const count = uniqueComponents.filter((c) => c.category === cat).length;
    console.log(`   ${cat}: ${count} components`);
  }
}

generateRegistry();
