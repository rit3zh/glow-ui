import path from "node:path";
import fs from "fs-extra";

import type {
  ComponentConfig,
  InitOptions,
  Structure,
} from "../typings/index.js";
import { detectPackageManager } from "../core/index.js";
import {
  CONFIG_FILE,
  configPath,
  defaults,
  loadConfig,
  writeConfig,
} from "../core/config.js";
import { accent, c, muted, row, ui } from "../ui/index.js";

const STRUCTURES: { title: string; value: Structure; description: string }[] = [
  {
    title: "category",
    value: "category",
    description: "outDir/molecules/accordion — grouped the way the registry is",
  },
  {
    title: "flat",
    value: "flat",
    description: "outDir/accordion — one folder per component",
  },
  {
    title: "mirror",
    value: "mirror",
    description: "the library's own layout, nested paths and all",
  },
];

async function detectAlias(root: string): Promise<string | null> {
  for (const file of ["tsconfig.json", "jsconfig.json"]) {
    const filePath = path.join(root, file);
    if (!(await fs.pathExists(filePath))) continue;

    try {
      const raw = await fs.readFile(filePath, "utf8");
      const stripped = raw
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|\s)\/\/.*$/gm, "$1");
      const parsed = JSON.parse(stripped);
      const paths = parsed?.compilerOptions?.paths as
        | Record<string, string[]>
        | undefined;
      if (!paths) continue;

      for (const key of Object.keys(paths)) {
        if (key.endsWith("/*")) return key.slice(0, -2);
      }
    } catch {}
  }
  return null;
}

export async function init(options: InitOptions) {
  const root = process.cwd();
  const filePath = configPath(root);
  const exists = await fs.pathExists(filePath);

  if (exists && !options.force) {
    if (options.yes) {
      ui.box({
        title: "reacticx init",
        rows: [
          row.gap(),
          row.warn(`${CONFIG_FILE} already exists`),
          row.dim("pass --force to replace it"),
          row.gap(),
        ],
      });
      return;
    }

    ui.box({
      title: "reacticx init",
      color: c.yellow,
      rows: [row.gap(), row.warn(`${CONFIG_FILE} already exists`), row.gap()],
    });

    const { overwrite } = await ui.ask({
      type: "confirm",
      name: "overwrite",
      message: "Replace it?",
      initial: false,
    });
    if (!overwrite) {
      ui.hint("nothing changed");
      return;
    }
  }

  const alias = (await detectAlias(root)) ?? "@";
  const pm = detectPackageManager(root);
  const existing = exists ? (await loadConfig(root)).config : defaults;

  let config: ComponentConfig;

  if (options.yes) {
    config = {
      ...defaults,
      outDir: options.dir ?? defaults.outDir,
      packageManager: pm,
    };
  } else {
    ui.box({
      title: "reacticx init",
      badge: "setup",
      rows: [
        row.gap(),
        muted("A few questions, then a component.config.json."),
        row.gap(),
        row.field("import alias", `${alias}/*`),
        row.field("package manager", pm),
        row.gap(),
      ],
    });

    const answers = await ui.ask<
      | "outDir"
      | "structure"
      | "typescript"
      | "componentsAlias"
      | "include"
      | "installDependencies"
    >([
      {
        type: "text",
        name: "outDir",
        message: "Where should components go?",
        initial: options.dir ?? existing.outDir,
        validate: (value: string) =>
          value.trim() ? true : "Give a path relative to the project root",
      },
      {
        type: "select",
        name: "structure",
        message: "How should they be laid out?",
        choices: STRUCTURES,
        initial: Math.max(
          0,
          STRUCTURES.findIndex((entry) => entry.value === existing.structure),
        ),
      },
      {
        type: "text",
        name: "componentsAlias",
        message:
          "Import alias for those components (blank for relative imports)",
        initial: (_prev: unknown, values: Record<string, unknown>) =>
          `${alias}/${String(values.outDir).replace(/^src\//, "")}`,
      },
      {
        type: "multiselect",
        name: "include",
        message: "Also copy, alongside each component",
        instructions: false,
        choices: [
          {
            title: "internal dependencies",
            value: "dependencies",
            selected: existing.include.dependencies,
            description: "components and helpers the source imports",
          },
          {
            title: "public types",
            value: "types",
            selected: existing.include.types,
            description: "the component's prop types, extracted",
          },
          {
            title: "example screens",
            value: "examples",
            selected: existing.include.examples,
            description: "the screen that documents the component",
          },
        ],
      },
      {
        type: "select",
        name: "installDependencies",
        message: "Missing npm packages",
        choices: [
          { title: "ask me", value: "prompt" },
          { title: "install automatically", value: "auto" },
          { title: "never install", value: "never" },
        ],
        initial: ["prompt", "auto", "never"].indexOf(
          existing.installDependencies,
        ),
      },
    ]);

    const outDir = String(answers.outDir)
      .trim()
      .replace(/^\.\//, "")
      .replace(/\/+$/, "");
    const componentsAlias = String(answers.componentsAlias ?? "")
      .trim()
      .replace(/\/+$/, "");
    const include = new Set((answers.include as string[]) ?? []);
    const base = outDir.split("/").slice(0, -1).join("/") || outDir;

    config = {
      ...defaults,
      outDir,
      structure: answers.structure as Structure,
      packageManager: pm,
      installDependencies:
        answers.installDependencies as ComponentConfig["installDependencies"],
      aliases: {
        components: componentsAlias,
        utils: componentsAlias
          ? `${alias}/${base.replace(/^src\//, "")}/utils`
          : "",
        hooks: componentsAlias
          ? `${alias}/${base.replace(/^src\//, "")}/hooks`
          : "",
      },
      paths: {
        utils: `${base}/utils`,
        hooks: `${base}/hooks`,
        types: `${base}/types`,
        examples: `${base}/examples`,
      },
      include: {
        dependencies: include.has("dependencies"),
        types: include.has("types"),
        examples: include.has("examples"),
      },
    };
  }

  const written = await writeConfig(config, root);
  await fs.ensureDir(path.join(root, config.outDir));

  ui.box({
    title: `${exists ? "updated" : "created"} ${c.green(path.relative(root, written))}`,
    rows: [
      row.gap(),
      row.field("outDir", config.outDir),
      row.field("structure", config.structure),
      row.field(
        "alias",
        config.aliases.components || muted("relative imports"),
      ),
      row.field("install deps", config.installDependencies),
      row.gap(),
    ],
  });

  ui.hint(
    `next  ${accent("reacticx list")}  ${muted("or")}  ${accent("reacticx add button")}`,
  );
}
