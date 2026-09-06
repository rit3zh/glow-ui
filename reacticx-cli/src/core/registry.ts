import { createHash } from "node:crypto";
import { setDefaultResultOrder } from "node:dns";
import os from "node:os";
import path from "node:path";
import fs from "fs-extra";

import type {
  BucketFile,
  BucketIndex,
  ComponentConfig,
  ComponentInfo,
  Registry,
} from "../typings/index.js";

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
    const entry = (await fs.readJson(file)) as CacheEntry<T>;
    if (Date.now() - entry.fetchedAt > ttl * 1000) return null;
    return entry.value;
  } catch {
    return null;
  }
}

async function writeCache<T>(file: string, value: T) {
  try {
    await fs.outputJson(file, {
      fetchedAt: Date.now(),
      value,
    } satisfies CacheEntry<T>);
  } catch {}
}

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

/** Errors raised before a connection could be established, so retrying is worthwhile. */
const CONNECT_ERROR_CODES = new Set([
  "UND_ERR_CONNECT_TIMEOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ETIMEDOUT",
]);

let ipv4FallbackApplied = false;

function fetchTimeout(): number {
  const raw = Number(process.env.REACTICX_FETCH_TIMEOUT);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}

function isConnectFailure(error: unknown): boolean {
  const code = (error as { cause?: { code?: string } })?.cause?.code;
  return code !== undefined && CONNECT_ERROR_CODES.has(code);
}

/**
 * Prefer IPv4 for the remaining attempts. Dual-stack networks frequently
 * advertise an AAAA record for the registry host that they cannot actually
 * route, so the first connect hangs until it times out.
 */
function preferIPv4(): void {
  if (ipv4FallbackApplied) return;
  ipv4FallbackApplied = true;
  try {
    setDefaultResultOrder("ipv4first");
  } catch {
    // Runtimes without `dns.setDefaultResultOrder` simply retry as-is.
  }
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * `fetch` only rejects on transport-level failures — an HTTP error status
 * resolves normally — so anything thrown here is worth another attempt.
 */
async function fetchWithRetry(url: string): Promise<Response> {
  const timeout = fetchTimeout();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(timeout) });
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS) break;

      if (isConnectFailure(error)) preferIPv4();
      await delay(RETRY_BASE_DELAY_MS * attempt);
    }
  }

  const error = new Error(
    `${(lastError as Error).message} (${MAX_ATTEMPTS} attempts, ${timeout}ms timeout each — ` +
      `set REACTICX_FETCH_TIMEOUT=<milliseconds> to allow longer)`,
  );
  (error as Error & { cause?: unknown }).cause = lastError;
  throw error;
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
    if (memo.has(key)) return memo.get(key) as T;

    const file = cacheFile(this.origin, key);

    if (this.ttl !== false) {
      const cached = await readCache<T>(file, this.ttl);
      if (cached) {
        memo.set(key, cached);
        return cached;
      }
    }

    let response: Response;
    try {
      response = await fetchWithRetry(this.url(key));
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

    memo.set(key, value);
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
    memo.clear();
    await fs.remove(
      path.join(
        CACHE_DIR,
        createHash("sha256").update(this.origin).digest("hex").slice(0, 12),
      ),
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
      response = await fetchWithRetry(this.url(file.key));
    } catch (error) {
      throw new Error(`${file.key} — ${(error as Error).message}`);
    }

    if (!response.ok) {
      throw new Error(
        `${file.key} — ${response.status} ${response.statusText}`,
      );
    }

    const body = Buffer.from(await response.arrayBuffer());

    if (file.hash) {
      const actual = createHash("sha256").update(body).digest("hex");
      if (actual !== file.hash) {
        throw new Error(
          `${file.key} — checksum mismatch, the download is corrupt`,
        );
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
