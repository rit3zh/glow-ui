import path from "node:path";

import { loadConfig, type LoadedConfig } from "./config.js";
import { RegistryClient } from "./registry.js";
import type { ComponentConfig, Registry } from "./types.js";

export interface ServerOptions {
  /** Default project root for tools that touch the filesystem. */
  root: string;
  /** When true, no tool may write to disk. */
  readOnly: boolean;
  /** Overrides registry.origin from component.config.json. */
  origin?: string;
  /** Overrides registry.cache — seconds, or false to always refetch. */
  cache?: number | false;
}

export interface Session extends LoadedConfig {
  client: RegistryClient;
  options: ServerOptions;
}

/**
 * Resolve the project a tool call is about: an explicit `projectRoot`
 * argument wins, otherwise the root the server was started with.
 */
export function resolveRoot(options: ServerOptions, projectRoot?: string) {
  if (!projectRoot) return options.root;
  return path.resolve(options.root, projectRoot);
}

export async function openSession(
  options: ServerOptions,
  projectRoot?: string,
): Promise<Session> {
  const root = resolveRoot(options, projectRoot);
  const loaded = await loadConfig(root);

  const config: ComponentConfig = {
    ...loaded.config,
    registry: {
      ...loaded.config.registry,
      origin: options.origin ?? loaded.config.registry.origin,
      cache: options.cache ?? loaded.config.registry.cache,
    },
  };

  return {
    ...loaded,
    config,
    client: new RegistryClient(config),
    options,
  };
}

export async function withRegistry(
  options: ServerOptions,
  projectRoot?: string,
): Promise<Session & { registry: Registry }> {
  const session = await openSession(options, projectRoot);
  const registry = await session.client.registry();
  return { ...session, registry };
}

export function assertWritable(options: ServerOptions) {
  if (options.readOnly) {
    throw new Error(
      "this server runs in --read-only mode; it can inspect the registry but not write files",
    );
  }
}

/** Keep writes inside the project root — no traversal via `dir`. */
export function assertInside(root: string, target: string) {
  const relative = path.relative(root, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `refusing to write outside the project root: ${target}`,
    );
  }
}
