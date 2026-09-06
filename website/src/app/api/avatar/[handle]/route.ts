import type { NextRequest } from "next/server";

/**
 * Avatar proxy for X handles, backed by unavatar.io.
 *
 * Avatars are fetched once and then cached in three places so the landing page
 * never hits unavatar on a warm request:
 *
 *   1. Cloudflare's cache for the subrequest (`cf.cacheTtl`),
 *   2. Cloudflare's cache for this route's own response (`caches.default`),
 *   3. the browser (`Cache-Control`).
 *
 * Handles change rarely and a stale avatar is harmless, so the TTLs are long
 * and revalidation happens in the background.
 */

/** X handles: letters, digits and underscore, up to 15 characters. */
const HANDLE = /^\w{1,15}$/;

const HOUR = 3600;
const DAY = 24 * HOUR;

/** Browser cache lifetime for a resolved avatar. */
const BROWSER_TTL = 7 * DAY;
/** Edge cache lifetime — served stale for a further 30 days while refreshing. */
const EDGE_TTL = 30 * DAY;
/**
 * A monogram means the lookup failed, so it is never held by the browser and
 * only briefly at the edge — otherwise one bad upstream response freezes a
 * placeholder into every visitor's cache.
 */
const FALLBACK_TTL = 5 * 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;

  if (!HANDLE.test(handle)) {
    return new Response("Invalid handle", { status: 400 });
  }

  const cache = edgeCache();
  const cacheKey = new Request(new URL(request.url).toString());
  const hit = await cache?.match(cacheKey);
  if (hit) return hit;

  const response = await load(handle);

  // The body is already buffered, so the cached copy and the returned copy can
  // both be built from it without cloning a stream.
  try {
    await cache?.put(cacheKey, response.clone());
  } catch {
    // A non-cacheable response (or no edge cache at all) is not an error.
  }

  return response;
}

async function load(handle: string): Promise<Response> {
  try {
    // No `ttl` param — a custom TTL is a paid unavatar feature and passing it
    // makes every request 403. Caching is handled entirely on our side.
    const upstream = await fetch(
      `https://unavatar.io/x/${handle}?fallback=false`,
      {
        headers: { accept: "image/*" },
        // Honoured on Cloudflare, ignored elsewhere.
        cf: { cacheEverything: true, cacheTtl: EDGE_TTL },
      } as RequestInit,
    );

    if (!upstream.ok) return monogram(handle);

    const body = await upstream.arrayBuffer();
    if (body.byteLength === 0) return monogram(handle);

    return new Response(body, {
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
        "cache-control": `public, max-age=${BROWSER_TTL}, s-maxage=${EDGE_TTL}, stale-while-revalidate=${EDGE_TTL}`,
      },
    });
  } catch {
    return monogram(handle);
  }
}

/**
 * Deterministic fallback: the handle's initial on a hue derived from its
 * characters, so a missing avatar still reads as a distinct person.
 */
function monogram(handle: string): Response {
  let hash = 0;
  for (const char of handle) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }

  const initial = handle.slice(0, 1).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><rect width="80" height="80" fill="hsl(${hash} 18% 16%)"/><text x="40" y="41" fill="hsl(${hash} 22% 68%)" font-family="system-ui, sans-serif" font-size="34" font-weight="500" text-anchor="middle" dominant-baseline="central">${initial}</text></svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml",
      "cache-control": `public, max-age=0, s-maxage=${FALLBACK_TTL}, must-revalidate`,
    },
  });
}

/** `caches.default` exists on Workers only; `next dev` runs without it. */
function edgeCache(): Cache | undefined {
  if (typeof caches === "undefined") return;
  return (caches as unknown as { default?: Cache }).default;
}
