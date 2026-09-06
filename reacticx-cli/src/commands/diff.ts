import path from "node:path";
import fs from "fs-extra";

import {
  RegistryClient,
  componentDir,
  componentLocator,
  coreKeyFor,
  isTextFile,
  loadConfig,
  resolveComponentName,
  resolvedAliasDirs,
  rewriteImports,
} from "../core/index.js";
import { accent, bail, c, muted, row, ui, type Row } from "../ui/index.js";

export async function diff(name: string | undefined) {
  const root = process.cwd();
  const { config } = await loadConfig(root);
  const client = new RegistryClient(config);

  const spinner = ui.spinner("Reading the registry…");
  let registry;
  try {
    registry = await client.registry();
    await client.index();
    spinner.stop();
  } catch (error) {
    spinner.stop();
    bail((error as Error).message);
  }

  const candidates = name
    ? [resolveComponentName(registry, name) ?? name]
    : Object.keys(registry.components);
  const resolved = resolvedAliasDirs(config, root);
  const locate = componentLocator(registry, config, root);

  const comparing = ui.spinner("Comparing…");
  const rows: Row[] = [];
  let checked = 0;
  let drifted = 0;

  for (const candidate of candidates) {
    const component = registry.components[candidate];
    if (!component) {
      comparing.stop();
      bail(`no component named ${c.bold(candidate)}`);
    }

    const dir = componentDir(config, component, root);
    if (!(await fs.pathExists(dir))) {
      if (name) {
        comparing.stop();
        bail(`${c.bold(candidate)} is not installed in ${config.outDir}`);
      }
      continue;
    }

    checked += 1;
    comparing.text = muted(`Comparing ${candidate}…`);

    const prefix = coreKeyFor(component);
    const remote = await client.filesUnder(prefix);
    const changed: string[] = [];
    const missing: string[] = [];

    for (const file of remote) {
      const relative = file.key.slice(prefix.length + 1);
      const target = path.join(dir, ...relative.split("/"));

      if (!(await fs.pathExists(target))) {
        missing.push(relative);
        continue;
      }

      const local = await fs.readFile(target);
      const body = await client.file(file);
      const upstream = isTextFile(file.key)
        ? Buffer.from(
            rewriteImports(body.toString("utf8"), {
              config,
              target,
              resolved,
              locate,
            }),
            "utf8",
          )
        : body;

      if (!local.equals(upstream)) changed.push(relative);
    }

    if (changed.length === 0 && missing.length === 0) continue;

    if (drifted > 0) rows.push(row.gap());
    drifted += 1;
    rows.push(c.bold(candidate));
    for (const file of changed)
      rows.push(`  ${c.yellow("modified")}  ${muted(file)}`);
    for (const file of missing)
      rows.push(`  ${c.red("missing")}   ${muted(file)}`);
  }

  comparing.stop();

  if (checked === 0) {
    ui.box({
      title: "reacticx diff",
      rows: [row.gap(), row.warn("no installed components found"), row.gap()],
    });
    return;
  }

  if (drifted === 0) {
    ui.box({
      title: "reacticx diff",
      badge: "in sync",
      color: c.green,
      rows: [
        row.gap(),
        row.ok(`${checked} component(s) match the registry`),
        row.gap(),
      ],
    });
    return;
  }

  ui.box({
    title: "reacticx diff",
    badge: `${drifted} of ${checked} differ`,
    color: c.yellow,
    rows: [row.gap(), ...rows, row.gap()],
  });

  ui.hint(
    `take the registry version with  ${accent(`reacticx add ${name ?? "<component>"} --overwrite`)}`,
  );
}
