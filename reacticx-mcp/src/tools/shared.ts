import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function text(value: string): CallToolResult {
  return { content: [{ type: "text", text: value }] };
}

export function json(value: unknown): CallToolResult {
  return text(JSON.stringify(value, null, 2));
}

export function failure(message: string, hints: string[] = []): CallToolResult {
  const lines = [message, ...hints.map((hint) => `hint: ${hint}`)];
  return { content: [{ type: "text", text: lines.join("\n") }], isError: true };
}

/** Wrap a tool handler so thrown errors come back as tool errors, not transport errors. */
export function guard<A>(
  handler: (args: A) => Promise<CallToolResult>,
): (args: A) => Promise<CallToolResult> {
  return async (args) => {
    try {
      return await handler(args);
    } catch (error) {
      return failure((error as Error).message);
    }
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fence(file: string, source: string) {
  const language = /\.tsx?$/.test(file)
    ? file.endsWith("x")
      ? "tsx"
      : "ts"
    : /\.jsx?$/.test(file)
      ? "jsx"
      : /\.json$/.test(file)
        ? "json"
        : "";

  return `### ${file}\n\n\`\`\`${language}\n${source}\n\`\`\``;
}
