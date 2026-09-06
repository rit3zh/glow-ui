import path from "node:path";
import fs from "fs-extra";

import type {
  AddOptions,
  ComponentConfig,
  Registry,
} from "../typings/index.js";
import {
  CONFIG_FILE,
  RegistryClient,
  byCategory,
  collect,
  componentLocator,
  findMissingDependencies,
  installCommand,
  loadConfig,
  resolveComponentName,
  resolvePackageManager,
  resolvedAliasDirs,
  rewriteImports,
  run,
  type CollectedFile,
  type CollectedGroup,
  type CollectResult,
} from "../core/index.js";
import {
  accent,
  bail,
  c,
  closest,
  formatBytes,
  muted,
  row,
  shorten,
  ui,
  innerWidth,
  type Row,
} from "../ui/index.js";

export async function add(names: string[], options: AddOptions) {
  const root = process.cwd();
  const { config: loaded, filePath } = await loadConfig(root);

  const config: ComponentConfig = {
    ...loaded,
    outDir: options.dir ?? loaded.outDir,
    overwrite: options.overwrite ?? loaded.overwrite,
    include: {
      types: options.types ?? loaded.include.types,
      examples: options.examples ?? loaded.include.examples,
      dependencies:
        options.deps === false ? false : loaded.include.dependencies,
    },
    installDependencies:
      options.install === false ? "never" : loaded.installDependencies,
  };

  const client = new RegistryClient(config);

  const spinner = ui.spinner("Reading the registry…");
  let registry: Registry;
  try {
    registry = await client.registry();
    await client.index();
    spinner.stop();
  } catch (error) {
    spinner.stop();
    bail((error as Error).message, ["check your connection, then try again"]);
  }

  let requested = names.filter(Boolean);
  if (requested.length === 0) requested = await pick(registry);

  const unknown = requested.filter(
    (name) => !resolveComponentName(registry, name),
  );
  if (unknown.length > 0) {
    const suggestions = closest(unknown[0]!, Object.keys(registry.components));
    bail(
      `no component named ${c.bold(unknown[0]!)}`,
      suggestions.length > 0
        ? [`did you mean ${suggestions.map((s) => c.bold(s)).join(", ")}?`]
        : ["run reacticx list to see everything available"],
    );
  }

  const selected = requested.map(
    (name) => resolveComponentName(registry, name)!,
  );

  const collecting = ui.spinner("Resolving files…");
  let collected: CollectResult;
  try {
    collected = await collect(selected, {
      client,
      registry,
      config,
      root,
      include: config.include,
      onProgress: (name) => {
        collecting.text = muted(`Resolving ${name}…`);
      },
    });
    collecting.stop();
  } catch (error) {
    collecting.stop();
    bail((error as Error).message);
  }

  const { groups, unresolved } = collected;
  const files = groups.flatMap((group) => group.files);

  if (files.length === 0) {
    ui.box({
      title: "reacticx add",
      rows: [row.gap(), row.warn("nothing to write"), row.gap()],
    });
    return;
  }

  const resolved = resolvedAliasDirs(config, root);
  const locate = componentLocator(registry, config, root);
  const written: { display: string; source: string }[] = [];

  for (const file of files) {
    if (!file.text) continue;
    const source = rewriteImports(file.body.toString("utf8"), {
      config,
      target: file.target,
      resolved,
      locate,
    });
    file.body = Buffer.from(source, "utf8");
    written.push({ display: file.display, source });
  }

  const existing = await filterExisting(files);

  if (existing.length > 0 && !config.overwrite) {
    if (options.yes || options.dry) {
      ui.box({
        title: "reacticx add",
        badge: "skipped",
        rows: [
          row.gap(),
          row.warn(`${existing.length} file(s) already exist, left alone`),
          row.gap(),
          ...existing.slice(0, 6).map((file) => row.path(file.display)),
          ...(existing.length > 6
            ? [row.dim(`…and ${existing.length - 6} more`)]
            : []),
          row.gap(),
          row.dim("pass --overwrite to replace them"),
          row.gap(),
        ],
      });
      return;
    }

    ui.box({
      title: "reacticx add",
      badge: "conflict",
      color: c.yellow,
      rows: [
        row.gap(),
        row.warn(`${existing.length} file(s) already exist`),
        row.gap(),
        ...existing.slice(0, 8).map((file) => row.path(file.display)),
        ...(existing.length > 8
          ? [row.dim(`…and ${existing.length - 8} more`)]
          : []),
        row.gap(),
      ],
    });

    const { overwrite } = await ui.ask({
      type: "confirm",
      name: "overwrite",
      message: "Overwrite them?",
      initial: false,
    });

    if (!overwrite) {
      ui.hint("nothing written — your files are untouched");
      return;
    }
  }

  if (!options.dry) {
    for (const file of files) {
      await fs.ensureDir(path.dirname(file.target));
      await fs.writeFile(file.target, file.body);
    }
  }

  const label =
    selected.length === 1 ? selected[0]! : `${selected.length} components`;

  ui.box({
    title: options.dry ? "reacticx add" : `added ${c.green(label)}`,
    badge: options.dry
      ? `dry run · ${files.length} files`
      : `${files.length} files · ${formatBytes(totalSize(files))}`,
    rows: [
      row.gap(),
      ...groupRows(groups),
      ...unresolvedRows(unresolved),
      row.gap(),
    ],
  });

  if (options.dry) {
    ui.hint(`nothing was written — drop ${accent("--dry")} to apply`);
    return;
  }

  await offerDependencies(written, config, root, options);

  if (!filePath && !options.dir) {
    ui.hint(
      `no ${CONFIG_FILE} — used defaults; ${accent("reacticx init")} to choose`,
    );
  }
}

