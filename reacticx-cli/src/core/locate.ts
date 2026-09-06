import path from "node:path";

import type { ComponentConfig, Registry } from "../typings/index.js";
import { componentDir } from "./config.js";
import { componentForSpecifier } from "./registry.js";

export function componentLocator(
  registry: Registry,
  config: ComponentConfig,
  root: string,
) {
  return (specifier: string): string | null => {
    const component = componentForSpecifier(specifier, registry);
    if (!component) return null;

    const target = `src/${specifier.slice(2).replace(/\/+$/, "")}`;
    const suffix = target.slice(component.path.length).replace(/^\//, "");
    const dir = componentDir(config, component, root);

    return suffix ? path.join(dir, ...suffix.split("/")) : dir;
  };
}
