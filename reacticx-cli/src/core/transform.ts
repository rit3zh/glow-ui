import path from "node:path";

import type { ComponentConfig } from "../typings/index.js";

const SPECIFIER =
  /(from\s+|import\s+|require\s*\(\s*|import\s*\(\s*)(["'])([^"']+)\2/g;

export function readSpecifiers(source: string): string[] {
  const found = new Set<string>();
  for (const match of source.matchAll(SPECIFIER)) found.add(match[3]!);
  return [...found];
}

export function packageFor(specifier: string): string | null {
  if (
    specifier.startsWith(".") ||
    specifier.startsWith("/") ||
    specifier.startsWith("@/") ||
    specifier.startsWith("~/") ||
    specifier.startsWith("node:")
  ) {
    return null;
  }

  const parts = specifier.split("/");
  const name = specifier.startsWith("@")
    ? parts.slice(0, 2).join("/")
    : parts[0]!;
  return name || null;
}

const REWRITES = [
  { prefix: "@/components/", alias: "components" },
  { prefix: "@/utils/", alias: "utils" },
  { prefix: "@/helpers/hooks/", alias: "hooks" },
  { prefix: "@/helpers/", alias: "utils" },
] as const;

export interface RewriteOptions {
  config: ComponentConfig;
  target: string;
  resolved: { components: string; utils: string; hooks: string };
  locate?: (specifier: string) => string | null;
}

export function rewriteImports(
  source: string,
  options: RewriteOptions,
): string {
  const { config, target, resolved, locate } = options;

  return source.replace(
    SPECIFIER,
    (match, lead: string, quote: string, specifier: string) => {
      const rule = REWRITES.find((entry) => specifier.startsWith(entry.prefix));
      if (!rule) return match;

      const rest = specifier.slice(rule.prefix.length);
      const root = resolved[rule.alias];

      const destination =
        (rule.alias === "components" ? locate?.(specifier) : null) ??
        path.join(root, rest);

      const alias = config.aliases[rule.alias];
      if (!alias)
        return `${lead}${quote}${relativeSpecifier(target, destination)}${quote}`;

      const withinRoot = path
        .relative(root, destination)
        .split(path.sep)
        .join("/");

      if (withinRoot.startsWith("..")) {
        return `${lead}${quote}${relativeSpecifier(target, destination)}${quote}`;
      }

      return `${lead}${quote}${alias.replace(/\/+$/, "")}/${withinRoot}${quote}`;
    },
  );
}

function relativeSpecifier(from: string, to: string) {
  const relative = path
    .relative(path.dirname(from), to)
    .split(path.sep)
    .join("/");

  return relative.startsWith(".") ? relative : `./${relative}`;
}

export function resolvedAliasDirs(config: ComponentConfig, root: string) {
  return {
    components: path.join(root, config.outDir),
    utils: path.join(root, config.paths.utils),
    hooks: path.join(root, config.paths.hooks),
  };
}

export function isTextFile(fileName: string) {
  return /\.(tsx?|jsx?|mjs|cjs|json|md|mdx|css)$/i.test(fileName);
}
