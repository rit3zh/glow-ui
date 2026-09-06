import path from "node:path";
import fs from "fs-extra";

import type { PackageManager } from "../typings/index.js";
import {
  PM_CREATE,
  PM_EXEC,
  PM_LABELS,
  detectPackageManager,
  run,
} from "../core/pm.js";
import { accent, bail, c, muted, row, ui } from "../ui/index.js";

const TEMPLATES = [
  {
    title: "blank — typescript",
    value: "blank-typescript",
    description: "minimal Expo app, TypeScript",
  },
  {
    title: "blank",
    value: "blank",
    description: "minimal Expo app, JavaScript",
  },
  {
    title: "tabs — expo router",
    value: "tabs",
    description: "file-based routing with tab navigation",
  },
];

const slug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const bundleFor = (name: string) =>
  `com.${name.replace(/[^a-z0-9]/gi, "").toLowerCase()}`;

export async function create(nameArgument: string | undefined) {
  const detected = detectPackageManager();
  const order: PackageManager[] = ["bun", "pnpm", "yarn", "npm"];

  ui.box({
    title: "reacticx create",
    badge: "new Expo app",
    rows: [
      row.gap(),
      muted("Scaffolds an Expo app and sets reacticx up inside it."),
      row.gap(),
    ],
  });

  const answers = await ui.ask<
    "appName" | "bundleId" | "template" | "packageManager" | "runInit"
  >([
    {
      type: nameArgument ? null : "text",
      name: "appName",
      message: "App name",
      initial: "my-expo-app",
      format: (value: string) => slug(value) || value.trim(),
      validate: (value: string) => (value.trim() ? true : "Give it a name"),
    },
    {
      type: "text",
      name: "bundleId",
      message: "Bundle / package ID",
      initial: (_prev: unknown, values: Record<string, unknown>) =>
        bundleFor(slug(nameArgument ?? String(values.appName ?? ""))),
    },
    {
      type: "select",
      name: "template",
      message: "Template",
      choices: TEMPLATES,
      initial: 0,
    },
    {
      type: "select",
      name: "packageManager",
      message: "Package manager",
      choices: order.map((pm) => ({
        title:
          pm === detected
            ? `${PM_LABELS[pm]} ${c.dim("· detected")}`
            : PM_LABELS[pm],
        value: pm,
      })),
      initial: order.indexOf(detected),
    },
    {
      type: "confirm",
      name: "runInit",
      message: "Initialize reacticx in it afterwards?",
      initial: true,
    },
  ]);

  const appName = slug(nameArgument ?? String(answers.appName));
  const pm = answers.packageManager as PackageManager;
  const command = `${PM_CREATE[pm]} ${appName} --template ${answers.template}`;

  ui.hint(command);

  try {
    await run(command);
  } catch (error) {
    bail((error as Error).message, ["the Expo output above says why"]);
  }

  const appDir = path.join(process.cwd(), appName);
  const bundleId = String(answers.bundleId ?? "").trim();

  if (bundleId) {
    await patchBundleId(appDir, bundleId);
  }

  if (answers.runInit) {
    try {
      await run(`${PM_EXEC[pm]} reacticx init`, appDir);
    } catch {
      ui.hint("reacticx init did not finish — run it yourself");
    }
  }

  ui.box({
    title: `created ${c.green(appName)}`,
    rows: [
      row.gap(),
      ...[
        `cd ${appName}`,
        ...(answers.runInit ? [] : [`${PM_EXEC[pm]} reacticx init`]),
        `${PM_EXEC[pm]} reacticx add button`,
      ].map((step) => accent(step)),
      row.gap(),
    ],
  });
}

async function patchBundleId(appDir: string, bundleId: string) {
  const appJsonPath = path.join(appDir, "app.json");
  if (!(await fs.pathExists(appJsonPath))) return;

  try {
    const appJson = await fs.readJson(appJsonPath);
    appJson.expo ??= {};
    appJson.expo.ios = { ...appJson.expo.ios, bundleIdentifier: bundleId };
    appJson.expo.android = { ...appJson.expo.android, package: bundleId };
    await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
    ui.hint(`app.json · bundle ID ${c.bold(bundleId)}`);
  } catch {
    ui.hint("could not patch app.json — set the bundle ID yourself");
  }
}
