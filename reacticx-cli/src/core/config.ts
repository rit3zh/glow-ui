import fs from "fs-extra";
import path from "node:path";

import type {
  ComponentConfig,
  InstallPolicy,
  PackageManagerSetting,
  Structure,
  UserConfig,
} from "../typings/index.js";

export const CONFIG_FILE = "component.config.json";

export const SCHEMA_URL = "https://reacticx.com/schema/component.config.json";

export const DEFAULT_ORIGIN =
  "https://pub-028ac77ff44d4123aed5b9b6592ec08d.r2.dev";

export const defaults: ComponentConfig = {
  outDir: "src/shared/components",
  structure: "category",
  typescript: true,
  aliases: {
    components: "@/shared/components",
    utils: "@/shared/utils",
    hooks: "@/shared/hooks",
  },
  paths: {
    utils: "src/shared/utils",
    hooks: "src/shared/hooks",
    types: "src/shared/types",
    examples: "src/shared/examples",
  },
  include: {
    types: false,
    examples: false,
    dependencies: true,
  },
  overwrite: false,
  packageManager: "auto",
  installDependencies: "prompt",
  registry: {
    origin: DEFAULT_ORIGIN,
    index: "index.json",
    registry: "core/registry.json",
    cache: 3600,
  },
};

const STRUCTURES: Structure[] = ["category", "flat", "mirror"];
const POLICIES: InstallPolicy[] = ["auto", "prompt", "never"];
const MANAGERS: PackageManagerSetting[] = [
  "auto",
  "bun",
  "pnpm",
  "yarn",
  "npm",
];

export interface LoadedConfig {
  config: ComponentConfig;
  filePath: string | null;
  root: string;
}

export function configPath(root = process.cwd()) {
  return path.join(root, CONFIG_FILE);
}

function merge(base: ComponentConfig, user: UserConfig): ComponentConfig {
  const merged = { ...base } as Record<string, unknown>;

  for (const [key, value] of Object.entries(user)) {
    if (value === undefined || value === null) continue;

    const current = merged[key];
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof current === "object" &&
      current !== null
    ) {
      merged[key] = { ...(current as object), ...(value as object) };
      continue;
    }
    merged[key] = value;
  }

  return merged as unknown as ComponentConfig;
}

export function validate(config: ComponentConfig): string[] {
  const problems: string[] = [];

  if (typeof config.outDir !== "string" || config.outDir.trim() === "") {
    problems.push(`"outDir" must be a non-empty path`);
  } else if (path.isAbsolute(config.outDir)) {
    problems.push(`"outDir" must be relative to the project root`);
  }

  if (!STRUCTURES.includes(config.structure)) {
    problems.push(`"structure" must be one of ${STRUCTURES.join(", ")}`);
  }
  if (!MANAGERS.includes(config.packageManager)) {
    problems.push(`"packageManager" must be one of ${MANAGERS.join(", ")}`);
  }
  if (!POLICIES.includes(config.installDependencies)) {
    problems.push(
      `"installDependencies" must be one of ${POLICIES.join(", ")}`,
    );
  }
  if (typeof config.typescript !== "boolean") {
    problems.push(`"typescript" must be a boolean`);
  }

  for (const key of ["utils", "hooks", "types", "examples"] as const) {
    const value = config.paths[key];
    if (typeof value !== "string" || value.trim() === "") {
      problems.push(`"paths.${key}" must be a non-empty path`);
    }
  }

  for (const key of ["components", "utils", "hooks"] as const) {
    const value = config.aliases[key];
    if (typeof value !== "string") {
      problems.push(`"aliases.${key}" must be a string`);
    }
  }

  const { origin } = config.registry;
  if (!/^https?:\/\//.test(origin)) {
    problems.push(`"registry.origin" must be an http(s) URL`);
  }
  if (origin.endsWith("/")) {
    problems.push(`"registry.origin" must not end with a slash`);
  }

  const { cache } = config.registry;
  if (cache !== false && (typeof cache !== "number" || cache < 0)) {
    problems.push(`"registry.cache" must be false or a TTL in seconds`);
  }

  return problems;
}

export async function loadConfig(root = process.cwd()): Promise<LoadedConfig> {
  const filePath = configPath(root);

  if (!(await fs.pathExists(filePath))) {
    return { config: defaults, filePath: null, root };
  }

  let raw: unknown;
  try {
    raw = await fs.readJson(filePath);
  } catch (error) {
    throw new Error(
      `${CONFIG_FILE} is not valid JSON — ${(error as Error).message}`,
    );
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error(`${CONFIG_FILE} must contain a JSON object`);
  }

  const config = merge(defaults, raw as UserConfig);
  const problems = validate(config);

  if (problems.length > 0) {
    throw new Error(
      `${CONFIG_FILE} is invalid:\n  - ${problems.join("\n  - ")}`,
    );
  }

  return { config, filePath, root };
}

export async function writeConfig(
  config: ComponentConfig,
  root = process.cwd(),
): Promise<string> {
  const output: Record<string, unknown> = {
    $schema: config.$schema ?? SCHEMA_URL,
    outDir: config.outDir,
  };

  for (const key of Object.keys(defaults) as (keyof ComponentConfig)[]) {
    if (key === "outDir") continue;

    const value = config[key];
    const fallback = defaults[key];

    if (typeof value === "object" && value !== null) {
      const base = fallback as unknown as Record<string, unknown>;
      const diff = Object.fromEntries(
        Object.entries(value as unknown as Record<string, unknown>).filter(
          ([name, entry]) => base[name] !== entry,
        ),
      );
      if (Object.keys(diff).length > 0) output[key] = diff;
      continue;
    }

    if (value !== fallback) output[key] = value;
  }

  const filePath = configPath(root);
  await fs.writeJson(filePath, output, { spaces: 2 });
  return filePath;
}

export function componentDir(
  config: ComponentConfig,
  component: { name: string; category: string; path: string },
  root = process.cwd(),
): string {
  const base = path.join(root, config.outDir);

  switch (config.structure) {
    case "flat":
      return path.join(base, component.name);
    case "mirror":
      return path.join(base, component.path.replace(/^src\/components\//, ""));
    case "category":
    default:
      return path.join(base, component.category, component.name);
  }
}
