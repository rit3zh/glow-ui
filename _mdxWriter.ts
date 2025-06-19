import * as fs from "fs/promises";
import path from "path";

const COMPONENTS_DIR = path.join(process.cwd(), "src", "components");
const OUTPUT_DIR = path.join(process.cwd(), "_testDocs");

const VALID_EXTENSIONS = [".ts", ".tsx", ".types.ts"];

function isValidFile(fileName: string): boolean {
  return (
    VALID_EXTENSIONS.some((ext) => fileName.endsWith(ext)) &&
    !fileName.toLowerCase().includes(".ds_store")
  );
}

async function collectAllFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectAllFiles(fullPath)));
    } else if (isValidFile(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getTopLevelFolder(filePath: string, baseDir: string): string {
  const relativePath = path.relative(baseDir, filePath);
  const parts = relativePath.split(path.sep);
  return parts[1];
}

function getFileName(filePath: string): string {
  return path.basename(filePath);
}

async function readFilesContent(filePaths: string[]) {
  const contentMap: Record<string, string> = {};
  for (const filePath of filePaths) {
    try {
      contentMap[filePath] = await fs.readFile(filePath, "utf-8");
    } catch (err) {
      console.error(`Error reading ${filePath}`, err);
    }
  }
  return contentMap;
}

function formatCodeBlock(lang: string, code: string) {
  return `\n\`\`\`${lang}\n${code.trim()}\n\`\`\`\n`;
}

async function writeMDXFile(
  folderName: string,
  group: ReturnType<typeof groupFiles>[string],
) {
  const mdxParts: string[] = [];

  const title = folderName
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

  mdxParts.push(
    `---\ntitle: ${title}\ndescription: ${title} component for React Native.\n---\n`,
  );
  mdxParts.push(
    `import { FaReact } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { SiNpm } from "react-icons/si";
import { TbManualGearbox } from "react-icons/tb";
import { FaCode } from "react-icons/fa6";

<div className="flex justify-center items-center my-8">
  <video
    src="/avatar.mp4"
    autoPlay
    muted
    loop
    className="rounded-2xl"
    style={{ width: "80%", maxWidth: "960px", height: "auto" }}
  />
</div>
`,
  );

  mdxParts.push(`<Tabs defaultValue="tab-1">
<TabsList>
    <TabsTrigger value="tab-1">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SiNpm />
        <span>NPM</span>
      </div>

    </TabsTrigger>

    <TabsTrigger value="tab-2">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
      <TbManualGearbox />
      <span>
        Manual
        </span>
      </div>
    </TabsTrigger>

  </TabsList>

<TabsContent value="tab-1">
  ${formatCodeBlock("bash", `npx rn-glow add ${folderName}`)}

### ⚙️ Props



  </TabsContent>
</Tabs>
`);

  if (group.typeFiles.length) {
    mdxParts.push(`### ⚙️ Types`);
    for (const file of group.typeFiles) {
      mdxParts.push(`#### ${file.name}`);
      mdxParts.push(formatCodeBlock("ts", file.content || ""));
    }
  }

  if (group.componentFiles.length) {
    mdxParts.push(`### 💻 Components`);
    for (const file of group.componentFiles) {
      mdxParts.push(`#### ${file.name}`);
      mdxParts.push(formatCodeBlock("tsx", file.content || ""));
    }
  }

  if (group.children?.length) {
    mdxParts.push(`### 🧩 Children`);
    for (const file of group.children) {
      mdxParts.push(`#### ${file.name}`);
      mdxParts.push(formatCodeBlock("tsx", file.content || ""));
    }
  }

  if (group.otherFiles.length) {
    mdxParts.push(`### 📁 Other`);
    for (const file of group.otherFiles) {
      mdxParts.push(`#### ${file.name}`);
      mdxParts.push(formatCodeBlock("ts", file.content || ""));
    }
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUTPUT_DIR, `${folderName}.mdx`),
    mdxParts.join("\n"),
    "utf-8",
  );
}

function groupFiles(
  allFiles: string[],
  fileContents: Record<string, string>,
): Record<
  string,
  {
    folderName: string;
    typeFiles: { name: string; content?: string }[];
    componentFiles: { name: string; content?: string }[];
    children?: { name: string; content?: string }[];
    otherFiles: { name: string; content?: string }[];
  }
> {
  const grouped: Record<string, any> = {};

  for (const filePath of allFiles) {
    const folderName = getTopLevelFolder(filePath, COMPONENTS_DIR);
    const fileName = getFileName(filePath);
    const content = fileContents[filePath];

    if (!grouped[folderName]) {
      grouped[folderName] = {
        folderName,
        typeFiles: [],
        componentFiles: [],
        children: [],
        otherFiles: [],
      };
    }

    const entry = grouped[folderName];

    if (filePath.includes(`${path.sep}children${path.sep}`)) {
      entry.children.push({ name: fileName, content });
    } else if (fileName.endsWith(".types.ts")) {
      entry.typeFiles.push({ name: fileName, content });
    } else if (fileName.endsWith(".tsx")) {
      entry.componentFiles.push({ name: fileName, content });
    } else {
      entry.otherFiles.push({ name: fileName, content });
    }
  }

  return grouped;
}

(async () => {
  const allFiles = await collectAllFiles(COMPONENTS_DIR);
  const fileContents = await readFilesContent(allFiles);
  const grouped = groupFiles(allFiles, fileContents);

  for (const [folderName, group] of Object.entries(grouped)) {
    await writeMDXFile(folderName, group);
  }

  console.log("✅ All MDX docs generated in _testDocs/");
})();

function extractPropsTable(content: string): string | null {
  const interfaceMatch =
    content.match(/export\s+(interface|type)\s+(\w*Props)\s*=\s*{([^}]*)}/s) ||
    content.match(/export\s+interface\s+(\w*Props)\s*{([^}]*)}/s);

  if (!interfaceMatch) return null;

  const body = interfaceMatch[3] || interfaceMatch[2];
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /^[a-zA-Z0-9_\[\]?]+:/.test(line));

  const rows = lines.map((line) => {
    const [keyPart, ...rest] = line.split(":");
    const key = keyPart.trim();
    const type = rest.join(":").replace(/;$/, "").trim();
    const optional = key.endsWith("?");
    const propName = optional ? key.slice(0, -1) : key;
    return `| \`${propName}\` | \`${type}\` | - | - |`;
  });

  return [
    `| Prop | Type | Default | Description |`,
    `|------|------|---------|-------------|`,
    ...rows,
  ].join("\n");
}
