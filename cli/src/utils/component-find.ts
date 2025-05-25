import fs from "fs-extra";
import path from "path";
import { glob } from "glob";
import type { ComponentsRegistry } from "../types/index";

export async function findComponents(
  rootDir: string
): Promise<ComponentsRegistry> {
  const packageDir = __dirname; // directory of the compiled file
  const componentsDir = path.join(packageDir, "../../components");

  if (!fs.existsSync(componentsDir)) {
    console.error(`❌ Components directory not found at: ${componentsDir}`);
    return {};
  }

  const componentDirs = await glob("*/", {
    cwd: componentsDir,
    ignore: ["**/node_modules/**"],
  });

  const components: ComponentsRegistry = {};

  for (const categoryDir of componentDirs) {
    const categoryPath = path.join(componentsDir, categoryDir);

    // Get all component directories within this category
    const componentSubDirs = await glob("*/", {
      cwd: categoryPath,
      ignore: ["**/node_modules/**"],
    });

    for (const dir of componentSubDirs) {
      const componentName = dir.replace("/", "");
      if (!componentName) continue;

      const componentPath = path.join(categoryPath, dir);

      // Check if directory exists
      if (!fs.existsSync(componentPath)) continue;

      // Get all files recursively in the directory and its subdirectories
      const allFiles = await glob("**/*.{ts,tsx}", {
        cwd: componentPath,
        ignore: ["**/node_modules/**"],
      });

      // Map files to their full paths and check if they exist
      const files = allFiles
        .map((file) => {
          const filePath = path.join(componentPath, file);
          return {
            name: file,
            path: filePath,
            exists: fs.existsSync(filePath),
          };
        })
        .filter((file) => file.exists)
        .map(({ name, path }) => ({ name, path }));

      if (files.length > 0) {
        components[componentName.toLowerCase()] = {
          name: componentName,
          description: `from ${categoryDir.replace("/", "")}`,
          files,
        };
      }
    }
  }

  return components;
}
