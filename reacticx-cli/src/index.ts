#!/usr/bin/env node

import { Command } from "commander";

import {
  add,
  config,
  create,
  diff,
  info,
  init,
  list,
  remove,
} from "./commands/index.js";
import { commandHelp, landing } from "./ui/help.js";
import { bail, closest } from "./ui/index.js";

const VERSION = "0.2.0";

const COMMAND_NAMES = [
  "init",
  "add",
  "list",
  "info",
  "diff",
  "remove",
  "config",
  "create",
];

function reportError(message: string) {
  const text = message
    .replace(/^error:\s*/i, "")
    .split("\n")[0]!
    .trim();
  const unknown = /unknown command '([^']+)'/.exec(text);

  if (unknown) {
    const suggestions = closest(unknown[1]!, COMMAND_NAMES, 3);
    bail(text, [
      suggestions.length > 0
        ? `did you mean ${suggestions.join(", ")}?`
        : "run reacticx for the list of commands",
    ]);
  }

  bail(text, ["reacticx <command> --help lists the flags"]);
}

const program = new Command();

program
  .name("reacticx")
  .version(VERSION, "-v, --version")
  .helpOption("-h, --help", "show help")
  .showHelpAfterError(false)
  .configureHelp({ formatHelp: () => "" })
  .configureOutput({ outputError: (text) => reportError(text) });

program.addHelpText("beforeAll", () => {
  landing(VERSION);
  return "";
});

function define(name: string, description: string) {
  const command = program.command(name).description(description);

  command.configureHelp({ formatHelp: () => "" });
  command.configureOutput({ outputError: (text) => reportError(text) });
  command.addHelpText("beforeAll", () => {
    commandHelp(command, VERSION);
    return "";
  });

  return command;
}

define("init", "write component.config.json for this project")
  .option("-y, --yes", "accept the defaults, ask nothing")
  .option("-f, --force", "replace an existing config")
  .option("-d, --dir <path>", "where components should go")
  .action(init);

define("add", "copy components into your project")
  .argument("[components...]", "component names — omit to pick from a list")
  .option("-o, --overwrite", "replace files that already exist")
  .option(
    "-d, --dir <path>",
    "write somewhere other than the configured outDir",
  )
  .option("-t, --types", "also copy the component's public types")
  .option("-e, --examples", "also copy the example screen")
  .option("--no-deps", "do not follow imports into other components")
  .option("--no-install", "never install missing npm packages")
  .option("--dry", "show what would be written, write nothing")
  .option("-y, --yes", "no prompts — safe defaults for everything")
  .action(add);

define("list", "show every component in the registry")
  .alias("ls")
  .option("-c, --category <name>", "one category only")
  .option("-s, --search <query>", "filter by name")
  .option("--json", "print the raw registry")
  .action(list);

define("info", "what one component contains, and whether it is installed")
  .argument("<component>", "component name")
  .action(info);

define("diff", "compare installed components against the registry")
  .argument("[component]", "one component — omit to check everything installed")
  .action(diff);

define("remove", "delete an installed component")
  .alias("rm")
  .argument("<components...>", "component names")
  .option("-y, --yes", "do not ask for confirmation")
  .action(remove);

define("config", "print the resolved configuration")
  .option("--json", "print it as JSON")
  .option("--clear-cache", "drop the cached registry listings")
  .action(config);

define("create", "scaffold a new Expo app with reacticx set up")
  .argument("[name]", "app name")
  .action(create);

async function main() {
  if (process.argv.length <= 2) {
    landing(VERSION);
    return;
  }

  try {
    await program.parseAsync();
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "commander.help" || code === "commander.version") return;
    bail((error as Error).message);
  }
}

void main();
