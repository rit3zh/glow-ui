import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import {
  CONFIG_FILE,
  componentDir,
  configPath,
  defaults,
  pathExists,
  serializeConfig,
  validate,
  writeConfig,
} from "../core/config.js";
import { coreKeyFor, resolveComponentName } from "../core/registry.js";
import {
  assertWritable,
  withRegistry,
  type ServerOptions,
} from "../core/session.js";
import {
  componentLocator,
  isTextFile,
  resolvedAliasDirs,
  rewriteImports,
} from "../core/transform.js";
import type { ComponentConfig } from "../core/types.js";
import { failure, guard, json } from "./shared.js";

export function registerProjectTools(server: McpServer, options: ServerOptions) {
  server.registerTool(
    "get_config",
    {
      title: "Show the resolved Reacticx config",
      description:
        "The configuration a project resolves to — every default filled in — plus whether a component.config.json actually exists. Check this before adding components so you know where files will land.",
      inputSchema: { projectRoot: z.string().optional() },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    guard(async ({ projectRoot }) => {
      const session = await withRegistry(options, projectRoot);

      return json({
        projectRoot: session.root,
        configFile: session.filePath,
        hasConfigFile: session.filePath !== null,
        readOnlyServer: options.readOnly,
        registryVersion: session.registry.version,
        totalComponents: session.registry.totalComponents,
        config: session.config,
      });
    }),
  );

  server.registerTool(
    "init_config",
    {
      title: "Write component.config.json",
      description:
        "Create component.config.json for a project — the MCP equivalent of `reacticx init`. Only values that differ from the defaults are written.",
      inputSchema: {
        projectRoot: z.string().optional(),
        outDir: z
          .string()
          .optional()
          .describe("where components go, e.g. src/components/ui"),
        structure: z
          .enum(["category", "flat", "mirror"])
          .optional()
          .describe("category: outDir/<category>/<name> (default)"),
        componentsAlias: z
          .string()
          .optional()
          .describe("import alias for outDir, e.g. @/components/ui"),
        typescript: z.boolean().optional(),
        installDependencies: z.enum(["auto", "prompt", "never"]).optional(),
        packageManager: z.enum(["auto", "bun", "pnpm", "yarn", "npm"]).optional(),
        force: z.boolean().optional().describe("replace an existing config"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    guard(async (args) => {
      assertWritable(options);

      const session = await withRegistry(options, args.projectRoot);
      const target = configPath(session.root);

      if ((await pathExists(target)) && !args.force) {
        return failure(`${CONFIG_FILE} already exists in ${session.root}`, [
          "pass force: true to replace it, or get_config to see it",
        ]);
      }

      const outDir = args.outDir ?? defaults.outDir;
      const config: ComponentConfig = {
        ...defaults,
        outDir,
        structure: args.structure ?? defaults.structure,
        typescript: args.typescript ?? defaults.typescript,
        packageManager: args.packageManager ?? defaults.packageManager,
        installDependencies:
          args.installDependencies ?? defaults.installDependencies,
        aliases: {
          ...defaults.aliases,
          components: args.componentsAlias ?? defaults.aliases.components,
        },
      };

      const problems = validate(config);
      if (problems.length > 0) {
        return failure(`that configuration is invalid:\n  - ${problems.join("\n  - ")}`);
      }

      const filePath = await writeConfig(config, session.root);

      return json({
        status: "written",
        configFile: filePath,
        contents: serializeConfig(config),
      });
    }),
  );

  server.registerTool(
    "list_installed_components",
    {
      title: "List installed components",
      description:
        "Which registry components already exist in the project, and where. Call this before adding so you do not copy something twice.",
      inputSchema: { projectRoot: z.string().optional() },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    guard(async ({ projectRoot }) => {
      const session = await withRegistry(options, projectRoot);
      const { registry, config, root } = session;

      const installed: { name: string; category: string; path: string }[] = [];

      for (const component of Object.values(registry.components)) {
        const dir = componentDir(config, component, root);
        if (await pathExists(dir)) {
          installed.push({
            name: component.name,
            category: component.category,
            path: path.relative(root, dir),
          });
        }
      }

      return json({
        projectRoot: root,
        outDir: config.outDir,
        count: installed.length,
        installed: installed.sort((a, b) => a.name.localeCompare(b.name)),
      });
    }),
  );

  server.registerTool(
    "diff_components",
    {
      title: "Compare installed components with the registry",
      description:
        "Report which installed component files drift from the registry version — modified locally, or missing entirely. Import rewrites are applied before comparing, so only real edits show up.",
      inputSchema: {
        name: z
          .string()
          .optional()
          .describe("one component — omit to check everything installed"),
        projectRoot: z.string().optional(),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guard(async ({ name, projectRoot }) => {
      const session = await withRegistry(options, projectRoot);
      const { registry, client, config, root } = session;

      const candidates = name
        ? [resolveComponentName(registry, name) ?? name]
        : Object.keys(registry.components);

      const resolved = resolvedAliasDirs(config, root);
      const locate = componentLocator(registry, config, root);

      const report: {
        name: string;
        modified: string[];
        missing: string[];
      }[] = [];
      let checked = 0;

      for (const candidate of candidates) {
        const component = registry.components[candidate];
        if (!component) return failure(`no component named "${candidate}"`);

        const dir = componentDir(config, component, root);
        if (!(await pathExists(dir))) {
          if (name) {
            return failure(`${candidate} is not installed in ${config.outDir}`);
          }
          continue;
        }

        checked += 1;
        const prefix = coreKeyFor(component);
        const modified: string[] = [];
        const missing: string[] = [];

        for (const file of await client.filesUnder(prefix)) {
          const relative = file.key.slice(prefix.length + 1);
          const target = path.join(dir, ...relative.split("/"));

          if (!(await pathExists(target))) {
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

          if (!local.equals(upstream)) modified.push(relative);
        }

        if (modified.length > 0 || missing.length > 0) {
          report.push({ name: candidate, modified, missing });
        }
      }

      return json({
        projectRoot: root,
        checked,
        inSync: report.length === 0,
        drifted: report,
        ...(report.length > 0
          ? {
              hint: "add_components with overwrite: true takes the registry version",
            }
          : {}),
      });
    }),
  );
}
