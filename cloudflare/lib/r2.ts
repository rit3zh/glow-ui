/**
 * One R2 client for every bucket this repo pushes to.
 *
 * Two backends, chosen per run:
 *
 *   s3        direct signed PUT/DELETE/GET against the R2 API. Needs
 *             credentials, and is the only one that can *list* a bucket —
 *             which is what makes `--prune` and a credentialed pull possible.
 *   wrangler  `npx wrangler r2 object …`. Always available after `wrangler
 *             login`, but every call is a ~3s process spawn, so a 200-file
 *             sync takes minutes rather than seconds.
 *
 * Reads go through the bucket's public r2.dev origin wherever possible: a HEAD
 * or GET there costs nothing, needs no credentials, and works on a fresh clone
 * with no Cloudflare access at all. That is what lets `pull` restore the media
 * folders for someone who has only checked the repo out.
 */
import { spawn } from "node:child_process";
import { createHash, createHmac } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readS3Credentials, ROOT, type S3Credentials } from "./env";

export interface BucketSpec {
  /** Bucket name in the Cloudflare account. */
  bucket: string;
  /** Public r2.dev (or custom domain) origin, no trailing slash. */
  publicOrigin: string;
}

export interface RemoteObject {
  key: string;
  size: number;
  /** Quoted ETag with the quotes stripped. md5 for single-part uploads. */
  etag: string;
  lastModified: string;
}

export interface Backend {
  id: "s3" | "wrangler";
  label: string;
  /** How many operations this backend is happy to run at once. */
  concurrency: number;
  putFile(
    key: string,
    filePath: string,
    contentType: string,
    cacheControl?: string,
  ): Promise<void>;
  putBuffer(
    key: string,
    body: Buffer,
    contentType: string,
    cacheControl?: string,
  ): Promise<void>;
  delete(key: string): Promise<void>;
  /** Undefined on the wrangler backend — it cannot list a bucket. */
  list?(prefix?: string): Promise<RemoteObject[]>;
}

export type BackendId = Backend["id"];

/** `a/b c.mp4` -> `a/b%20c.mp4`, keeping the separators intact. */
function encodePath(key: string) {
  return key
    .split("/")
    .map((segment) =>
      encodeURIComponent(segment).replace(
        /[!'()*]/g,
        (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
      ),
    )
    .join("/");
}

export function publicUrlFor(spec: BucketSpec, key: string) {
  return `${spec.publicOrigin}/${encodePath(key)}`;
}

/* -------------------------------------------------------------------------- */
/* wrangler backend                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Where to find wrangler.
 *
 * It is not a dependency of the repo root — only the website installs it — so
 * `npx wrangler` from here means npm tries to download a fresh copy on every
 * single object, which either stalls waiting for a prompt or adds seconds per
 * file. A local binary is used when one exists, and `npx -y` is the fallback so
 * an unattended run still gets there rather than hanging on a confirmation.
 */
function wranglerCommand(): { command: string; prefix: string[] } {
  for (const candidate of [
    join(ROOT, "node_modules", ".bin", "wrangler"),
    join(ROOT, "website", "node_modules", ".bin", "wrangler"),
  ]) {
    if (existsSync(candidate)) return { command: candidate, prefix: [] };
  }

  return { command: "npx", prefix: ["-y", "wrangler"] };
}

/** Resolved once — the lookup is the same for every object in a run. */
let wrangler: { command: string; prefix: string[] } | undefined;

export function wranglerBinary() {
  return (wrangler ??= wranglerCommand());
}

function runWrangler(args: readonly string[]) {
  const { command, prefix } = wranglerBinary();

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, [...prefix, ...args], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, WRANGLER_SEND_METRICS: "false", NO_UPDATE_NOTIFIER: "1" },
    });

    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve();

      const reason = output
        .split("\n")
        .map((line) => line.replace(/\x1b\[[0-9;]*m/g, "").trim())
        .filter((line) => line.toUpperCase().includes("ERROR"))
        .slice(-2)
        .join(" ");

      reject(new Error(reason || `wrangler exited with code ${code}`));
    });
  });
}

