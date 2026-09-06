import path from "node:path";

import { componentDir } from "./config.js";
import {
  RegistryClient,
  componentForSpecifier,
  coreKeyFor,
  exampleKeyFor,
  sharedModuleFor,
  typesKeyFor,
} from "./registry.js";
import { isTextFile, readSpecifiers } from "./transform.js";
import type {
  BucketFile,
  ComponentConfig,
  PlanKind,
  Registry,
} from "./types.js";

export interface CollectedFile {
  key: string;
  target: string;
  display: string;
  body: Buffer;
  size: number;
  text: boolean;
}

export interface CollectedGroup {
  kind: PlanKind;
  name: string;
  reason?: string;
  files: CollectedFile[];
}

export interface CollectResult {
  groups: CollectedGroup[];
  unresolved: { specifier: string; from: string }[];
}

export interface CollectContext {
  client: RegistryClient;
  registry: Registry;
  config: ComponentConfig;
  root: string;
  include: { types: boolean; examples: boolean; dependencies: boolean };
}

export async function collect(
  names: string[],
  context: CollectContext,
): Promise<CollectResult> {
  const groups: CollectedGroup[] = [];
  const unresolved: CollectResult["unresolved"] = [];

  const seenComponents = new Set<string>();
  const seenShared = new Set<string>();

  const queue = names.map((name) => ({
    name,
    reason: undefined as string | undefined,
  }));

  while (queue.length > 0) {
    const { name, reason } = queue.shift()!;
    if (seenComponents.has(name)) continue;
    seenComponents.add(name);

    const component = context.registry.components[name];
    if (!component) continue;

    const files = await fetchPrefix(
      context,
      coreKeyFor(component),
      componentDir(context.config, component, context.root),
    );

    groups.push({ kind: "component", name, reason, files });

    if (context.include.types) {
      const typeFiles = await fetchPrefix(
        context,
        typesKeyFor(component),
        path.join(context.root, context.config.paths.types, name),
      );
      if (typeFiles.length > 0) {
        groups.push({ kind: "types", name, files: typeFiles });
      }
    }

    if (context.include.examples) {
      const exampleFiles = await fetchPrefix(
        context,
        exampleKeyFor(component),
        path.join(context.root, context.config.paths.examples, name),
      );
      if (exampleFiles.length > 0) {
        groups.push({ kind: "example", name, files: exampleFiles });
      }
    }

    if (!context.include.dependencies) continue;

    for (const specifier of specifiersIn(files)) {
      const dependency = componentForSpecifier(specifier, context.registry);
      if (dependency) {
        if (!seenComponents.has(dependency.name)) {
          queue.push({ name: dependency.name, reason: `required by ${name}` });
        }
        continue;
      }

      const shared = sharedModuleFor(specifier);
      if (!shared) {
        unresolved.push({ specifier, from: name });
        continue;
      }
      if (seenShared.has(shared.prefix)) continue;
      seenShared.add(shared.prefix);

      const base =
        shared.kind === "hooks"
          ? context.config.paths.hooks
          : context.config.paths.utils;
      const sharedFiles = await fetchPrefix(
        context,
        shared.prefix,
        path.join(context.root, base, shared.name),
      );

      if (sharedFiles.length === 0) {
        unresolved.push({ specifier, from: name });
        continue;
      }

      groups.push({
        kind: "shared",
        name: shared.name,
        reason: `required by ${name}`,
        files: sharedFiles,
      });
    }
  }

  return { groups, unresolved };
}

async function fetchPrefix(
  context: CollectContext,
  prefix: string,
  targetDir: string,
): Promise<CollectedFile[]> {
  const listed = await context.client.filesUnder(prefix);

  return Promise.all(
    listed.map(async (file) => toCollected(context, file, prefix, targetDir)),
  );
}

async function toCollected(
  context: CollectContext,
  file: BucketFile,
  prefix: string,
  targetDir: string,
): Promise<CollectedFile> {
  const relative = file.key.slice(prefix.replace(/\/+$/, "").length + 1);
  const target = path.join(targetDir, ...relative.split("/"));

  return {
    key: file.key,
    target,
    display: path.relative(context.root, target),
    body: await context.client.file(file),
    size: file.size,
    text: isTextFile(file.key),
  };
}

function specifiersIn(files: CollectedFile[]): string[] {
  const found = new Set<string>();

  for (const file of files) {
    if (!file.text) continue;
    for (const specifier of readSpecifiers(file.body.toString("utf8"))) {
      if (specifier.startsWith("@/")) found.add(specifier);
    }
  }

  return [...found];
}

export async function sourcesUnder(
  client: RegistryClient,
  prefix: string,
): Promise<{ file: string; size: number; source: string }[]> {
  const listed = await client.filesUnder(prefix);
  const base = prefix.replace(/\/+$/, "");

  return Promise.all(
    listed.map(async (file) => ({
      file: file.key.slice(base.length + 1),
      size: file.size,
      source: (await client.file(file)).toString("utf8"),
    })),
  );
}
