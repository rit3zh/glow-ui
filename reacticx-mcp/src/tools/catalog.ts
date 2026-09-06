import path from "node:path";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { componentDir, pathExists } from "../core/config.js";
import { sourcesUnder } from "../core/collect.js";
import {
  byCategory,
  closest,
  coreKeyFor,
  exampleKeyFor,
  resolveComponentName,
  typesKeyFor,
} from "../core/registry.js";
import { withRegistry, type ServerOptions } from "../core/session.js";
import { failure, fence, formatBytes, guard, json, text } from "./shared.js";

export function registerCatalogTools(server: McpServer, options: ServerOptions) {
  server.registerTool(
    "list_components",
    {
      title: "List Reacticx components",
      description:
        "List every component in the Reacticx registry, optionally filtered by category or a name search. Start here to discover what is available before adding anything.",
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe("only components in this category, e.g. molecules"),
        search: z.string().optional().describe("filter by component name"),
        projectRoot: z
          .string()
          .optional()
          .describe("project whose component.config.json picks the registry"),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guard(async ({ category, search, projectRoot }) => {
      const { registry } = await withRegistry(options, projectRoot);
      const grouped = byCategory(registry);

      if (category && !grouped.has(category)) {
        return failure(`no category named "${category}"`, [
          `categories: ${[...grouped.keys()].join(", ")}`,
        ]);
      }

      const needle = search?.toLowerCase();
      const categories: Record<string, string[]> = {};
      let total = 0;

      for (const [name, components] of grouped) {
        if (category && name !== category) continue;

        const matches = components
          .filter((component) =>
            needle ? component.name.toLowerCase().includes(needle) : true,
          )
          .map((component) => component.name);

        if (matches.length === 0) continue;
        categories[name] = matches;
        total += matches.length;
      }

      return json({
        registryVersion: registry.version,
        totalComponents: registry.totalComponents,
        shown: total,
        categories,
      });
    }),
  );

  server.registerTool(
    "get_component",
    {
      title: "Inspect a Reacticx component",
      description:
        "Metadata for one component — category, files, whether types and an example exist, and whether it is already installed in the project.",
      inputSchema: {
        name: z.string().describe("component name, e.g. accordion"),
        projectRoot: z
          .string()
          .optional()
          .describe("project to check the component against"),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guard(async ({ name, projectRoot }) => {
      const session = await withRegistry(options, projectRoot);
      const { registry, client, config, root } = session;

      const resolved = resolveComponentName(registry, name);
      const component = resolved ? registry.components[resolved] : undefined;
      if (!component) return unknownComponent(name, registry);

      const prefix = coreKeyFor(component);
      const [files, types, examples] = await Promise.all([
        client.filesUnder(prefix),
        client.filesUnder(typesKeyFor(component)),
        client.filesUnder(exampleKeyFor(component)),
      ]);

      const target = componentDir(config, component, root);
      const installed = await pathExists(target);

      return json({
        name: component.name,
        category: component.category,
        source: component.path,
        files: files.map((file) => ({
          file: file.key.slice(prefix.length + 1),
          size: file.size,
        })),
        totalSize: formatBytes(files.reduce((sum, file) => sum + file.size, 0)),
        hasTypes: types.length > 0,
        hasExample: examples.length > 0,
        installed,
        installPath: installed ? path.relative(root, target) : null,
        addWith: `add_components { components: ["${component.name}"] }`,
      });
    }),
  );

  server.registerTool(
    "get_component_source",
    {
      title: "Read a component's source",
      description:
        "The full source of every file in a component, straight from the registry. Use it to understand the API before wiring the component up, or to answer questions without writing files.",
      inputSchema: {
        name: z.string().describe("component name"),
        file: z
          .string()
          .optional()
          .describe("one file only, e.g. index.tsx — omit for all files"),
        projectRoot: z.string().optional(),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guard(async ({ name, file, projectRoot }) => {
      const { registry, client } = await withRegistry(options, projectRoot);

      const resolved = resolveComponentName(registry, name);
      const component = resolved ? registry.components[resolved] : undefined;
      if (!component) return unknownComponent(name, registry);

      const sources = await sourcesUnder(client, coreKeyFor(component));
      const wanted = file
        ? sources.filter((entry) => entry.file === file)
        : sources;

      if (wanted.length === 0) {
        return failure(
          file
            ? `${component.name} has no file named "${file}"`
            : `${component.name} has no files in the registry`,
          sources.length > 0
            ? [`files: ${sources.map((entry) => entry.file).join(", ")}`]
            : [],
        );
      }

      return text(
        [
          `# ${component.name} (${component.category})`,
          `Imports use the \`@/\` aliases of the registry; add_components rewrites them for your project.`,
          "",
          ...wanted.map((entry) => fence(entry.file, entry.source)),
        ].join("\n"),
      );
    }),
  );

  server.registerTool(
    "get_component_example",
    {
      title: "Read a component's example screen",
      description:
        "The example screen for a component — the fastest way to see how its props fit together. Not every component ships one.",
      inputSchema: {
        name: z.string().describe("component name"),
        projectRoot: z.string().optional(),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guard(async ({ name, projectRoot }) => {
      const { registry, client } = await withRegistry(options, projectRoot);

      const resolved = resolveComponentName(registry, name);
      const component = resolved ? registry.components[resolved] : undefined;
      if (!component) return unknownComponent(name, registry);

      const sources = await sourcesUnder(client, exampleKeyFor(component));
      if (sources.length === 0) {
        return failure(`${component.name} has no example in the registry`, [
          "get_component_source shows the implementation instead",
        ]);
      }

      return text(
        [
          `# ${component.name} — example`,
          "",
          ...sources.map((entry) => fence(entry.file, entry.source)),
        ].join("\n"),
      );
    }),
  );

  server.registerTool(
    "get_component_types",
    {
      title: "Read a component's public types",
      description:
        "The published prop types for a component — the reliable answer to 'what props does this take'.",
      inputSchema: {
        name: z.string().describe("component name"),
        projectRoot: z.string().optional(),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    guard(async ({ name, projectRoot }) => {
      const { registry, client } = await withRegistry(options, projectRoot);

      const resolved = resolveComponentName(registry, name);
      const component = resolved ? registry.components[resolved] : undefined;
      if (!component) return unknownComponent(name, registry);

      const sources = await sourcesUnder(client, typesKeyFor(component));
      if (sources.length === 0) {
        return failure(`${component.name} publishes no types`, [
          "get_component_source shows the inline types instead",
        ]);
      }

      return text(
        [
          `# ${component.name} — types`,
          "",
          ...sources.map((entry) => fence(entry.file, entry.source)),
        ].join("\n"),
      );
    }),
  );
}

function unknownComponent(
  name: string,
  registry: { components: Record<string, unknown> },
) {
  const suggestions = closest(name, Object.keys(registry.components));
  return failure(
    `no component named "${name}"`,
    suggestions.length > 0
      ? [`did you mean ${suggestions.join(", ")}?`]
      : ["call list_components to see everything available"],
  );
}
