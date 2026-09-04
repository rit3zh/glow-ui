import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CLI = join(ROOT, "dist", "index.js");

const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
const verbose = process.argv.includes("--verbose");

let sandbox = ROOT;
let passed = 0;
const failures = [];

const dim = (text) => `\x1b[2m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;

function cli(args, { expectFail = false } = {}) {
  try {
    const out = execFileSync("node", [CLI, ...args], {
      cwd: sandbox,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
    });
    if (expectFail) throw new Error(`expected \`${args.join(" ")}\` to fail, it succeeded`);
    if (verbose) process.stdout.write(dim(out));
    return out;
  } catch (error) {
    if (expectFail) return `${error.stdout ?? ""}${error.stderr ?? ""}`;
    throw new Error(`\`${args.join(" ")}\` failed:\n${error.stdout ?? ""}${error.stderr ?? ""}`);
  }
}

function project(config) {
  sandbox = mkdtempSync(join(tmpdir(), "reacticx-test-"));
  writeFileSync(
    join(sandbox, "package.json"),
    JSON.stringify({
      name: "sandbox",
      dependencies: { react: "19.0.0", "react-native": "0.79.0" },
    }),
  );
  if (config) {
    writeFileSync(join(sandbox, "component.config.json"), JSON.stringify(config, null, 2));
  }
}

