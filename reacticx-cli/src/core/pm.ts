import { execSync, spawn } from "node:child_process";
import path from "node:path";
import fs from "fs-extra";

import type {
  PackageManager,
  PackageManagerSetting,
} from "../typings/index.js";

const LOCKFILES: Record<string, PackageManager> = {
  "bun.lockb": "bun",
  "bun.lock": "bun",
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "package-lock.json": "npm",
};

export const PM_LABELS: Record<PackageManager, string> = {
  bun: "bun",
  pnpm: "pnpm",
  yarn: "yarn",
  npm: "npm",
};

export const PM_EXEC: Record<PackageManager, string> = {
  bun: "bunx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  npm: "npx",
};

export const PM_CREATE: Record<PackageManager, string> = {
  bun: "bunx create-expo-app",
  pnpm: "pnpm create expo-app",
  yarn: "yarn create expo-app",
  npm: "npx create-expo-app",
};

export function installCommand(pm: PackageManager, packages: string[]) {
  const verb = pm === "npm" ? "install" : "add";
  return `${pm} ${verb} ${packages.join(" ")}`;
}

export function detectPackageManager(root = process.cwd()): PackageManager {
  for (const [file, pm] of Object.entries(LOCKFILES)) {
    if (fs.pathExistsSync(path.join(root, file))) return pm;
  }

  for (const pm of ["bun", "pnpm", "yarn"] as PackageManager[]) {
    try {
      execSync(`${pm} --version`, { stdio: "ignore" });
      return pm;
    } catch {}
  }

  return "npm";
}

export function resolvePackageManager(
  setting: PackageManagerSetting,
  root = process.cwd(),
): PackageManager {
  return setting === "auto" ? detectPackageManager(root) : setting;
}

export function run(command: string, cwd?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { cwd, stdio: "inherit", shell: true });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`\`${command}\` exited with code ${code}`)),
    );
  });
}
