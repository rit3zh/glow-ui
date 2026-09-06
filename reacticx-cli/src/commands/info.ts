import path from "node:path";
import fs from "fs-extra";

import {
  RegistryClient,
  componentDir,
  resolveComponentName,
  coreKeyFor,
  exampleKeyFor,
  loadConfig,
  typesKeyFor,
} from "../core/index.js";
import {
  accent,
  bail,
  c,
  closest,
  formatBytes,
  muted,
  row,
  ui,
} from "../ui/index.js";

export async function info(name: string) {
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
        : ["run reacticx list to see everything available"],
    );
  }

  const prefix = coreKeyFor(component);
  const files = await client.filesUnder(prefix);
  const types = await client.filesUnder(typesKeyFor(component));
  const examples = await client.filesUnder(exampleKeyFor(component));
  const target = componentDir(config, component, root);
  const installed = await fs.pathExists(target);
  const bytes = files.reduce((total, file) => total + file.size, 0);

  ui.box({
    title: c.bold(component.name),
    badge: component.category,
    rows: [
      row.gap(),
      row.field("source", muted(component.path)),
      row.field("files", `${files.length} ${muted(`· ${formatBytes(bytes)}`)}`),
      row.field("types", types.length > 0 ? `${types.length}` : muted("none")),
      row.field(
        "example",
        examples.length > 0 ? `${examples.length}` : muted("none"),
      ),
      row.field(
        "installed",
        installed ? c.green(path.relative(root, target)) : muted("no"),
      ),
      row.rule("files"),
      row.gap(),
      ...files.map((file) => {
        const name = file.key.slice(prefix.length + 1);
        return `${name.padEnd(34)}${muted(formatBytes(file.size))}`;
      }),
      row.gap(),
    ],
  });

  ui.hint(
    installed
      ? `already here  ${muted("·")}  ${accent(`reacticx diff ${component.name}`)}`
      : `add it with  ${accent(`reacticx add ${component.name}`)}`,
  );
}
