/**
 * Credential loading for every R2 tool in this folder.
 *
 * The fast S3 path needs three values. Asking people to export them into every
 * shell is the kind of friction that ends with someone running the slow
 * wrangler path forever without realising there was a faster one, so a
 * `.env` / `.env.local` at the repo root is read here once, at import time,
 * and never overrides something already in the environment.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Files read in order; the first definition of a key wins. */
const ENV_FILES = [".env.local", ".env"] as const;

function parse(contents: string) {
  const values: Record<string, string> = {};

  for (const rawLine of contents.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).replace(/^export\s+/, "").trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) values[key] ??= value;
  }

  return values;
}

let loaded = false;

/** Idempotent — safe to call from every entry point. */
export function loadEnv() {
  if (loaded) return;
  loaded = true;

  for (const file of ENV_FILES) {
    let contents: string;
    try {
      contents = readFileSync(join(ROOT_DIR, file), "utf8");
    } catch {
      continue;
    }

    for (const [key, value] of Object.entries(parse(contents))) {
      process.env[key] ??= value;
    }
  }
}

loadEnv();

export interface S3Credentials {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * The R2 API credentials, when all three are present.
 *
 * `CLOUDFLARE_*` and `AWS_*` are accepted as aliases because both show up in CI
 * images already configured for one or the other.
 */
export function readS3Credentials(): S3Credentials | undefined {
  loadEnv();

  const accountId = process.env.R2_ACCOUNT_ID ?? process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.R2_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) return undefined;
  return { accountId, accessKeyId, secretAccessKey };
}

export const ROOT = ROOT_DIR;
