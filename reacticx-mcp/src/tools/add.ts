import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { collect, type CollectedFile } from "../core/collect.js";
import { CONFIG_FILE, pathExists } from "../core/config.js";
import {
  findMissingDependencies,
  installCommand,
  resolvePackageManager,
} from "../core/deps.js";
import { closest, resolveComponentName } from "../core/registry.js";
import {
  assertInside,
  assertWritable,
  withRegistry,
  type ServerOptions,
} from "../core/session.js";
import {
  componentLocator,
  resolvedAliasDirs,
  rewriteImports,
} from "../core/transform.js";
import type { ComponentConfig } from "../core/types.js";
import { failure, formatBytes, guard, json } from "./shared.js";

export function registerAddTool(server: McpServer, options: ServerOptions) {
  server.registerTool(
    "add_components",
    {
      title: "Add Reacticx components to a project",
      description:
        "Copy components into the project — the MCP equivalent of `reacticx add`. Files land in the configured outDir, `@/` imports are rewritten to the project's aliases, and components the request depends on are pulled in too. Missing npm packages are reported, never installed: run the returned command yourself. Use dryRun first when you are unsure where files will land.",
      inputSchema: {
        components: z
          .array(z.string())
          .min(1)
          .describe("component names, e.g. [\"accordion\", \"pressable\"]"),
        projectRoot: z
          .string()
          .optional()
          .describe("project to write into; defaults to the server's root"),
        dir: z
          .string()
          .optional()
          .describe("write here instead of the configured outDir, relative to the project root"),
        includeTypes: z.boolean().optional().describe("also copy published types"),
        includeExamples: z
          .boolean()
          .optional()
          .describe("also copy the example screen"),
        followDependencies: z
          .boolean()
          .optional()
          .describe("pull in components and helpers the files import (default true)"),
        overwrite: z
          .boolean()
          .optional()
          .describe("replace files that already exist (default false)"),
        dryRun: z
          .boolean()
          .optional()
          .describe("report the plan and write nothing"),
      },
      annotations: {
        title: "Add Reacticx components",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    guard(async (args) => {
      const dryRun = args.dryRun ?? false;
      if (!dryRun) assertWritable(options);

      const session = await withRegistry(options, args.projectRoot);
      const { registry, client, root, filePath } = session;

      const config: ComponentConfig = {
        ...session.config,
        outDir: args.dir ?? session.config.outDir,
        overwrite: args.overwrite ?? session.config.overwrite,
        include: {
          types: args.includeTypes ?? session.config.include.types,
          examples: args.includeExamples ?? session.config.include.examples,
          dependencies:
            args.followDependencies ?? session.config.include.dependencies,
        },
      };

      if (path.isAbsolute(config.outDir)) {
        return failure(`"dir" must be relative to the project root`);
      }

      const unknown = args.components.filter(
        (name) => !resolveComponentName(registry, name),
      );
      if (unknown.length > 0) {
        const suggestions = closest(unknown[0]!, Object.keys(registry.components));
        return failure(
          `no component named "${unknown[0]}"`,
          suggestions.length > 0
            ? [`did you mean ${suggestions.join(", ")}?`]
            : ["call list_components to see everything available"],
        );
      }

      const selected = args.components.map(
        (name) => resolveComponentName(registry, name)!,
      );

      const { groups, unresolved } = await collect(selected, {
        client,
        registry,
        config,
        root,
        include: config.include,
      });

      const files = groups.flatMap((group) => group.files);
      if (files.length === 0) {
        return failure("the registry returned no files for that request");
      }

      const resolved = resolvedAliasDirs(config, root);
      const locate = componentLocator(registry, config, root);
      const written: { display: string; source: string }[] = [];

      for (const file of files) {
        assertInside(root, file.target);
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
      const blocked = existing.length > 0 && !config.overwrite;

      let applied: CollectedFile[] = [];
      if (!dryRun && !blocked) {
        for (const file of files) {
          await fs.mkdir(path.dirname(file.target), { recursive: true });
          await fs.writeFile(file.target, file.body);
        }
        applied = files;
      }

      const missing = await findMissingDependencies(written, root);
      const pm = await resolvePackageManager(config.packageManager, root);

      return json({
        status: dryRun
          ? "dry-run"
          : blocked
            ? "blocked"
            : "written",
        ...(blocked && !dryRun
          ? {
              reason: `${existing.length} file(s) already exist — call again with overwrite: true to replace them`,
            }
          : {}),
        projectRoot: root,
        outDir: config.outDir,
        components: selected,
        groups: groups.map((group) => ({
          kind: group.kind,
          name: group.name,
          reason: group.reason,
          files: group.files.map((file) => file.display),
        })),
        fileCount: files.length,
        totalSize: formatBytes(files.reduce((sum, file) => sum + file.size, 0)),
        filesWritten: applied.map((file) => file.display),
        existingFiles: existing.map((file) => file.display),
        unresolvedImports: unresolved,
        missingPackages: missing,
        installCommand:
          missing.length > 0
            ? installCommand(
                pm,
                missing.map((entry) => entry.name),
              )
            : null,
        notes: [
          ...(filePath ? [] : [`no ${CONFIG_FILE} found — defaults were used`]),
          ...(missing.length > 0
            ? [
                "native dependencies need a rebuild (e.g. npx expo run:ios), not just a Metro restart",
              ]
            : []),
        ],
      });
    }),
  );
}

async function filterExisting(files: CollectedFile[]) {
  const found: CollectedFile[] = [];
  for (const file of files) {
    if (await pathExists(file.target)) found.push(file);
  }
  return found;
}