/** wrangler only uploads from disk, so buffered bodies get a temp file. */
async function withTempFile(body: Buffer, run: (path: string) => Promise<void>) {
  const dir = await mkdtemp(join(tmpdir(), "reacticx-r2-"));
  try {
    const file = join(dir, "payload");
    await writeFile(file, body);
    await run(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function wranglerBackend(spec: BucketSpec, concurrency: number): Backend {
  const put = (
    key: string,
    filePath: string,
    contentType: string,
    cacheControl?: string,
  ) =>
    runWrangler([
      "r2",
      "object",
      "put",
      `${spec.bucket}/${key}`,
      "--file",
      filePath,
      "--content-type",
      contentType,
      ...(cacheControl ? ["--cache-control", cacheControl] : []),
      "--remote",
    ]);

  return {
    id: "wrangler",
    label: wranglerBinary().command === "npx" ? "wrangler (npx)" : "wrangler",
    concurrency,
    putFile: put,
    putBuffer: (key, body, contentType, cacheControl) =>
      withTempFile(body, (file) => put(key, file, contentType, cacheControl)),
    delete: (key) =>
      runWrangler(["r2", "object", "delete", `${spec.bucket}/${key}`, "--remote"]),
  };
}

/* -------------------------------------------------------------------------- */
/* S3 backend                                                                  */
/* -------------------------------------------------------------------------- */

const sha256 = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
const hmac = (key: Buffer | string, data: string) =>
  createHmac("sha256", key).update(data).digest();

const EMPTY_SHA256 = sha256(Buffer.alloc(0));

/** Minimal AWS SigV4 — enough for the single-request verbs R2 needs here. */
async function signedFetch(
  creds: S3Credentials,
  spec: BucketSpec,
  options: {
    method: "PUT" | "DELETE" | "GET";
    key?: string;
    query?: Record<string, string>;
    body?: Buffer;
    contentType?: string;
    cacheControl?: string;
  },
) {
  const { method, key = "", query, body, contentType, cacheControl } = options;

  const host = `${creds.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodePath(spec.bucket)}${key ? `/${encodePath(key)}` : "/"}`;
  const payloadHash = body ? sha256(body) : EMPTY_SHA256;

  const canonicalQuery = Object.entries(query ?? {})
    .map(([name, value]) => [encodeURIComponent(name), encodeURIComponent(value)] as const)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([name, value]) => `${name}=${value}`)
    .join("&");

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/auto/s3/aws4_request`;

  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) headers["content-type"] = contentType;
  // Added before `signedHeaders` is derived, so it is both signed and sent —
  // an unsigned header on an R2 PUT is rejected outright.
  if (cacheControl) headers["cache-control"] = cacheControl;

  const signedHeaders = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaders.map((name) => `${name}:${headers[name]}\n`).join("");
  const signedHeaderList = signedHeaders.join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaderList,
    payloadHash,
  ].join("\n");

  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${creds.secretAccessKey}`, dateStamp), "auto"), "s3"),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const url = `https://${host}${canonicalUri}${canonicalQuery ? `?${canonicalQuery}` : ""}`;

  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      Authorization:
        `AWS4-HMAC-SHA256 Credential=${creds.accessKeyId}/${scope}, ` +
        `SignedHeaders=${signedHeaderList}, Signature=${signature}`,
    },
    body: body ? new Uint8Array(body) : undefined,
  });

  if (!response.ok) {
    const text = (await response.text()).replace(/\s+/g, " ").trim();
    throw new Error(
      `${response.status} ${response.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`,
    );
  }

  return response;
}

/** Pulls one tag's text out of an XML fragment, without a parser dependency. */
function xmlValue(fragment: string, tag: string) {
  const match = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(fragment);
  return match?.[1] ?? "";
}

