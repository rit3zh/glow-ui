import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const entry = path.join(here, "..", "dist", "index.js");
const verbose = process.argv.includes("--verbose");

const passed = [];

async function step(name, run) {
  await run();
  passed.push(name);
  if (verbose) console.log(`  ok  ${name}`);
}

function payload(result) {
  assert.ok(!result.isError, `tool errored: ${result.content?.[0]?.text}`);
  return result.content[0].text;
}

const project = await fs.mkdtemp(path.join(os.tmpdir(), "reacticx-mcp-"));
await fs.writeFile(
  path.join(project, "package.json"),
  JSON.stringify({ name: "fixture", dependencies: { expo: "*" } }, null, 2),
);

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [entry, "--root", project],
});
const client = new Client({ name: "smoke", version: "0.0.0" });
await client.connect(transport);

try {
  await step("lists its tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((tool) => tool.name).sort();
    for (const expected of [
      "add_components",
      "diff_components",
      "get_component",
      "get_component_example",
      "get_component_source",
      "get_component_types",
      "get_config",
      "get_usage_guide",
      "init_config",
      "list_components",
      "list_installed_components",
      "refresh_registry",
    ]) {
      assert.ok(names.includes(expected), `missing tool ${expected}`);
    }
  });

  await step("lists components", async () => {
    const result = await client.callTool({
      name: "list_components",
      arguments: { category: "molecules" },
    });
    const data = JSON.parse(payload(result));
    assert.ok(data.shown > 0);
    assert.deepEqual(Object.keys(data.categories), ["molecules"]);
  });

  await step("searches components", async () => {
    const result = await client.callTool({
      name: "list_components",
      arguments: { search: "accordion" },
    });
    const data = JSON.parse(payload(result));
    assert.ok(Object.values(data.categories).flat().includes("accordion"));
  });

  await step("suggests a name for a typo", async () => {
    const result = await client.callTool({
      name: "get_component",
      arguments: { name: "accordionn" },
    });
    assert.ok(result.isError);
    assert.match(result.content[0].text, /accordion/);
  });

  await step("describes a component", async () => {
    const result = await client.callTool({
      name: "get_component",
      arguments: { name: "accordion" },
    });
    const data = JSON.parse(payload(result));
    assert.equal(data.name, "accordion");
    assert.equal(data.installed, false);
    assert.ok(data.files.length > 0);
  });

  await step("reads component source", async () => {
    const result = await client.callTool({
      name: "get_component_source",
      arguments: { name: "accordion", file: "index.tsx" },
    });
    assert.match(payload(result), /### index\.tsx/);
  });

  await step("writes a config", async () => {
    const result = await client.callTool({
      name: "init_config",
      arguments: { outDir: "src/components/ui", componentsAlias: "@/components/ui" },
    });
    const data = JSON.parse(payload(result));
    assert.equal(data.contents.outDir, "src/components/ui");
    const onDisk = JSON.parse(
      await fs.readFile(path.join(project, "component.config.json"), "utf8"),
    );
    assert.equal(onDisk.outDir, "src/components/ui");
  });

  await step("refuses to clobber an existing config", async () => {
    const result = await client.callTool({ name: "init_config", arguments: {} });
    assert.ok(result.isError);
  });

  await step("resolves the config", async () => {
    const result = await client.callTool({ name: "get_config", arguments: {} });
    const data = JSON.parse(payload(result));
    assert.equal(data.hasConfigFile, true);
    assert.equal(data.config.outDir, "src/components/ui");
  });

  await step("plans an add without writing", async () => {
    const result = await client.callTool({
      name: "add_components",
      arguments: { components: ["accordion"], dryRun: true },
    });
    const data = JSON.parse(payload(result));
    assert.equal(data.status, "dry-run");
    assert.equal(data.filesWritten.length, 0);
    assert.ok(data.fileCount > 0);
    assert.equal(
      await fs
        .stat(path.join(project, "src/components/ui"))
        .then(() => true)
        .catch(() => false),
      false,
    );
  });

  await step("adds a component", async () => {
    const result = await client.callTool({
      name: "add_components",
      arguments: { components: ["accordion"] },
    });
    const data = JSON.parse(payload(result));
    assert.equal(data.status, "written");
    assert.ok(data.filesWritten.length > 0);

    const source = await fs.readFile(
      path.join(project, "src/components/ui/molecules/accordion/index.tsx"),
      "utf8",
    );
    assert.doesNotMatch(source, /@\/components\//, "imports were not rewritten");
  });

  await step("reports missing packages instead of installing", async () => {
    const result = await client.callTool({
      name: "add_components",
      arguments: { components: ["accordion"], overwrite: true },
    });
    const data = JSON.parse(payload(result));
    if (data.missingPackages.length > 0) {
      assert.match(data.installCommand, /^(npm install|bun add|pnpm add|yarn add) /);
    }
  });

  await step("blocks an overwrite that was not asked for", async () => {
    const result = await client.callTool({
      name: "add_components",
      arguments: { components: ["accordion"] },
    });
    const data = JSON.parse(payload(result));
    assert.equal(data.status, "blocked");
    assert.equal(data.filesWritten.length, 0);
  });

  await step("sees the component as installed", async () => {
    const result = await client.callTool({
      name: "list_installed_components",
      arguments: {},
    });
    const data = JSON.parse(payload(result));
    assert.ok(data.installed.some((entry) => entry.name === "accordion"));
  });

  await step("finds no drift right after adding", async () => {
    const result = await client.callTool({
      name: "diff_components",
      arguments: { name: "accordion" },
    });
    const data = JSON.parse(payload(result));
    assert.equal(data.inSync, true);
  });

  await step("detects a local edit", async () => {
    const file = path.join(
      project,
      "src/components/ui/molecules/accordion/index.tsx",
    );
    await fs.appendFile(file, "\n// local edit\n");

    const result = await client.callTool({
      name: "diff_components",
      arguments: { name: "accordion" },
    });
    const data = JSON.parse(payload(result));
    assert.equal(data.inSync, false);
    assert.deepEqual(data.drifted[0].modified, ["index.tsx"]);
  });

  await step("refuses to escape the project root", async () => {
    const result = await client.callTool({
      name: "add_components",
      arguments: { components: ["accordion"], dir: "../escape" },
    });
    assert.ok(result.isError);
    assert.match(result.content[0].text, /outside the project root/);
  });

  await step("exposes the registry as a resource", async () => {
    const { contents } = await client.readResource({ uri: "reacticx://registry" });
    const registry = JSON.parse(contents[0].text);
    assert.ok(registry.totalComponents > 0);
  });

  await step("exposes component source as a resource", async () => {
    const { contents } = await client.readResource({
      uri: "reacticx://component/accordion",
    });
    assert.match(contents[0].text, /# accordion/);
  });

  await step("serves the usage guide", async () => {
    const result = await client.callTool({ name: "get_usage_guide", arguments: {} });
    assert.match(payload(result), /add_components/);
  });
} finally {
  await client.close();
  await fs.rm(project, { recursive: true, force: true });
}

const readOnly = new Client({ name: "smoke-ro", version: "0.0.0" });
await readOnly.connect(
  new StdioClientTransport({
    command: process.execPath,
    args: [entry, "--read-only"],
  }),
);

try {
  await step("read-only mode refuses writes", async () => {
    const result = await readOnly.callTool({
      name: "add_components",
      arguments: { components: ["accordion"] },
    });
    assert.ok(result.isError);
    assert.match(result.content[0].text, /read-only/);
  });

  await step("read-only mode still reads", async () => {
    const result = await readOnly.callTool({
      name: "list_components",
      arguments: { search: "accordion" },
    });
    assert.ok(!result.isError);
  });
} finally {
  await readOnly.close();
}

console.log(`\n${passed.length} checks passed`);
