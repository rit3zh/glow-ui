import { join } from "node:path";

import { ROOT } from "../lib/env";

export type StepId =
  | "encode"
  | "assets"
  | "previews"
  | "mockups"
  | "codebase"
  | "registry"
  | "scaffold"
  | "docs";

export interface Step {
  id: StepId;
  /** One line, shown in the plan and in `--help`. */
  label: string;
  /** Script run with `bun`. */
  script: string;
  /** Working directory. Only matters for scripts that use relative paths. */
  cwd?: string;
  /** Which of the shared flags this step understands. */
  accepts: readonly ("dry" | "check" | "force" | "prune" | "verify" | "backend")[];
  /** Always appended — the step's own defaults. */
  extraArgs?: readonly string[];
  /** Skipped, with a note, when this says why it cannot run. */
  precondition?: () => Promise<string | undefined>;
}

const WEBSITE = join(ROOT, "website");

/**
 * The pipeline, in dependency order. Every arrow here is real:
 *
 *  - `encode` first, because `previews` uploads what it produces.
 *  - `registry` before `codebase`, because it rewrites
 *    `src/components/registry.json` — which `codebase` then mirrors. The other
 *    way round leaves the bucket one revision behind on every single run.
 *  - the media syncs before `docs`, because the TypeScript they generate is
 *    where the website reads its clip URLs from.
 *  - `codebase` before `scaffold`, because scaffolding reads the generated
 *    types to build each new page's props table.
 */
export const steps: readonly Step[] = [
  {
    id: "encode",
    label: "build the WebM half of every preview (needs ffmpeg)",
    script: "cloudflare/previews/encode.ts",
    accepts: ["force"],
  },
  {
    id: "assets",
    label: "landing clips & stills → reacticx-landing-assets",
    script: "cloudflare/sync/index.ts",
    accepts: ["dry", "check", "force", "prune", "backend"],
  },
  {
    id: "previews",
    label: "transparent page previews → reacticx-v2-previews",
    script: "cloudflare/previews/index.ts",
    accepts: ["dry", "check", "force", "prune", "verify", "backend"],
  },
  {
    id: "mockups",
    label: "v2 block mockups → reacticx-v2-mockups",
    script: "cloudflare/mockups/index.ts",
    accepts: ["dry", "check", "force", "prune", "verify", "backend"],
  },
  {
    id: "registry",
    label: "regenerate registry.json from src/components",
    script: "scripts/cli/generate-registry/index.ts",
    cwd: ROOT,
    accepts: [],
  },
  {
    id: "codebase",
    label: "component source → reacticx-codebase",
    script: "cloudflare/codebase/index.ts",
    accepts: ["dry", "check", "force", "prune", "verify", "backend"],
  },
  {
    id: "scaffold",
    label: "write docs pages for components that have none",
    script: "website/scripts/components/scaffold.ts",
    cwd: WEBSITE,
    accepts: ["dry", "force"],
  },
  {
    id: "docs",
    label: "regenerate the sidebar and the website's typed registry",
    script: "website/scripts/components/index.ts",
    cwd: WEBSITE,
    accepts: ["dry", "check"],
  },
];

export const stepIds = steps.map((step) => step.id);

export function stepById(id: string) {
  return steps.find((step) => step.id === id);
}
