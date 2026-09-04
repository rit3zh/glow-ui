import type { Command } from "commander";

import { accent, box, muted, row, ui, width } from "./index.js";

const COMMANDS: [string, string][] = [
  ["init", "set this project up"],
  ["add <components...>", "copy components in"],
  ["list", "everything in the registry"],
  ["info <component>", "what one component contains"],
  ["diff [component]", "compare yours against the registry"],
  ["remove <components...>", "delete an installed component"],
  ["config", "the resolved configuration"],
  ["create [name]", "scaffold a new Expo app"],
];

export function landing(version: string) {
  box({
    title: accent("reacticx"),
    badge: version,
    rows: [
      row.gap(),
      muted("React Native components, copied into your project."),
      muted("Nothing is installed — the source lands in your repo."),
      row.rule(),
      row.gap(),
      ...ui.commands(COMMANDS),
      row.gap(),
    ],
  });

  console.log(`  ${muted("start with")}  ${accent("reacticx init")}`);
  console.log(`  ${muted("then")}        ${accent("reacticx add")}`);
  console.log();
  console.log(`  ${muted("reacticx <command> --help for flags")}`);
  console.log();
}

export function commandHelp(command: Command, version: string) {
  const name = command.name();
  const usage = `reacticx ${name} ${command.usage()}`
    .replace(/\s+/g, " ")
    .trim();

  const options = command.options
    .filter((option) => !option.hidden)
    .map((option) => [option.flags, option.description] as [string, string]);

  const args = command.registeredArguments.map(
    (argument) =>
      [
        argument.required ? `<${argument.name()}>` : `[${argument.name()}]`,
        argument.description || "",
      ] as [string, string],
  );

  box({
    title: accent(`reacticx ${name}`),
    badge: version,
    rows: [
      row.gap(),
      muted(command.description()),
      row.gap(),
      muted(usage),
      ...(args.length > 0
        ? [row.rule("arguments"), row.gap(), ...ui.commands(args), row.gap()]
        : []),
      ...(options.length > 0
        ? [row.rule("flags"), row.gap(), ...ui.commands(options), row.gap()]
        : [row.gap()]),
    ],
  });
}

export function ruleWidth() {
  return width();
}
