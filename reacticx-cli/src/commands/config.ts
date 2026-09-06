import path from "node:path";

import {
  CONFIG_FILE,
  RegistryClient,
  defaults,
  loadConfig,
  resolvePackageManager,
  validate,
} from "../core/index.js";
import { accent, c, muted, row, ui } from "../ui/index.js";

export async function config(options: {
  json?: boolean;
  clearCache?: boolean;
}) {
  const root = process.cwd();
  const { config: resolved, filePath } = await loadConfig(root);

  if (options.json) {
    console.log(JSON.stringify(resolved, null, 2));
    return;
  }

  if (options.clearCache) await new RegistryClient(resolved).clearCache();

  const problems = validate(resolved);
  const rows = [row.gap()];

  if (!filePath) {
    rows.push(
      row.warn(`no ${CONFIG_FILE} here — these are the defaults`),
      row.dim(`write one with  reacticx init`),
      row.gap(),
    );
  }

  rows.push(
    row.field("outDir", resolved.outDir),
    row.field("structure", resolved.structure),
    row.field("typescript", String(resolved.typescript)),
    row.field("overwrite", String(resolved.overwrite)),
    row.field(
      "packageManager",
      resolved.packageManager === "auto"
        ? `${resolvePackageManager("auto", root)} ${muted("· auto")}`
        : resolved.packageManager,
    ),
    row.field("install deps", resolved.installDependencies),
    row.rule("aliases"),
    row.gap(),
  );

  for (const [key, value] of Object.entries(resolved.aliases)) {
    rows.push(row.field(key, value || muted("relative imports"), 16));
  }

  rows.push(row.rule("paths"), row.gap());
  for (const [key, value] of Object.entries(resolved.paths)) {
    rows.push(row.field(key, value, 16));
  }

  rows.push(row.rule("include"), row.gap());
  for (const [key, value] of Object.entries(resolved.include)) {
    rows.push(row.field(key, value ? c.green("yes") : muted("no"), 16));
  }

  rows.push(
    row.rule("registry"),
    row.gap(),
    row.field("origin", resolved.registry.origin, 16),
    row.field("index", resolved.registry.index, 16),
    row.field("registry", resolved.registry.registry, 16),
    row.field(
      "cache",
      resolved.registry.cache === false
        ? muted("off")
        : `${resolved.registry.cache}s`,
      16,
    ),
    row.gap(),
  );

  if (options.clearCache)
    rows.push(row.ok("registry cache cleared"), row.gap());

  if (problems.length > 0) {
    rows.push(...problems.map((problem) => row.fail(problem)), row.gap());
  }

  ui.box({
    title: "reacticx config",
    badge: filePath ? path.relative(root, filePath) : "defaults",
    color: problems.length > 0 ? c.red : undefined,
    rows,
  });

  if (problems.length > 0) {
    ui.hint("invalid — fix the fields above");
    process.exitCode = 1;
    return;
  }

  ui.hint(
    `valid${filePath ? "" : `  ${muted("·")}  ${accent("reacticx init")} to write a config`}`,
  );
}

export { defaults };
