import { setDefaultResultOrder } from "node:dns";
import type { Registry } from "../typings/index.js";

const REGISTRY_URL = "https://reacticx-ui-components.pages.dev";

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 500;

const CONNECT_ERROR_CODES = new Set([
  "UND_ERR_CONNECT_TIMEOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "ETIMEDOUT",
]);

let ipv4FallbackApplied = false;

function getTimeout(): number {
  const raw = Number(process.env.REACTICX_FETCH_TIMEOUT);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}

/** Whether the request failed before a connection could be established. */
function isConnectFailure(error: unknown): boolean {
  const code = (error as { cause?: { code?: string } })?.cause?.code;
  return code !== undefined && CONNECT_ERROR_CODES.has(code);
}

/**
 * Prefer IPv4 for the remaining attempts. Dual-stack networks frequently
 * advertise an AAAA record for the registry host that they cannot actually
 * route, so the first connect hangs until it times out (see issue #39).
 */
function preferIPv4(): void {
  if (ipv4FallbackApplied) return;
  ipv4FallbackApplied = true;
  try {
    setDefaultResultOrder("ipv4first");
  } catch {
    // Older runtimes without `dns.setDefaultResultOrder` simply retry as-is.
  }
}

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * `fetch` only rejects on transport-level failures — an HTTP error status
 * resolves normally — so anything thrown here is worth another attempt.
 */
async function fetchWithRetry(url: string): Promise<Response> {
  const timeout = getTimeout();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(timeout) });
    } catch (error) {
      lastError = error;
      if (attempt === MAX_ATTEMPTS) break;

      if (isConnectFailure(error)) preferIPv4();
      await delay(RETRY_DELAY_MS * attempt);
    }
  }

  const error = new Error(
    `Could not reach the Reacticx registry at ${url}.\n` +
      `Check your internet connection or proxy settings. If your network is ` +
      `slow, raise the timeout with REACTICX_FETCH_TIMEOUT=<milliseconds> ` +
      `(currently ${timeout}ms).`,
  );
  (error as Error & { cause?: unknown }).cause = lastError;
  throw error;
}

export async function getRegistry(): Promise<Registry> {
  const url = `${REGISTRY_URL}/registry.json`;
  const response = await fetchWithRetry(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch registry (${response.status} ${response.statusText})`,
    );
  }

  return response.json();
}

export async function getComponentCode(
  componentPath: string,
  fileName: string,
): Promise<string> {
  const cleanPath = componentPath.replace(/^src\/components\//, "");
  const url = `${REGISTRY_URL}/${cleanPath}/${fileName}`;

  const response = await fetchWithRetry(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${fileName} (${response.status} ${response.statusText})`,
    );
  }

  return response.text();
}
