import type { ListOptions } from "../typings/index.js";
import { RegistryClient, byCategory, loadConfig } from "../core/index.js";
import {
  accent,
  bail,
  c,
  closest,
  muted,
  row,
  ui,
  innerWidth,
} from "../ui/index.js";

export async function list(options: ListOptions) {
  const { config } = await loadConfig();
  const client = new RegistryClient(config);

  if (options.json) {
    const registry = await client.registry();
    console.log(JSON.stringify(registry, null, 2));
    return;
  }

  const spinner = ui.spinner("Reading the registry…");
  let registry;
  try {
    registry = await client.registry();
    spinner.stop();
  } catch (error) {
    spinner.stop();
    bail((error as Error).message);
  }

  const grouped = byCategory(registry);

  if (options.category && !grouped.has(options.category)) {
    const suggestions = closest(options.category, [...grouped.keys()]);
    bail(`no category named ${c.bold(options.category)}`, [
      suggestions.length > 0
        ? `did you mean ${suggestions.map((s) => c.bold(s)).join(", ")}?`
        : `categories: ${[...grouped.keys()].join(", ")}`,
    ]);
  }

  const needle = options.search?.toLowerCase();
  const inner = innerWidth();
  const columns = Math.max(1, Math.floor(inner / 26));
  const rows = [];
  let shown = 0;

  for (const [category, components] of grouped) {
    if (options.category && category !== options.category) continue;

    const matches = needle
      ? components.filter((component) =>
          component.name.toLowerCase().includes(needle),
        )
      : components;
    if (matches.length === 0) continue;

    rows.push(
      row.rule(`${category} ${muted(String(matches.length))}`),
      row.gap(),
    );

    const cell = Math.floor(inner / columns);
    for (let index = 0; index < matches.length; index += columns) {
      rows.push(
        matches
          .slice(index, index + columns)
          .map((component) => component.name.padEnd(cell))
          .join("")
          .trimEnd(),
      );
    }
    rows.push(row.gap());
    shown += matches.length;
  }

  if (shown === 0) {
    ui.box({
      title: "list",
      rows: [
        row.gap(),
        row.warn(`nothing matched ${c.bold(options.search ?? "")}`),
        row.gap(),
      ],
    });
    return;
  }

  ui.box({
    title: "reacticx list",
    badge: `${shown} of ${registry.totalComponents}`,
    rows: [row.gap(), ...rows],
  });

  ui.hint(`add one with  ${accent("reacticx add <component>")}`);
}
