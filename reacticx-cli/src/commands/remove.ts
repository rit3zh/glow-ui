import path from "node:path";
import fs from "fs-extra";

import {
  RegistryClient,
  componentDir,
  loadConfig,
  resolveComponentName,
} from "../core/index.js";
import { bail, c, closest, muted, row, ui } from "../ui/index.js";

export async function remove(names: string[], options: { yes?: boolean }) {
  const root = process.cwd();
  const { config } = await loadConfig(root);
  const client = new RegistryClient(config);

  const spinner = ui.spinner("Reading the registry…");
  let registry;
  try {
    registry = await client.registry();
    spinner.stop();
  } catch (error) {
    spinner.stop();
    bail((error as Error).message);
  }

  const targets: { name: string; dir: string }[] = [];
  const skipped: string[] = [];

  for (const name of names) {
    const resolvedName = resolveComponentName(registry, name);
    const component = resolvedName
      ? registry.components[resolvedName]
      : undefined;
    if (!component) {
      const suggestions = closest(name, Object.keys(registry.components));
      bail(
        `no component named ${c.bold(name)}`,
        suggestions.length > 0
          ? [`did you mean ${suggestions.map((s) => c.bold(s)).join(", ")}?`]
          : [],
      );
    }

    const dir = componentDir(config, component, root);
    if (!(await fs.pathExists(dir))) {
      skipped.push(name);
      continue;
    }

    targets.push({ name, dir });
  }

  if (targets.length === 0) {
    ui.box({
      title: "reacticx remove",
      rows: [
        row.gap(),
        ...skipped.map((name) => row.warn(`${name} is not installed`)),
        row.gap(),
      ],
    });
    return;
  }

  ui.box({
    title: "reacticx remove",
    badge: `${targets.length} to delete`,
    color: c.yellow,
    rows: [
      row.gap(),
      ...targets.map(
        (target) =>
          `${c.bold(target.name)}  ${muted(path.relative(root, target.dir))}`,
      ),
      ...skipped.map((name) => row.warn(`${name} is not installed`)),
      row.gap(),
    ],
  });

  if (!options.yes) {
    const { confirmed } = await ui.ask({
      type: "confirm",
      name: "confirmed",
      message: `Delete ${targets.length} folder(s)?`,
      initial: false,
    });
    if (!confirmed) {
      ui.hint("nothing removed");
      return;
    }
  }

  for (const target of targets) await fs.remove(target.dir);

  ui.hint(
    `removed ${targets.length} component(s)  ${muted("· shared helpers were left in place")}`,
  );
}