async function pick(registry: Registry): Promise<string[]> {
  const choices = [...byCategory(registry).entries()].flatMap(
    ([category, components]) => [
      { title: muted(`── ${category}`), value: "", disabled: true },
      ...components.map((component) => ({
        title: component.name,
        value: component.name,
      })),
    ],
  );

  const { picked } = await ui.ask<"picked">({
    type: "autocompleteMultiselect",
    name: "picked",
    message: "Which components?",
    instructions: false,
    choices,
  });

  const selection = ((picked as string[]) ?? []).filter(Boolean);
  if (selection.length === 0) {
    ui.hint("nothing selected");
    process.exit(0);
  }

  return selection;
}

async function filterExisting(files: CollectedFile[]) {
  const found: CollectedFile[] = [];
  for (const file of files) {
    if (await fs.pathExists(file.target)) found.push(file);
  }
  return found;
}

function totalSize(files: CollectedFile[]) {
  return files.reduce((total, file) => total + file.size, 0);
}

const KIND_LABEL = {
  component: "",
  types: "types",
  example: "example",
  shared: "shared",
} as const;

function groupRows(groups: CollectedGroup[]): Row[] {
  const rows: Row[] = [];
  const inner = innerWidth();

  for (const [index, group] of groups.entries()) {
    const kind = KIND_LABEL[group.kind];
    const suffix = [kind, group.reason].filter(Boolean).join(" · ");

    if (index > 0) rows.push(row.gap());
    rows.push(c.bold(group.name) + (suffix ? `  ${muted(suffix)}` : ""));

    for (const file of group.files) {
      rows.push(muted(`  ${shorten(file.display, inner - 2)}`));
    }
  }

  return rows;
}

function unresolvedRows(unresolved: CollectResult["unresolved"]): Row[] {
  if (unresolved.length === 0) return [];

  return [
    row.rule("unresolved"),
    row.gap(),
    ...unresolved.map((entry) =>
      row.warn(`${entry.specifier} ${muted(`· ${entry.from}`)}`),
    ),
    row.gap(),
    row.dim("the registry has no source for these — supply them yourself"),
  ];
}

async function offerDependencies(
  written: { display: string; source: string }[],
  config: ComponentConfig,
  root: string,
  options: AddOptions,
) {
  if (config.installDependencies === "never") return;

  const missing = await findMissingDependencies(written, root);
  if (missing.length === 0) return;

  const packages = missing.map((entry) => entry.name);
  const pm = resolvePackageManager(config.packageManager, root);
  const command = installCommand(pm, packages);

  ui.box({
    title: "missing packages",
    badge: String(missing.length),
    color: c.yellow,
    rows: [
      row.gap(),
      ...missing.map((entry) => row.item(entry.name)),
      row.gap(),
      row.dim(command),
      row.gap(),
    ],
  });

  const shouldInstall =
    config.installDependencies === "auto" ||
    (options.yes
      ? false
      : (
          await ui.ask({
            type: "confirm",
            name: "install",
            message: `Install with ${pm}?`,
            initial: true,
          })
        ).install);

  if (!shouldInstall) {
    ui.hint(`install them yourself:  ${accent(command)}`);
    return;
  }

  try {
    await run(command, root);
    ui.hint("dependencies installed");
  } catch (error) {
    ui.hint(
      `${(error as Error).message} — run it yourself: ${accent(command)}`,
    );
  }
}
