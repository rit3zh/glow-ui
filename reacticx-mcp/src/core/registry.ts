import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type {
  BucketFile,
  BucketIndex,
  ComponentConfig,
  ComponentInfo,
  Registry,
} from "./types.js";

const CACHE_DIR = path.join(os.homedir(), ".cache", "reacticx");

interface CacheEntry<T> {
  fetchedAt: number;
  value: T;
}

const memo = new Map<string, unknown>();

function cacheFile(origin: string, key: string) {
  const scope = createHash("sha256").update(origin).digest("hex").slice(0, 12);
  return path.join(CACHE_DIR, scope, `${key.replace(/[^\w.-]/g, "_")}.json`);
}

async function readCache<T>(file: string, ttl: number): Promise<T | null> {
  try {
    const entry = JSON.parse(await fs.readFile(file, "utf8")) as CacheEntry<T>;
    if (Date.now() - entry.fetchedAt > ttl * 1000) return null;
    return entry.value;
  } catch {
    return null;
  }
}

async function writeCache<T>(file: string, value: T) {
  try {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(
      file,
      JSON.stringify({ fetchedAt: Date.now(), value } satisfies CacheEntry<T>),
      "utf8",
    );
  } catch {}
}

export class RegistryClient {
  private readonly origin: string;
  private readonly ttl: number | false;

  constructor(private readonly config: ComponentConfig) {
    this.origin = config.registry.origin.replace(/\/+$/, "");
    this.ttl = config.registry.cache;
  }

  url(key: string) {
    return `${this.origin}/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  private async json<T>(key: string, label: string): Promise<T> {
    const memoKey = `${this.origin}::${key}`;
    if (memo.has(memoKey)) return memo.get(memoKey) as T;

    const file = cacheFile(this.origin, key);

    if (this.ttl !== false) {
      const cached = await readCache<T>(file, this.ttl);
      if (cached) {
        memo.set(memoKey, cached);
        return cached;
      }
    }

    let response: Response;
    try {
      response = await fetch(this.url(key));
    } catch (error) {
      throw new Error(
        `cannot reach the registry at ${this.origin} — ${(error as Error).message}`,
      );
    }

    if (!response.ok) {
      throw new Error(
        `${label} at ${this.origin} returned ${response.status} ${response.statusText}`,
      );
    }

    let value: T;
    try {
      value = (await response.json()) as T;
    } catch {
      throw new Error(`${label} at ${this.origin} is not valid JSON`);
    }

    memo.set(memoKey, value);
    if (this.ttl !== false) await writeCache(file, value);
    return value;
  }

  index(): Promise<BucketIndex> {
    return this.json<BucketIndex>(this.config.registry.index, "the file index");
  }

  registry(): Promise<Registry> {
    return this.json<Registry>(
      this.config.registry.registry,
      "the component registry",
    );
  }

  async clearCache() {
    for (const key of [...memo.keys()]) {
      if (key.startsWith(`${this.origin}::`)) memo.delete(key);
    }
    await fs.rm(
      path.join(
        CACHE_DIR,
        createHash("sha256").update(this.origin).digest("hex").slice(0, 12),
      ),
      { recursive: true, force: true },
    );
  }

  async filesUnder(prefix: string): Promise<BucketFile[]> {
    const normalized = prefix.endsWith("/") ? prefix : `${prefix}/`;
    const index = await this.index();

    return Object.values(index.folders)
      .flatMap((folder) => folder.files)
      .filter((file) => file.key.startsWith(normalized))
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  async file(file: BucketFile): Promise<Buffer> {
    let response: Response;
    try {
      response = await fetch(this.url(file.key));
    } catch (error) {
      throw new Error(`${file.key} — ${(error as Error).message}`);
    }

    if (!response.ok) {
      throw new Error(`${file.key} — ${response.status} ${response.statusText}`);
    }

    const body = Buffer.from(await response.arrayBuffer());

    if (file.hash) {
      const actual = createHash("sha256").update(body).digest("hex");
      if (actual !== file.hash) {
        throw new Error(`${file.key} — checksum mismatch, the download is corrupt`);
      }
    }

    return body;
  }
}

export function resolveComponentName(
  registry: Registry,
  input: string,
): string | null {
  if (registry.components[input]) return input;

  const needle = input.toLowerCase();
  const matches = Object.keys(registry.components).filter(
    (name) => name.toLowerCase() === needle,
  );

  return matches.length === 1 ? matches[0]! : null;
}

export function coreKeyFor(component: ComponentInfo) {
  return `core/${component.path.replace(/^src\/components\//, "")}`;
}

export function typesKeyFor(component: ComponentInfo) {
  return `types/${component.name}`;
}

export function exampleKeyFor(component: ComponentInfo) {
  return `examples/${component.name}`;
}

const SHARED_PREFIXES: {
  alias: string;
  prefix: string;
  kind: "utils" | "hooks";
}[] = [
  { alias: "@/utils/", prefix: "helpers/", kind: "utils" },
  { alias: "@/helpers/hooks/", prefix: "shared/hooks/", kind: "hooks" },
  { alias: "@/helpers/", prefix: "shared/", kind: "utils" },
];

export interface SharedModule {
  name: string;
  prefix: string;
  kind: "utils" | "hooks";
}

export function sharedModuleFor(specifier: string): SharedModule | null {
  for (const entry of SHARED_PREFIXES) {
    if (!specifier.startsWith(entry.alias)) continue;

    const rest = specifier.slice(entry.alias.length).replace(/\/+$/, "");
    if (!rest) return null;

    return { name: rest, prefix: `${entry.prefix}${rest}`, kind: entry.kind };
  }
  return null;
}

export function componentForSpecifier(
  specifier: string,
  registry: Registry,
): ComponentInfo | null {
  if (!specifier.startsWith("@/components/")) return null;

  const target = `src/${specifier.slice(2).replace(/\/+$/, "")}`;

  let best: ComponentInfo | null = null;
  for (const component of Object.values(registry.components)) {
    if (target === component.path || target.startsWith(`${component.path}/`)) {
      if (!best || component.path.length > best.path.length) best = component;
    }
  }
  return best;
}

export function byCategory(registry: Registry): Map<string, ComponentInfo[]> {
  const grouped = new Map<string, ComponentInfo[]>();

  for (const component of Object.values(registry.components)) {
    const bucket = grouped.get(component.category) ?? [];
    bucket.push(component);
    grouped.set(component.category, bucket);
  }

  for (const bucket of grouped.values()) {
    bucket.sort((a, b) => a.name.localeCompare(b.name));
  }

  return new Map([...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function closest(input: string, candidates: string[], limit = 3) {
  const needle = input.toLowerCase();

  return candidates
    .map((candidate) => {
      const name = candidate.toLowerCase();
      if (name.includes(needle) || needle.includes(name)) return { candidate, score: 0 };
      return { candidate, score: distance(needle, name) };
    })
    .filter((entry) => entry.score <= Math.max(3, Math.floor(needle.length / 2)))
    .sort((a, b) => a.score - b.score || a.candidate.localeCompare(b.candidate))
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

function distance(a: string, b: string) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) rows[0]![j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i]![j] = Math.min(
        rows[i - 1]![j]! + 1,
        rows[i]![j - 1]! + 1,
        rows[i - 1]![j - 1]! + cost,
      );
    }
  }

  return rows[a.length]![b.length]!;
}
