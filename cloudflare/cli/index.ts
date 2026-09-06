#!/usr/bin/env bun
/**
 * `reacticx cloud` — one command for everything that lives outside git.
 *
 * The recordings are the heaviest thing this project produces, and they change
 * constantly. Committing them meant every clone carried every version of every
 * clip, so the buckets hold the media and git holds the ledgers that describe
 * it. That trade only works if pushing is a single, boring command rather than
 * five in the right order with the right flags, which is what this is:
 *
 *   push      encode → upload media → upload source → regenerate both registries
 *   pull      restore the local media folders from the buckets
 *   status    what is out of sync, changing nothing
 *   doctor    check the tools and credentials the pipeline needs
 *
 * Every step is one of the focused CLIs next door, run as a child process so its
 * own output, flags and exit code are the ones you see. Nothing is reimplemented
 * here — this decides order, passes flags through, and stops on the first
 * failure so a half-uploaded bucket is never followed by a registry that claims
 * the upload worked.
 */
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { join } from "node:path";

import { ROOT, readS3Credentials } from "../lib/env";
import { c, formatDuration, log } from "../sync/lib/log";
import { config as landingConfig } from "../sync/config";
import { config as previewsConfig } from "../previews/config";
import { objectExists } from "../lib/r2";
import { steps, stepIds, type Step, type StepId } from "./steps";

type Command = "push" | "pull" | "status" | "doctor" | "help";

const COMMANDS: Command[] = ["push", "pull", "status", "doctor", "help"];

interface Flags {
  dry: boolean;
  check: boolean;
  force: boolean;
  prune: boolean;
  verify: boolean;
  backend?: "s3" | "wrangler";
  only: StepId[];
  skip: StepId[];
  /** Keep going after a failing step instead of stopping. */
  keepGoing: boolean;
  help: boolean;
  /** Everything after `--`, handed to `pull`. */
  passthrough: string[];
}

const HELP = `
${c.bold("reacticx cloud")} — push the media and the source that are too big for git

${c.dim("Usage")}
  bun run cloud [command] [flags]

${c.dim("Commands")}
  ${c.cyan("push".padEnd(10))} ${c.dim("(default) run the whole pipeline, in order")}
  ${c.cyan("pull".padEnd(10))} ${c.dim("restore cloudflare/landing-assets, v2-preview and v2-preview-webm")}
  ${c.cyan("status".padEnd(10))} ${c.dim("report what is out of sync — uploads nothing")}
  ${c.cyan("doctor".padEnd(10))} ${c.dim("check tools, credentials and connectivity")}

${c.dim("Pipeline")}
${steps.map((step) => `  ${c.cyan(step.id.padEnd(10))} ${c.dim(step.label)}`).join("\n")}

${c.dim("Flags")}
      --only <ids>   run only these steps: ${stepIds.join(", ")}
      --skip <ids>   run everything except these
  -n, --dry          print each step's plan, change nothing
      --check        exit 1 when anything is out of sync (for CI)
  -f, --force        re-upload and re-encode everything
      --prune        delete bucket objects whose local file is gone
      --verify       confirm every unchanged object is really in its bucket
      --keep-going   do not stop at the first failing step
      --wrangler     force the wrangler backend
      --s3           force the direct S3 backend
  -h, --help         show this help

${c.dim("Credentials")}
  ${c.bold("wrangler login")} is enough. For uploads that take seconds rather than
  minutes, put R2 API credentials in a ${c.bold(".env")} at the repo root:

    R2_ACCOUNT_ID=…
    R2_ACCESS_KEY_ID=…
    R2_SECRET_ACCESS_KEY=…

  ${c.dim("`pull` needs none of this — it reads the public origins.")}

${c.dim("Typical use")}
  bun run cloud              ${c.dim("after recording or changing anything")}
  bun run cloud status       ${c.dim("before pushing to GitHub")}
  bun run cloud pull         ${c.dim("on a fresh clone, to get the media back")}
`;

function parseList(argv: readonly string[], flag: string): StepId[] {
  const index = argv.findIndex((arg) => arg === flag || arg.startsWith(`${flag}=`));
  if (index === -1) return [];

  const raw = argv[index]!.includes("=") ? argv[index]!.split("=")[1] : argv[index + 1];
  const requested = (raw ?? "").split(",").map((part) => part.trim()).filter(Boolean);

  if (requested.length === 0) throw new Error(`${flag} needs a value: ${stepIds.join(", ")}`);

  const unknown = requested.filter((id) => !stepIds.includes(id as StepId));
  if (unknown.length > 0) {
    throw new Error(`unknown step ${unknown.join(", ")} — expected ${stepIds.join(", ")}`);
  }

  return requested as StepId[];
}

