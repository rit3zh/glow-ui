import path from "node:path";
import fs from "fs-extra";

import { packageFor, readSpecifiers } from "./transform.js";

const PROVIDED = new Set(["react", "react-dom", "react-native", "expo"]);

export interface MissingDependency {
  name: string;
  usedBy: string[];
}

async function installedPackages(root: string): Promise<Set<string>> {
  const packageJson = path.join(root, "package.json");
  if (!(await fs.pathExists(packageJson))) return new Set();

  try {
    const manifest = await fs.readJson(packageJson);
    return new Set([
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.devDependencies ?? {}),
      ...Object.keys(manifest.peerDependencies ?? {}),
    ]);
  } catch {
    return new Set();
  }
}

export async function findMissingDependencies(
  files: { display: string; source: string }[],
  root: string,
): Promise<MissingDependency[]> {
  const installed = await installedPackages(root);
  const found = new Map<string, string[]>();

  for (const file of files) {
    for (const specifier of readSpecifiers(file.source)) {
      const name = packageFor(specifier);
      if (!name || PROVIDED.has(name) || installed.has(name)) continue;

      const users = found.get(name) ?? [];
      if (!users.includes(file.display)) users.push(file.display);
      found.set(name, users);
    }
  }

  return [...found.entries()]
    .map(([name, usedBy]) => ({ name, usedBy }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