function read(relative) {
  return readFileSync(join(sandbox, relative), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function contains(haystack, needle, label) {
  assert(haystack.includes(needle), `${label}\n  expected to find: ${needle}`);
}

async function test(name, body) {
  if (only.length > 0 && !only.some((pattern) => name.includes(pattern))) return;
  try {
    await body();
    passed += 1;
    console.log(`  ${green("✓")} ${name}`);
  } catch (error) {
    failures.push({ name, error });
    console.log(`  ${red("✗")} ${name}`);
    console.log(dim(`    ${error.message.split("\n").join("\n    ")}`));
  } finally {
    if (sandbox !== ROOT) rmSync(sandbox, { recursive: true, force: true });
    sandbox = ROOT;
  }
}

const NARROW = `Object.defineProperty(process.stdout, "columns", { value: Number(process.env.W), configurable: true });
await import(${JSON.stringify(CLI)});`;

const BASE = {
  outDir: "src/ui",
  installDependencies: "never",
  registry: { cache: false },
};

console.log(`\n  reacticx smoke tests ${dim(CLI)}\n`);

assert(existsSync(CLI), `no build at ${CLI} — run \`bun run build\` first`);

await test("--help lists every command", () => {
  const out = cli(["--help"]);
  for (const command of ["init", "add", "list", "info", "diff", "remove", "config", "create"]) {
    contains(out, command, `--help is missing \`${command}\``);
  }
});

await test("init --yes writes a config", () => {
  project();
  cli(["init", "--yes"]);
  const written = JSON.parse(read("component.config.json"));
  assert(written.outDir, "config has no outDir");
  assert(written.$schema, "config has no $schema");
});

await test("init --yes --dir honours the directory", () => {
  project();
  cli(["init", "--yes", "--dir", "src/widgets"]);
  assert(JSON.parse(read("component.config.json")).outDir === "src/widgets", "outDir was not applied");
});

await test("init refuses to clobber without --force", () => {
  project(BASE);
  const out = cli(["init", "--yes"]);
  contains(out, "already exists", "init overwrote an existing config");
  assert(JSON.parse(read("component.config.json")).outDir === "src/ui", "config was replaced");
});

await test("config resolves defaults and validates", () => {
  project({ outDir: "src/ui" });
  const out = cli(["config"]);
  contains(out, "valid", "config did not report the file as valid");
  const resolved = JSON.parse(cli(["config", "--json"]));
  assert(resolved.structure === "category", "structure default missing");
  assert(resolved.registry.origin.startsWith("https://"), "registry origin missing");
});

await test("config rejects an invalid file", () => {
  project({ outDir: "src/ui", structure: "sideways" });
  const out = cli(["config"], { expectFail: true });
  contains(out, "structure", "an invalid structure was accepted");
});

await test("list reads the registry", () => {
  project(BASE);
  const registry = JSON.parse(cli(["list", "--json"]));
  assert(registry.totalComponents > 0, "registry is empty");
  contains(cli(["list", "-c", "molecules"]), "accordion", "molecules is missing accordion");
  contains(cli(["list", "-s", "beam"]), "border-beam", "search did not find border-beam");
});

await test("info describes a component", () => {
  project(BASE);
  const out = cli(["info", "accordion"]);
  contains(out, "molecules", "info is missing the category");
  contains(out, "index.tsx", "info is missing the file list");
});

await test("an unknown name suggests a real one", () => {
  project(BASE);
  contains(cli(["info", "accordian"], { expectFail: true }), "accordion", "no suggestion offered");
});

await test("add --dry writes nothing", () => {
  project(BASE);
  const out = cli(["add", "accordion", "--dry"]);
  contains(out, "dry run", "output does not say it was a dry run");
  assert(!existsSync(join(sandbox, "src")), "a dry run created files");
});

await test("add writes the component", () => {
  project(BASE);
  cli(["add", "accordion", "--yes"]);
  contains(read("src/ui/molecules/accordion/index.tsx"), "export", "the component is empty");
});

await test("add pulls in what a component imports", () => {
  project(BASE);
  cli(["add", "profile-settings-v1", "--yes"]);
  assert(
    existsSync(join(sandbox, "src/ui/base/squircle-view/index.tsx")),
    "squircle-view was not brought along",
  );
});

await test("--no-deps leaves the dependency behind", () => {
  project(BASE);
  cli(["add", "profile-settings-v1", "--yes", "--no-deps"]);
  assert(
    !existsSync(join(sandbox, "src/ui/base/squircle-view")),
    "--no-deps still copied the dependency",
  );
});

await test("imports are rewritten to the configured alias", () => {
  project({ ...BASE, aliases: { components: "~/ui" } });
  cli(["add", "profile-settings-v1", "--yes"]);
  contains(
    read("src/ui/blocks/profile-settings-v1/index.tsx"),
    '"~/ui/base/squircle-view"',
    "the alias was not applied",
  );
});

await test("a blank alias produces relative imports", () => {
  project({ ...BASE, aliases: { components: "" } });
  cli(["add", "profile-settings-v1", "--yes"]);
  contains(
    read("src/ui/blocks/profile-settings-v1/index.tsx"),
    '"../../base/squircle-view"',
    "no relative import was written",
  );
});

await test("structure: flat rewrites to the flat layout", () => {
  project({ ...BASE, structure: "flat", aliases: { components: "~/ui" } });
  cli(["add", "profile-settings-v1", "--yes"]);
  assert(existsSync(join(sandbox, "src/ui/squircle-view/index.tsx")), "flat layout not used");
  contains(
    read("src/ui/profile-settings-v1/index.tsx"),
    '"~/ui/squircle-view"',
    "the import does not match the flat layout",
  );
});

await test("structure: mirror keeps the library layout", () => {
  project({ ...BASE, structure: "mirror" });
  cli(["add", "profile-settings-v1", "--yes"]);
  assert(
    existsSync(join(sandbox, "src/ui/blocks/settings/profile-settings-v1/index.tsx")),
    "mirror layout not used",
  );
});

await test("--types and --examples add their own files", () => {
  project(BASE);
  cli(["add", "accordion", "--yes", "--types", "--examples"]);
  assert(existsSync(join(sandbox, "src/shared/types/accordion")), "types were not written");
  assert(existsSync(join(sandbox, "src/shared/examples/accordion")), "examples were not written");
});

await test("--dir overrides outDir", () => {
  project(BASE);
  cli(["add", "accordion", "--yes", "--dir", "src/elsewhere"]);
  assert(existsSync(join(sandbox, "src/elsewhere/molecules/accordion")), "--dir was ignored");
});

await test("existing files are kept without --overwrite", () => {
  project(BASE);
  cli(["add", "accordion", "--yes"]);
  const file = join(sandbox, "src/ui/molecules/accordion/index.tsx");
  writeFileSync(file, "// mine\n");
  cli(["add", "accordion", "--yes"]);
  assert(readFileSync(file, "utf8") === "// mine\n", "the file was overwritten");
});

await test("--overwrite replaces them", () => {
  project(BASE);
  cli(["add", "accordion", "--yes"]);
  const file = join(sandbox, "src/ui/molecules/accordion/index.tsx");
  writeFileSync(file, "// mine\n");
  cli(["add", "accordion", "--yes", "--overwrite"]);
  assert(readFileSync(file, "utf8") !== "// mine\n", "--overwrite left the file alone");
});

await test("unresolvable imports are reported", () => {
  project(BASE);
  const out = cli(["add", "sign-up-v1", "--yes", "--dry"]);
  contains(out, "unresolved", "the unresolved section is missing");
  contains(out, "@/helpers/hooks/use-responsive", "the dangling import was not named");
});

await test("missing npm packages are found but not installed", () => {
  project(BASE);
  const out = cli(["add", "accordion", "--yes"]);
  contains(out, "added", "the summary does not report the component as added");
  assert(
    existsSync(join(sandbox, "src/ui/molecules/accordion/index.tsx")),
    "nothing was written",
  );
  assert(!existsSync(join(sandbox, "node_modules")), "installDependencies: never still installed");
});

await test("diff reports a clean tree, then an edit", () => {
  project(BASE);
  cli(["add", "accordion", "--yes"]);
  contains(cli(["diff"]), "in sync", "a fresh copy was not reported as in sync");

  const file = join(sandbox, "src/ui/molecules/accordion/types.ts");
  writeFileSync(file, `${readFileSync(file, "utf8")}\n// edited\n`);
  const out = cli(["diff"]);
  contains(out, "modified", "an edit went unnoticed");
  contains(out, "types.ts", "the modified file was not named");
});

await test("remove deletes the folder", () => {
  project(BASE);
  cli(["add", "accordion", "--yes"]);
  cli(["remove", "accordion", "--yes"]);
  assert(!existsSync(join(sandbox, "src/ui/molecules/accordion")), "the folder survived remove");
});


await test("a capitalised name resolves case-insensitively", () => {
  project(BASE);
  cli(["add", "toast", "--yes"]);
  assert(existsSync(join(sandbox, "src/ui/molecules/Toast")), "toast did not resolve to Toast");
});

await test("nested sub-folders are mirrored", () => {
  project(BASE);
  cli(["add", "floating-sheet", "--yes"]);
  assert(
    existsSync(
      join(sandbox, "src/ui/templates/floating-sheet/utils/animation-utils/events/onDrag.ts"),
    ),
    "a nested file is missing",
  );
});

await test("a binary asset survives byte for byte", () => {
  project(BASE);
  cli(["add", "v1", "--yes"]);
  const png = readFileSync(join(sandbox, "src/ui/screens/v1/wallet.png"));
  assert(png.subarray(0, 8).toString("hex") === "89504e470d0a1a0a", "the PNG header is corrupt");
});

await test("a shared dependency is fetched once for many components", () => {
  project(BASE);
  const out = cli(["add", "profile-settings-v1", "profile-settings-v3", "--yes"]);
  const copies = out.split("\n").filter((line) => line.includes("squircle-view/index.tsx"));
  assert(copies.length === 1, `squircle-view was written ${copies.length} times`);
});

await test("unset nested keys keep their defaults", () => {
  project({ outDir: "src/ui", aliases: { components: "~/ui" } });
  const resolved = JSON.parse(cli(["config", "--json"]));
  assert(resolved.aliases.components === "~/ui", "the override was lost");
  assert(resolved.aliases.utils === "@/shared/utils", "a sibling default was dropped");
  assert(resolved.registry.index === "index.json", "a nested default was dropped");
});

await test("a multi-line error stays inside the box", () => {
  project({ outDir: "/absolute", structure: "sideways" });
  const out = cli(["config"], { expectFail: true });
  const frame = out.split("\n").filter((line) => line.includes("\u2502"));
  const widths = new Set(frame.map((line) => [...line.replace(/\u001b\[[0-9;]*m/g, "")].length));
  assert(widths.size === 1, `box lines have ${widths.size} different widths`);
});

await test("an unreachable registry reports the origin", () => {
  project({ ...BASE, registry: { origin: "https://nope.reacticx.invalid" } });
  const out = cli(["list"], { expectFail: true });
  contains(out, "nope.reacticx.invalid", "the failing origin was not named");
});

await test("an unknown command suggests a real one", () => {
  project(BASE);
  contains(cli(["lst"], { expectFail: true }), "list", "no command suggestion offered");
});

await test("json output is machine-readable", () => {
  project(BASE);
  JSON.parse(cli(["list", "--json"]));
  JSON.parse(cli(["config", "--json"]));
});

await test("boxes stay square at any terminal width", () => {
  project(BASE);
  for (const columns of [52, 64, 120]) {
    const out = execFileSync("node", ["-e", NARROW, "info", "accordion"], {
      cwd: sandbox,
      encoding: "utf8",
      env: { ...process.env, W: String(columns), NO_COLOR: "1" },
    });
    const frame = out.split("\n").filter((line) => line.includes("\u2502"));
    const widths = new Set(frame.map((line) => [...line].length));
    assert(widths.size === 1, `at ${columns} columns the box has ${widths.size} widths`);
  }
});

console.log("");

if (failures.length > 0) {
  console.log(`  ${red(`${failures.length} failed`)}${dim(`, ${passed} passed`)}\n`);
  process.exit(1);
}

console.log(`  ${green(`${passed} passed`)}\n`);