function parse(argv: readonly string[]): { command: Command; flags: Flags } {
  const separator = argv.indexOf("--");
  const own = separator === -1 ? [...argv] : argv.slice(0, separator);
  const passthrough = separator === -1 ? [] : argv.slice(separator + 1);

  const first = own[0];
  const command = (COMMANDS as string[]).includes(first ?? "")
    ? (first as Command)
    : ("push" as Command);

  const has = (...names: string[]) => names.some((name) => own.includes(name));

  return {
    command,
    flags: {
      dry: has("--dry", "--dry-run", "-n"),
      check: has("--check"),
      force: has("--force", "-f"),
      prune: has("--prune"),
      verify: has("--verify"),
      backend: has("--s3") ? "s3" : has("--wrangler") ? "wrangler" : undefined,
      only: parseList(own, "--only"),
      skip: parseList(own, "--skip"),
      keepGoing: has("--keep-going"),
      help: has("--help", "-h"),
      passthrough,
    },
  };
}

/** The flags a step actually understands, out of the ones that were given. */
function argsFor(step: Step, flags: Flags) {
  const args: string[] = [];
  const accepts = (name: (typeof step.accepts)[number]) => step.accepts.includes(name);

  if (flags.dry && accepts("dry")) args.push("--dry");
  if (flags.check && accepts("check")) args.push("--check");
  if (flags.force && accepts("force")) args.push("--force");
  if (flags.prune && accepts("prune")) args.push("--prune");
  if (flags.verify && accepts("verify")) args.push("--verify");
  if (flags.backend && accepts("backend")) args.push(`--${flags.backend}`);

  return [...args, ...(step.extraArgs ?? [])];
}

