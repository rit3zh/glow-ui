import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import type { ComponentFile } from "../commands/types";

export async function copyComponentFiles(
  rootDir: string,
  cwd: string,
  files: ComponentFile[]
): Promise<void> {
  for (const file of files) {
    const sourcePath = path.join(rootDir, file.path);
    const targetPath = path.join(cwd, file.path);

    // Double check if source file exists before copying
    if (!fs.existsSync(sourcePath)) {
      console.warn(
        chalk.yellow(
          `Warning: Source file ${file.path} does not exist, skipping...`
        )
      );
      continue;
    }

    // Ensure the target directory exists
    await fs.ensureDir(path.dirname(targetPath));

    // Copy the file
    await fs.copy(sourcePath, targetPath);
    console.log(chalk.green(`✓ Added ${file.name} to ${file.path}`));
  }
}
