import { highlight } from "fumadocs-core/highlight";
import type { ReactNode } from "react";

import { CodeBlockPanel } from "@/components/component-docs/code-panel";
import {
  CODEBASE_FOLDERS,
  fetchCodebaseFile,
  listComponentFiles,
  readComponentFile,
} from "@/lib/codebase";

/**
 * Which bucket folder each kind of source comes from.
 *
 * The `reacticx-codebase` bucket mirrors the library repo and is the only
 * copy — the flat per-kind directories that used to sit under the site root
 * (`react-native/`, `react-native-usage/`) were a second copy that had to be
 * kept in step by hand, and are gone.
 */
const SOURCES = {
  component: { folder: CODEBASE_FOLDERS.core },
  usage: { folder: CODEBASE_FOLDERS.examples },
} as const;

type SourceKind = keyof typeof SOURCES;

function readSource(kind: SourceKind, name: string) {
  return readComponentFile(SOURCES[kind].folder, name, "index.tsx");
}

/** The shiki language for a file, from its extension. */
function langFor(file: string) {
  if (file.endsWith(".tsx")) return "tsx";
  if (file.endsWith(".ts")) return "ts";
  if (file.endsWith(".jsx")) return "jsx";
  return "js";
}

export interface HighlightedSource {
  /** The raw file, trimmed — what the copy button hands over. */
  code: string;
  /** The highlighted markup. */
  rendered: ReactNode;
  filename: string;
}

/**
 * Read and highlight a synced source file at build time.
 *
 * Returns `null` when the file has not been synced yet, which is a gap in the
 * sync rather than a broken page — callers degrade instead of failing.
 */
export async function loadHighlightedSource(
  kind: SourceKind,
  name: string,
  preClassName = "no-scrollbar max-h-128 overflow-auto px-5 py-6 font-mono text-[13.5px] leading-[1.7]",
): Promise<HighlightedSource | null> {
  const code = await readSource(kind, name);
  if (!code) return null;

  const trimmed = code.trim();
  const rendered = await highlight(trimmed, {
    lang: "tsx",
    engine: "js",
    themes: { light: "github-light", dark: "github-dark" },
    components: {
      pre: ({ children, ...props }) => (
        <pre {...props} className={preClassName}>
          {children}
        </pre>
      ),
    },
  });

  return { code: trimmed, rendered, filename: `${name}.tsx` };
}

/**
 * Highlight code that has already been read.
 *
 * The loaders below differ only in where the bytes come from, so the shiki call
 * lives here once rather than in each of them.
 */
export async function highlightSource(
  code: string,
  filename: string,
  preClassName?: string,
): Promise<HighlightedSource> {
  const trimmed = code.trim();

  const rendered = await highlight(trimmed, {
    lang: langFor(filename),
    engine: "js",
    themes: { light: "github-light", dark: "github-dark" },
    components: {
      pre: ({ children, ...props }) => (
        <pre
          {...props}
          className={
            preClassName ??
            "no-scrollbar px-5 pb-10 font-mono text-[13.5px] leading-[1.7]"
          }
        >
          {children}
        </pre>
      ),
    },
  });

  return { code: trimmed, rendered, filename };
}

export interface HighlightedTreeFile extends HighlightedSource {
  /** Path relative to the component folder, e.g. `hooks/useTray.ts`. */
  path: string;
}

/**
 * Every file in a component's folder, highlighted at build time.
 *
 * The tree shows the folder as it actually is, so this reads all of it rather
 * than a hand-listed pair. Files are highlighted here rather than when a row is
 * clicked, so opening one costs nothing.
 *
 * Returns an empty array when the component is not in the bucket, which the
 * caller shows as a gap rather than a broken page.
 */
export async function loadComponentTree(
  folder: Parameters<typeof listComponentFiles>[0],
  component: string,
  /**
   * Class list for each file's `pre`. Optional, and unset it keeps the padded
   * default — the panel a file opens into decides its own inset, and the two
   * sections hold them in differently shaped panels.
   */
  preClassName?: string,
): Promise<HighlightedTreeFile[]> {
  const refs = await listComponentFiles(folder, component);

  const loaded = await Promise.all(
    refs.map(async (ref) => {
      const code = await fetchCodebaseFile(ref.key);
      if (code === null) return null;

      const filename = ref.path.split("/").pop()!;
      return {
        ...(await highlightSource(code, filename, preClassName)),
        path: ref.path,
      };
    }),
  );

  return loaded.filter((file): file is HighlightedTreeFile => file !== null);
}

/**
 * A synced React Native source file, highlighted at build time.
 *
 * A missing file is a sync gap rather than a broken page, so it degrades to a
 * note instead of failing the build.
 */
export async function SourceCode({
  kind,
  name,
}: {
  kind: SourceKind;
  name: string;
}) {
  const source = await loadHighlightedSource(kind, name);

  if (!source) {
    return (
      <div className="rounded-xl border-[0.5px] border-border bg-card px-4 py-3 text-[13px] text-muted-foreground">
        Source for <code className="font-mono">{name}</code> is not synced yet.
      </div>
    );
  }

  return <CodeBlockPanel copyCode={source.code}>{source.rendered}</CodeBlockPanel>;
}