function run(script: string, args: readonly string[], cwd: string) {
  return new Promise<number>((resolve, reject) => {
    const child = spawn("bun", [join(ROOT, script), ...args], {
      cwd,
      stdio: "inherit",
      env: { ...process.env },
    });

    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

const exists = (path: string) =>
  access(path).then(
    () => true,
    () => false,
  );

/** Whether `name` resolves on PATH. */
function onPath(name: string) {
  return new Promise<boolean>((resolve) => {
    const child = spawn("which", [name], { stdio: "ignore" });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

/* -------------------------------------------------------------------------- */
/* push / status                                                               */
/* -------------------------------------------------------------------------- */

async function selectSteps(flags: Flags) {
  const chosen = steps.filter((step) => {
    if (flags.only.length > 0) return flags.only.includes(step.id);
    return !flags.skip.includes(step.id);
  });

  const runnable: Step[] = [];
  const readOnly = flags.dry || flags.check;

  for (const step of chosen) {
    // `status` and `--dry` promise to change nothing. A step with no read-only
    // mode of its own cannot keep that promise — the registry generators write
    // their output file unconditionally — so it sits the run out rather than
    // quietly rewriting something.
    if (readOnly && !step.accepts.includes("dry") && !step.accepts.includes("check")) {
      log.skip(`${step.id} — no read-only mode, skipped`);
      continue;
    }

    // Encoding is the one step with a hard external dependency. Missing ffmpeg
    // is not a failure — every WebM that has already been built is still on
    // disk and still uploads — so it is skipped with a note rather than
    // stopping a push that is otherwise fine.
    if (step.id === "encode" && !(await onPath("ffmpeg"))) {
      log.warn(
        `skipping ${c.bold("encode")} — ${c.dim("ffmpeg is not on PATH (brew install ffmpeg)")}`,
      );
      continue;
    }

    // A step can declare its own reason for sitting out — a bucket that has not
    // been configured yet, say. Like the ffmpeg check above, that is a skip
    // with a note rather than a failure: the rest of the push is still valid.
    const blocked = await step.precondition?.();
    if (blocked) {
      log.warn(`skipping ${c.bold(step.id)} — ${c.dim(blocked)}`);
      continue;
    }

    runnable.push(step);
  }

  return runnable;
}

async function push(flags: Flags) {
  const startedAt = performance.now();
  const chosen = await selectSteps(flags);

  if (chosen.length === 0) {
    log.warn("no steps selected");
    return 0;
  }

  console.log(
    `\n${c.bold(c.magenta("◆"))} ${c.bold("reacticx cloud")} ${c.dim(
      `· ${chosen.length} step(s)${flags.dry ? " · dry run" : ""}${flags.check ? " · check" : ""}`,
    )}`,
  );
  for (const [index, step] of chosen.entries()) {
    console.log(
      `${c.dim("│")} ${c.dim(`${index + 1}.`)} ${c.cyan(step.id.padEnd(10))} ${c.dim(step.label)}`,
    );
  }
  console.log(c.dim("╰─"));

  const failed: StepId[] = [];

  for (const [index, step] of chosen.entries()) {
    const args = argsFor(step, flags);

    console.log(
      `\n${c.dim("─".repeat(4))} ${c.bold(`${index + 1}/${chosen.length}`)} ` +
        `${c.bold(c.cyan(step.id))} ${c.dim(args.join(" "))}`,
    );

    const code = await run(step.script, args, step.cwd ?? ROOT);

    if (code !== 0) {
      failed.push(step.id);
      if (!flags.keepGoing) {
        log.blank();
        log.error(
          `${c.bold(step.id)} exited ${code} — stopping here so nothing downstream ` +
            `reports a success that did not happen`,
        );
        log.end(
          c.red("cloud push failed") +
            c.dim(` · rerun with --only ${step.id} once it is fixed, or --keep-going`),
        );
        return 1;
      }
    }
  }

  log.blank();

  if (failed.length > 0) {
    log.end(c.red(`${failed.length} step(s) failed: ${failed.join(", ")}`));
    return 1;
  }

  log.end(
    c.green(flags.dry ? "dry run complete" : flags.check ? "everything in sync" : "everything pushed") +
      c.dim(` · ${chosen.length} steps in ${formatDuration(performance.now() - startedAt)}`),
  );
  return 0;
}

/* -------------------------------------------------------------------------- */
/* doctor                                                                      */
/* -------------------------------------------------------------------------- */

async function doctor() {
  log.title("cloud doctor");

  let blocking = 0;

  const creds = readS3Credentials();
  if (creds) {
    log.success(
      `R2 API credentials ${c.dim(`· account ${creds.accountId.slice(0, 8)}… · uploads go over S3`)}`,
    );
  } else {
    log.warn(
      `no R2 API credentials ${c.dim("· uploads fall back to wrangler, roughly 3s per file")}`,
    );
    log.skip("set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in a .env at the repo root");
  }

  if (await onPath("ffmpeg")) log.success(`ffmpeg ${c.dim("· preview WebM encoding available")}`);
  else {
    log.warn(`ffmpeg missing ${c.dim("· `encode` is skipped; brew install ffmpeg")}`);
  }

  // Dimensions are read out of the file headers directly, so this is only ever
  // the fallback for a format the reader does not know.
  log.success(
    `clip dimensions ${c.dim(
      `· read natively${(await onPath("ffprobe")) ? ", ffprobe available as a fallback" : ""}`,
    )}`,
  );

  for (const dir of [
    landingConfig.sourceDir,
    ...previewsConfig.sources.map((source) => source.dir),
  ]) {
    const label = dir.slice(ROOT.length + 1);
    if (await exists(dir)) log.success(`${label} ${c.dim("· present")}`);
    else {
      log.error(`${label} ${c.dim("· missing — run `bun run cloud pull`")}`);
      blocking += 1;
    }
  }

  for (const spec of [
    { name: landingConfig.bucket, spec: landingConfig, probe: "accordion-landing-asset.mp4" },
    { name: previewsConfig.bucket, spec: previewsConfig, probe: "accordion-preview.webm" },
  ]) {
    try {
      const remote = await objectExists(
        { bucket: spec.spec.bucket, publicOrigin: spec.spec.publicOrigin },
        spec.probe,
      );
      if (remote.exists) log.success(`${spec.name} ${c.dim("· reachable")}`);
      else log.warn(`${spec.name} ${c.dim(`· reachable, but ${spec.probe} is not there`)}`);
    } catch (error) {
      log.error(`${spec.name} ${c.dim(`· unreachable — ${(error as Error).message}`)}`);
      blocking += 1;
    }
  }

  log.blank();

  if (blocking > 0) {
    log.end(c.red(`${blocking} problem(s) would stop a push`));
    return 1;
  }

  log.end(c.green("ready to push"));
  return 0;
}

/* -------------------------------------------------------------------------- */

async function main() {
  const { command, flags } = parse(process.argv.slice(2));

  if (flags.help || command === "help") {
    console.log(HELP);
    return;
  }

  let code = 0;

  switch (command) {
    case "pull":
      code = await run(
        "cloudflare/pull/index.ts",
        [...(flags.dry ? ["--dry"] : []), ...(flags.force ? ["--force"] : []), ...flags.passthrough],
        ROOT,
      );
      break;

    case "status":
      // Same pipeline, read-only: every step that understands `--check` reports
      // its drift, and the ones that cannot are asked for a plan instead.
      code = await push({ ...flags, check: true, dry: true, force: false, prune: false });
      break;

    case "doctor":
      code = await doctor();
      break;

    default:
      code = await push(flags);
  }

  process.exitCode = code;
}

main().catch((error: Error) => {
  log.blank();
  log.error(error.message);
  log.end(c.red("cloud failed"));
  process.exitCode = 1;
});
