import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { withRegistry, type ServerOptions } from "../core/session.js";
import { guard, text } from "./shared.js";

const GUIDE = `# Working with Reacticx

Reacticx is a copy-paste component library for React Native and Expo. There is
no runtime package to install — component source is copied into the project and
becomes yours to edit.

## The workflow

1. \`get_config\` — see where components will land (outDir, aliases, structure).
   Call \`init_config\` first if the project has no component.config.json.
2. \`list_components\` — find candidates by category or name.
3. \`get_component\` / \`get_component_types\` / \`get_component_example\` — check
   the API before committing to one.
4. \`add_components\` — copy it in. Pass \`dryRun: true\` first when the target
   directory matters, then again without it.
5. Install the packages \`add_components\` reports as missing, using the command
   it returns. The server never installs anything itself.
6. Import from the configured alias and type-check.

## What add_components does for you

- Rewrites the registry's \`@/components\`, \`@/utils\` and \`@/helpers\` imports to
  the project's own aliases, falling back to relative paths when no alias fits.
- Follows imports into other registry components and shared helpers, copying
  those too (\`followDependencies\`, on by default).
- Refuses to clobber existing files unless \`overwrite: true\` is passed.
- Verifies every download against the registry checksum.

## Dependencies

- Components lean on the usual React Native animation stack: Reanimated,
  Gesture Handler, Skia, and friends.
- Skia is published as \`@shopify/react-native-skia\`.
- \`react-native-blur\` here is the GitHub fork: install
  \`sbaiahmed1/react-native-blur\`, not the npm package of the same name.
- After adding any native dependency, rebuild the native target
  (\`npx expo run:ios\`). Restarting Metro is not enough.

## Common mistakes

- Adding a component that is already installed — check
  \`list_installed_components\` first.
- Installing \`react-native-blur\` from npm instead of the fork.
- Skipping the native rebuild after a native dependency lands.
- Editing an installed component and then re-adding it with \`overwrite: true\`,
  which discards those edits. \`diff_components\` shows what would be lost.

## The CLI equivalent

Everything here mirrors the \`reacticx\` CLI: \`reacticx init\`, \`reacticx add\`,
\`reacticx list\`, \`reacticx info\`, \`reacticx diff\`. Use the CLI when a human is
driving a terminal; use these tools when an agent is.`;

export function registerGuideTool(server: McpServer, options: ServerOptions) {
  server.registerTool(
    "get_usage_guide",
    {
      title: "How to use Reacticx",
      description:
        "The workflow for adding Reacticx components to a React Native or Expo project — tool order, import rewriting, dependency handling, and the mistakes that bite. Read this before the first add_components call in a session.",
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    guard(async () => text(GUIDE)),
  );

  server.registerTool(
    "refresh_registry",
    {
      title: "Refresh the cached registry",
      description:
        "Drop the cached registry and file index and refetch them. Use it when a component was published after this server started and list_components does not show it yet.",
      inputSchema: { projectRoot: z.string().optional() },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    guard(async ({ projectRoot }) => {
      const first = await withRegistry(options, projectRoot);
      await first.client.clearCache();

      const refreshed = await withRegistry(options, projectRoot);
      return text(
        `registry refreshed — version ${refreshed.registry.version}, ${refreshed.registry.totalComponents} components`,
      );
    }),
  );
}
