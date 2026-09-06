import { spawn } from "node:child_process";
import { createHash, createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";

import { config, publicUrlFor } from "../config";
import { wranglerBinary } from "../../lib/r2";

export interface Backend {
  id: "s3" | "wrangler";
  label: string;
  concurrency: number;
  put(
    key: string,
    body: Buffer,
    contentType: string,
    cacheControl?: string,
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* wrangler — always available, but every call is a ~3s process spawn.          */
/* -------------------------------------------------------------------------- */

function runWrangler(args: readonly string[]) {
  // wrangler is not a dependency of the repo root, so `npx wrangler` would try
  // to download it once per object. The shared resolver finds the copy the
  // website already installed.
  const { command, prefix } = wranglerBinary();

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, [...prefix, ...args], {
      cwd: config.rootDir,
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

/**
 * wrangler only uploads from disk, so buffered bodies (the generated index)
 * are written to a temp file first.
 */
async function withTempFile(body: Buffer, run: (path: string) => Promise<void>) {
  const { mkdtemp, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");

  const dir = await mkdtemp(join(tmpdir(), "reacticx-codebase-"));
  const file = join(dir, "payload");
  try {
    await writeFile(file, body);
    await run(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const wranglerBackend: Backend = {
  id: "wrangler",
  label: wranglerBinary().command === "npx" ? "wrangler (npx)" : "wrangler",
  concurrency: config.concurrency.wrangler,

  put(key, body, contentType, cacheControl) {
    return withTempFile(body, (file) =>
      runWrangler([
        "r2",
        "object",
        "put",
        `${config.bucket}/${key}`,
        "--file",
        file,
        "--content-type",
        contentType,
        ...(cacheControl ? ["--cache-control", cacheControl] : []),
        "--remote",
      ]),
    );
  },

  delete(key) {
    return runWrangler(["r2", "object", "delete", `${config.bucket}/${key}`, "--remote"]);
  },
};

/* -------------------------------------------------------------------------- */
/* S3 — the fast path, used when R2 API credentials are in the environment.     */
/* -------------------------------------------------------------------------- */

// Shared with the media syncs, so a `.env` at the repo root works for all of
// them rather than only the ones that happened to read it.
export { readS3Credentials, type S3Credentials } from "../../lib/env";
import { readS3Credentials, type S3Credentials } from "../../lib/env";

const sha256 = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
const hmac = (key: Buffer | string, data: string) =>
  createHmac("sha256", key).update(data).digest();

/** Percent-encodes a path, leaving the `/` separators intact. */
const encodePath = (key: string) =>
  key
    .split("/")
    .map((segment) => encodeURIComponent(segment).replace(/[!'()*]/g, (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`))
    .join("/");

/** Minimal AWS SigV4 for single S3 requests — enough for PUT and DELETE. */
async function signedFetch(
  creds: S3Credentials,
  method: "PUT" | "DELETE",
  key: string,
  body: Buffer,
  contentType?: string,
  cacheControl?: string,
) {
  const host = `${creds.accountId}.r2.cloudflarestorage.com`;
  const canonicalUri = `/${encodePath(config.bucket)}/${encodePath(key)}`;
  const payloadHash = sha256(body);

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/auto/s3/aws4_request`;

  const headers: Record<string, string> = {
    host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) headers["content-type"] = contentType;
  // Set before `signedHeaders` is derived, so it is signed as well as sent.
  if (cacheControl) headers["cache-control"] = cacheControl;

  const signedHeaders = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaders.map((name) => `${name}:${headers[name]}\n`).join("");
  const signedHeaderList = signedHeaders.join(";");

  const canonicalRequest = [
    method,
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaderList,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${creds.secretAccessKey}`, dateStamp), "auto"), "s3"),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const response = await fetch(`https://${host}${canonicalUri}`, {
    method,
    headers: {
      ...headers,
      Authorization:
        `AWS4-HMAC-SHA256 Credential=${creds.accessKeyId}/${scope}, ` +
        `SignedHeaders=${signedHeaderList}, Signature=${signature}`,
    },
    body: method === "PUT" ? new Uint8Array(body) : undefined,
  });

  if (!response.ok) {
    const text = (await response.text()).replace(/\s+/g, " ").trim();
    throw new Error(`${response.status} ${response.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`);
  }
}

function s3Backend(creds: S3Credentials): Backend {
  return {
    id: "s3",
    label: "S3 API",
    concurrency: config.concurrency.s3,
    put: (key, body, contentType, cacheControl) =>
      signedFetch(creds, "PUT", key, body, contentType, cacheControl),
    delete: (key) => signedFetch(creds, "DELETE", key, Buffer.alloc(0)),
  };
}

/* -------------------------------------------------------------------------- */

export function selectBackend(force?: Backend["id"]): Backend {
  if (force === "wrangler") return wranglerBackend;

  const creds = readS3Credentials();
  if (force === "s3") {
    if (!creds) {
      throw new Error(
        "--s3 requires R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY",
      );
    }
    return s3Backend(creds);
  }

  return creds ? s3Backend(creds) : wranglerBackend;
}

export const readBody = (filePath: string) => readFile(filePath);

/* -------------------------------------------------------------------------- */
/* Remote verification — a credential-free HEAD against the public origin.      */
/* -------------------------------------------------------------------------- */

/**
 * Confirms an object is actually in the bucket.
 *
 * The manifest is a local ledger and can drift — a wiped bucket, a failed run
 * on another machine, an object deleted by hand. A HEAD against the public
 * origin costs nothing and needs no credentials, so a run can heal itself.
 */
export async function objectExists(key: string, attempts = 3) {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(publicUrlFor(key), {
        method: "HEAD",
        signal: controller.signal,
      });

      if (response.status === 200) return true;
      if (response.status === 404) return false;

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
