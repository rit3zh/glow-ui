#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import os from "os";
import { findComponents } from "./utils/component-find";
import cliProgress from "cli-progress";
import chalk from "chalk";

const program = new Command();

async function loadConfig(rootDir: string) {
  const localConfigPath = path.join(rootDir, "component.config.json");
  const homeConfigPath = path.join(os.homedir(), ".component.config.json");

  let config = {};
  let configSource = "";

  if (await fs.pathExists(homeConfigPath)) {
    config = await fs.readJson(homeConfigPath);
    configSource = homeConfigPath;
  }

  if (await fs.pathExists(localConfigPath)) {
    const local = await fs.readJson(localConfigPath);
    config = { ...config, ...local };
    configSource = localConfigPath;
  }

  return { config, configSource } as any;
}

program
  .name("rn-glow")
  .description("✨ Add UI components to your project with style")
  .version("1.0.0");

// Add list command
program
  .command("list")
  .description("📋 List all available components")
  .action(async () => {
    const rootDir = process.cwd();
    const components = await findComponents(rootDir);

    if (Object.keys(components).length === 0) {
      console.log("❌ No components found.");
      return;
    }

    console.log("\n📦 Available Components:");
    console.log("----------------------");

    // Group components by category
    const categories: { [key: string]: string[] } = {};

    Object.entries(components).forEach(([key, component]) => {
      const category = component.description.replace("from ", "");
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(component.name);
    });

    // Display components by category
    Object.entries(categories).forEach(([category, components]) => {
      console.log(`\n${chalk.cyan(category.toUpperCase())}:`);
      components.forEach((component) => {
        console.log(`  • ${chalk.green(component)}`);
      });
    });

    console.log("\n💡 Use 'rn-glow add <component-name>' to add a component");
  });

program
  .command("add")
  .argument("<componentName>", "🔍 The name of the component to copy")
  .option("--outdir <path>", "📁 Output directory to copy the component to")
  .action(async (componentName: string, options: { outdir?: string }) => {
    const rootDir = process.cwd();
    const { config, configSource } = await loadConfig(rootDir);
    const outDir = options.outdir || config.outDir || "components";

    // 🔍 Show config detection
    if (configSource) {
      console.log(`🛠️ Using config from ${chalk.cyan(configSource)}`);
    } else {
      console.log("⚠️  No config file detected, using default settings.");
    }

    // 📁 Validate output directory
    const outputPath = path.join(rootDir, outDir);
    try {
      await fs.ensureDir(outputPath);
    } catch (err) {
      console.error(`❌ Invalid output directory: ${outDir}`);
      process.exit(1);
    }

    const components = await findComponents(rootDir);

    const matchedEntry = Object.entries(components).find(
      ([key]) => key.toLowerCase() === componentName.toLowerCase()
    );

    if (!matchedEntry) {
      console.error(`❌ Component "${componentName}" not found.`);
      console.log("\n💡 Use 'rn-glow list' to see all available components");
      process.exit(1);
    }

    const [_, componentValue] = matchedEntry;
    const destinationBase = path.join(outputPath, componentName);

    if (await fs.pathExists(destinationBase)) {
      console.error(
        `🚫 Component "${componentName}" already exists at: ${chalk.red(
          path.relative(rootDir, destinationBase)
        )}`
      );
      process.exit(1);
    }

    console.log(`📦 Copying component: ${chalk.green(componentName)}`);
    console.log(`📁 Output directory: ${chalk.yellow(outDir)}`);

    // 🧭 Initialize progress bar
    const bar = new cliProgress.SingleBar(
      {
        format: "📦 {bar} {percentage}% | {value}/{total} files",
        barCompleteChar: "█",
        barIncompleteChar: "-",
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    );

    bar.start(componentValue.files.length, 0);

    for (const file of componentValue.files) {
      const sourcePath = file.path;
      const componentRootIndex = file.path
        .toLowerCase()
        .indexOf(componentName.toLowerCase());

      const relativeSubPath = file.path.slice(
        componentRootIndex + componentName.length + 1
      );

      const destPath = path.join(destinationBase, relativeSubPath);

      await fs.ensureDir(path.dirname(destPath));
      await fs.copyFile(sourcePath, destPath);

      bar.increment();
    }

    bar.stop();

    console.log(
      `🎉 Done! Component "${chalk.green(componentName)}" added to ${chalk.yellow(
        path.relative(rootDir, destinationBase)
      )}`
    );
  });

program.parse();