function s3Backend(creds: S3Credentials, spec: BucketSpec, concurrency: number): Backend {
  return {
    id: "s3",
    label: "S3 API",
    concurrency,

    async putFile(key, filePath, contentType, cacheControl) {
      await signedFetch(creds, spec, {
        method: "PUT",
        key,
        body: await readFile(filePath),
        contentType,
        cacheControl,
      });
    },

    async putBuffer(key, body, contentType, cacheControl) {
      await signedFetch(creds, spec, {
        method: "PUT",
        key,
        body,
        contentType,
        cacheControl,
      });
    },

    async delete(key) {
      await signedFetch(creds, spec, { method: "DELETE", key });
    },

    async list(prefix) {
      const objects: RemoteObject[] = [];
      let token: string | undefined;

      // ListObjectsV2 caps a page at 1000 keys; the media buckets are already
      // past that when both preview encodings are counted.
      do {
        const query: Record<string, string> = { "list-type": "2", "max-keys": "1000" };
        if (prefix) query.prefix = prefix;
        if (token) query["continuation-token"] = token;

        const response = await signedFetch(creds, spec, { method: "GET", query });
        const xml = await response.text();

        for (const match of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
          const entry = match[1]!;
          objects.push({
            key: xmlValue(entry, "Key"),
            size: Number(xmlValue(entry, "Size")) || 0,
            etag: xmlValue(entry, "ETag").replace(/^&quot;|&quot;$|^"|"$/g, ""),
            lastModified: xmlValue(entry, "LastModified"),
          });
        }

        token =
          xmlValue(xml, "IsTruncated") === "true"
            ? xmlValue(xml, "NextContinuationToken")
            : undefined;
      } while (token);

      return objects;
    },
  };
}

/* -------------------------------------------------------------------------- */

export interface BackendOptions {
  /** Force a backend instead of picking the best available one. */
  force?: BackendId;
  /** Per-backend parallelism. Defaults suit media-sized uploads. */
  concurrency?: { s3?: number; wrangler?: number };
}

export function selectBackend(spec: BucketSpec, options: BackendOptions = {}): Backend {
  const s3Concurrency = options.concurrency?.s3 ?? 16;
  const wranglerConcurrency = options.concurrency?.wrangler ?? 8;

  if (options.force === "wrangler") return wranglerBackend(spec, wranglerConcurrency);

  const creds = readS3Credentials();

  if (options.force === "s3") {
    if (!creds) {
      throw new Error(
        "--s3 needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY " +
          "(a .env at the repo root is read automatically)",
      );
    }
    return s3Backend(creds, spec, s3Concurrency);
  }

  return creds
    ? s3Backend(creds, spec, s3Concurrency)
    : wranglerBackend(spec, wranglerConcurrency);
}

/* -------------------------------------------------------------------------- */
/* Credential-free reads through the public origin                             */
/* -------------------------------------------------------------------------- */

/**
 * Confirms an object is really in the bucket.
 *
 * A local manifest is a ledger and can drift — a wiped bucket, a failed run on
 * another machine, an object deleted by hand. This is the safety net that lets
 * a run heal itself, and it needs no credentials.
 */
export async function objectExists(spec: BucketSpec, key: string, attempts = 3) {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch(publicUrlFor(spec, key), {
        method: "HEAD",
        signal: controller.signal,
      });

      if (response.status === 200) {
        return { exists: true, size: Number(response.headers.get("content-length") ?? 0) };
      }
      if (response.status === 404) return { exists: false, size: 0 };

      // 429 / 5xx from r2.dev are transient — worth another go.
      throw new Error(`unexpected status ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 400 * 2 ** (attempt - 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError ?? new Error("unknown error");
}

/** Downloads an object through the public origin. Used by `pull`. */
export async function downloadObject(spec: BucketSpec, key: string, attempts = 3) {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120_000);

    try {
      const response = await fetch(publicUrlFor(spec, key), { signal: controller.signal });

      if (response.status === 404) return undefined;
      if (!response.ok) throw new Error(`unexpected status ${response.status}`);

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error as Error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (attempt - 1)));
      }
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError ?? new Error("unknown error");
}

export { readS3Credentials };
