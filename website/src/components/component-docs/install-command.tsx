"use client";

import { useState } from "react";

import { CodePanel } from "@/components/component-docs/code-panel";
import {
  BunIcon,
  NpmIcon,
  PnpmIcon,
  YarnIcon,
} from "@/components/component-docs/package-manager-icons";

const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const ICONS: Record<PackageManager, React.ReactNode> = {
  npm: <NpmIcon className="size-3.5 rounded-[2px]" />,
  pnpm: <PnpmIcon className="size-3.5" />,
  yarn: <YarnIcon className="size-3.5" />,
  bun: <BunIcon className="size-3.5" />,
};

/** The runner each package manager uses to execute a one-off binary. */
const RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
};

const TABS = PACKAGE_MANAGERS.map((pm) => ({
  id: pm,
  label: pm,
  icon: ICONS[pm],
}));

/**
 * A shell line is two meaningful parts — the runner and the arguments — so it
 * is coloured by hand rather than sent through the highlighter for one line.
 */
function ShellLine({ runner, rest }: { runner: string; rest: string }) {
  return (
    // `data-plain` opts out of the global shiki token colours, which are
    // unlayered and would otherwise override these classes.
    <pre
      className="no-scrollbar overflow-x-auto whitespace-pre px-5 pb-5 pt-4 font-mono text-[13.5px] leading-relaxed"
      data-plain
    >
      <span className="text-accent-pro">{runner}</span>
      <span className="text-foreground/80">{rest}</span>
    </pre>
  );
}

/**
 * The `reacticx add` line, per package manager.
 *
 * `command` overrides the default when a page installs something other than a
 * component (dependencies, for instance).
 */
export function InstallCommand({
  component,
  command,
}: {
  component?: string;
  command?: string;
}) {
  const [selected, setSelected] = useState<PackageManager>("npm");

  const runner = RUNNERS[selected];
  const rest = command
    ? ` ${command}`
    : ` reacticx add ${component ?? ""}`.trimEnd();
  const full = `${runner}${rest}`;

  return (
    <CodePanel
      activeTab={selected}
      copyCode={full}
      onTabChange={(id) => setSelected(id as PackageManager)}
      renderPanel={(id) => (
        <ShellLine rest={rest} runner={RUNNERS[id as PackageManager]} />
      )}
      tabListAriaLabel="Package manager"
      tabs={TABS}
    />
  );
}

const ADD_COMMANDS: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

/**
 * The `package-install` code fence in MDX: a dependency list, rendered as the
 * install line for each package manager.
 */
export function PackageInstall({ packages }: { packages: string }) {
  const [selected, setSelected] = useState<PackageManager>("npm");

  const rest = ` ${packages.trim().split(/\s+/).join(" ")}`;
  const runner = ADD_COMMANDS[selected];

  return (
    <CodePanel
      activeTab={selected}
      copyCode={`${runner}${rest}`}
      onTabChange={(id) => setSelected(id as PackageManager)}
      renderPanel={(id) => (
        <ShellLine rest={rest} runner={ADD_COMMANDS[id as PackageManager]} />
      )}
      tabListAriaLabel="Package manager"
      tabs={TABS}
    />
  );
}
