import path from "node:path";
import process from "node:process";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer, VERSION } from "./server.js";
import type { ServerOptions } from "./core/session.js";

const HELP = `reacticx-mcp ${VERSION} — Model Context Protocol server for Reacticx

  npx @reacticx/mcp [options]

Options
  --root <path>        project the write tools act on         (default: cwd)
  --read-only          expose the registry, refuse every write
  --registry <origin>  registry origin, overriding the project config
  --cache <seconds>    registry cache TTL
  --no-cache           always refetch the registry
  -v, --version        print the version
  -h, --help           print this

The server speaks MCP over stdio. Register it with a client, for example:

  claude mcp add reacticx -- npx -y @reacticx/mcp

or in an mcp.json / claude_desktop_config.json:

  { "mcpServers": { "reacticx": { "command": "npx", "args": ["-y", "@reacticx/mcp"] } } }
`;

function parseArgs(argv: string[]): ServerOptions | "help" | "version" {
  const options: ServerOptions = {
    root: process.env.REACTICX_MCP_ROOT
      ? path.resolve(process.env.REACTICX_MCP_ROOT)
      : process.cwd(),
    readOnly: process.env.REACTICX_MCP_READ_ONLY === "1",
    origin: process.env.REACTICX_MCP_REGISTRY,
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]!;

    switch (arg) {
      case "-h":
      case "--help":
        return "help";
      case "-v":
      case "--version":
        return "version";
      case "--read-only":
      case "--readonly":
        options.readOnly = true;
        break;
      case "--no-cache":
        options.cache = false;
        break;
      case "--root":
        options.root = path.resolve(requireValue(argv, ++index, "--root"));
        break;
      case "--registry":
        options.origin = requireValue(argv, ++index, "--registry").replace(
          /\/+$/,
          "",
        );
        break;
      case "--cache": {
        const raw = requireValue(argv, index + 1, "--cache");
        index += 1;
        const seconds = Number(raw);
        if (!Number.isFinite(seconds) || seconds < 0) {
          throw new Error(`--cache expects a number of seconds, got "${raw}"`);
        }
        options.cache = seconds;
        break;
      }
      default:
        if (arg.startsWith("-")) throw new Error(`unknown option "${arg}"`);
        throw new Error(`unexpected argument "${arg}"`);
    }
  }

  return options;
}

function requireValue(argv: string[], index: number, flag: string) {
  const value = argv[index];
  if (!value || value.startsWith("-")) {
    throw new Error(`${flag} expects a value`);
  }
  return value;
}

async function main() {
  let parsed: ReturnType<typeof parseArgs>;
  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`reacticx-mcp: ${(error as Error).message}\n`);
    process.exit(1);
  }

  if (parsed === "help") {
    process.stdout.write(HELP);
    return;
  }
  if (parsed === "version") {
    process.stdout.write(`${VERSION}\n`);
    return;
  }

  const server = createServer(parsed);
  await server.connect(new StdioServerTransport());

  // stdout belongs to the protocol — anything human-readable goes to stderr.
  process.stderr.write(
    `reacticx-mcp ${VERSION} ready on stdio — root ${parsed.root}${
      parsed.readOnly ? " (read-only)" : ""
    }\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`reacticx-mcp: ${(error as Error).message}\n`);
  process.exit(1);
});
