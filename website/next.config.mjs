import { createMDX } from "fumadocs-mdx/next";
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Appending `.mdx` to any docs URL serves its markdown source. The section
  // segment is part of the page slug, so it has to survive the rewrite.
  async rewrites() {
    return [
      { source: "/docs.mdx", destination: "/llms.mdx/docs" },
      { source: "/docs/:path*.mdx", destination: "/llms.mdx/docs/:path*" },
      {
        source: "/components/:path*.mdx",
        destination: "/llms.mdx/components/:path*",
      },
      {
        source: "/primitives/:path*.mdx",
        destination: "/llms.mdx/primitives/:path*",
      },
    ];
  },
  // The components section has no index page of its own — the first entry in
  // `meta.json` stands in for one.
  async redirects() {
    return [
      {
        source: "/components",
        destination: "/components/apple-intelligence",
        permanent: false,
      },
      // Primitives moved to their own section. These were live URLs, so they
      // redirect permanently rather than 404.
      {
        source: "/components/alert",
        destination: "/primitives/alert",
        permanent: true,
      },
      {
        source: "/components/avatar",
        destination: "/primitives/avatar",
        permanent: true,
      },
      {
        source: "/components/dialog",
        destination: "/primitives/dialog",
        permanent: true,
      },
      {
        source: "/components/icon-tile",
        destination: "/primitives/icon-tile",
        permanent: true,
      },
      {
        source: "/components/list",
        destination: "/primitives/list",
        permanent: true,
      },
      {
        source: "/components/ripple-button",
        destination: "/primitives/ripple-button",
        permanent: true,
      },
      {
        source: "/components/switch",
        destination: "/primitives/switch",
        permanent: true,
      },
      {
        source: "/components/tabs",
        destination: "/primitives/tabs",
        permanent: true,
      },
      {
        source: "/components/toggle",
        destination: "/primitives/toggle",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Use shiki's "unwasm" export condition so it resolves to the pure-JS
      // implementation (core-unwasm.mjs) instead of the WebAssembly build.
      // This makes it bundle-friendly for Cloudflare Workers.
      config.resolve.conditionNames = [
        "unwasm",
        ...(config.resolve.conditionNames ?? []),
      ];
      // fumadocs-core uses `await import("shiki/core")` which webpack splits into
      // separate async chunks. Cloudflare Workers can't load these at runtime,
      // so force them to be bundled inline (eager mode).
      config.module.rules.push({
        test: /node_modules[\\/](fumadocs-core|shiki)[\\/]/,
        parser: { dynamicImportMode: "eager" },
      });
      // No OG image routes — exclude @vercel/og and its wasm files from the bundle.
      config.resolve.alias["@vercel/og"] = false;
      // The "unwasm" condition maps `shiki/wasm` to the raw onig.wasm binary,
      // which webpack can't parse. Nothing needs it: `highlight()` is called
      // with `engine: "js"`, so only the pure-JS regex engine runs. The eager
      // rule above still pulls the oniguruma branch in, so stub it out.
      config.resolve.alias["shiki/wasm"] = false;
    }
    return config;
  },
};

const withMDX = createMDX({});
export default withMDX(config);

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
