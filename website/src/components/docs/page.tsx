import { findNeighbour, type TOCItemType } from "fumadocs-core/server";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { DocsAuthor } from "@/components/docs/docs-author";
import { FloatingToc } from "@/components/docs/floating-toc";
import { PageActions } from "@/components/docs/page-actions";
import { Footer } from "@/components/workspace-ui/docs/footer";
import { Button } from "@/components/workspace-ui/ui/button";
import { source } from "#/lib/source";

interface Person {
  name: string;
  url?: string;
}

interface DocsPageShellProps {
  title: string;
  description?: string;
  url: string;
  toc: TOCItemType[];
  full?: boolean;
  markdown: string;
  /** Path within `content/`, e.g. `docs/usage.mdx`. */
  path: string;
  /** `lastModifiedTime: "git"` hands this back as a serialized date, not a Date. */
  lastModified?: Date | string | number;
  author?: Person;
  credits?: Person;
  children: ReactNode;
}

/**
 * The frame every docs page renders inside.
 *
 * The neighbour links walk the tree from the page's own URL, so nothing here
 * needs to be told which section it is in.
 */
export function DocsPageShell({
  title,
  description,
  url,
  toc,
  full,
  markdown,
  path,
  lastModified,
  author,
  credits,
  children,
}: DocsPageShellProps) {
  const { previous, next } = findNeighbour(source.getPageTree(), url);

  return (
    <DocsPage
      toc={toc}
      full={full}
      // The framework rail is replaced by the docked control at the end of this
      // component, which also releases the width the rail reserved on the right.
      tableOfContent={{ enabled: false }}
      tableOfContentPopover={{ enabled: false }}
      footer={{
        component: (
          <Footer
            lastUpdate={lastModified ? new Date(lastModified) : undefined}
          />
        ),
      }}
    >
      <div className="flex w-full flex-row items-start justify-between gap-2">
        <DocsTitle className="font-serif text-4xl font-light tracking-normal sm:text-5xl">
          {title}
        </DocsTitle>

        {(previous || next) && (
          <div className="flex flex-row items-center gap-1.5 pt-0.5">
            <Link
              href={previous?.url ?? url}
              aria-disabled={!previous}
              aria-label={
                previous ? `Go to ${previous.name}` : "No previous page"
              }
              className={
                !previous ? "pointer-events-none opacity-50" : undefined
              }
            >
              <Button variant="accent" size="icon-sm">
                <ArrowLeft />
              </Button>
            </Link>
            <Link
              href={next?.url ?? url}
              aria-disabled={!next}
              aria-label={next ? `Go to ${next.name}` : "No next page"}
              className={!next ? "pointer-events-none opacity-50" : undefined}
            >
              <Button variant="accent" size="icon-sm">
                <ArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {description && (
        <DocsDescription className="mb-1 mt-3 text-base font-normal text-muted-foreground md:text-lg">
          {description}
        </DocsDescription>
      )}

      {author && (
        <DocsAuthor name={author.name} url={author.url} credits={credits} />
      )}

      <PageActions className="mt-4" markdown={markdown} path={path} url={url} />

      <DocsBody id="docs-body" className="pb-10 pt-4">
        {children}
      </DocsBody>

      <FloatingToc toc={toc} />
    </DocsPage>
  );
}
