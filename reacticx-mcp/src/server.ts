import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

import { sourcesUnder } from "./core/collect.js";
import { coreKeyFor, resolveComponentName } from "./core/registry.js";
import { withRegistry, type ServerOptions } from "./core/session.js";
import { registerAddTool } from "./tools/add.js";
import { registerCatalogTools } from "./tools/catalog.js";
import { registerGuideTool } from "./tools/guide.js";
import { registerProjectTools } from "./tools/project.js";

export const VERSION = "0.1.0";

const INSTRUCTIONS = `Reacticx is a copy-paste component library for React Native and Expo: component
source is copied into the project rather than installed from npm.

Discover with list_components, inspect with get_component / get_component_types /
get_component_example, then copy with add_components. get_config shows where files
will land; get_usage_guide explains the whole workflow, including the dependency
rules that trip people up. This server never installs npm packages — add_components
returns the command for you to run.`;

export function createServer(options: ServerOptions) {
  const server = new McpServer(
    { name: "reacticx", version: VERSION },
    { instructions: INSTRUCTIONS },
  );

  registerGuideTool(server, options);
  registerCatalogTools(server, options);
  registerProjectTools(server, options);
  registerAddTool(server, options);

  registerResources(server, options);

  return server;
}

function registerResources(server: McpServer, options: ServerOptions) {
  server.registerResource(
    "registry",
    "reacticx://registry",
    {
      title: "Reacticx registry",
      description: "Every component in the registry, with category and file list",
      mimeType: "application/json",
    },
    async (uri) => {
      const { registry } = await withRegistry(options);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(registry, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "component",
    new ResourceTemplate("reacticx://component/{name}", {
      list: async () => {
        const { registry } = await withRegistry(options);
        return {
          resources: Object.values(registry.components).map((component) => ({
            name: component.name,
            uri: `reacticx://component/${component.name}`,
            description: `${component.category} — ${component.files.length} file(s)`,
            mimeType: "text/markdown",
          })),
        };
      },
    }),
    {
      title: "Reacticx component source",
      description: "The full source of one component, straight from the registry",
      mimeType: "text/markdown",
    },
    async (uri, variables) => {
      const requested = String(variables.name);
      const { registry, client } = await withRegistry(options);

      const resolved = resolveComponentName(registry, requested);
      const component = resolved ? registry.components[resolved] : undefined;
      if (!component) throw new Error(`no component named "${requested}"`);

      const sources = await sourcesUnder(client, coreKeyFor(component));
      const text = [
        `# ${component.name} (${component.category})`,
        "",
        ...sources.map(
          (entry) => `## ${entry.file}\n\n\`\`\`tsx\n${entry.source}\n\`\`\``,
        ),
      ].join("\n");

      return {
        contents: [{ uri: uri.href, mimeType: "text/markdown", text }],
      };
    },
  );
}
