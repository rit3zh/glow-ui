import type { TOCItemType } from "fumadocs-core/server";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPrimitivesMDXComponents } from "@/app/primitives-mdx-components";
import { DocsPageShell } from "@/components/docs/page";
import { siteConfig } from "@/app/config/site";
import { source } from "#/lib/source";

export const dynamic = "force-static";
export const dynamicParams = false;

/** The section's own folder inside the shared collection. */
const SECTION = "primitives";

/**
 * A primitive's documentation.
 *
 * The same `DocsPageShell` `/docs` uses — a primitive is read the way a guide
 * is, top to bottom, rather than beside a recording the way a component page
 * is. What differs is the MDX mapping: the tags are the ones the pages are
 * authored against here (`ComponentPreview`, `PropTable`, `ComponentInstall`),
 * modelled on the Unlumen docs.
 */
export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const page = source.getPage([SECTION, slug]);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPageShell
      author={page.data.author}
      credits={page.data.credits}
      description={page.data.description}
      full={page.data.full}
      lastModified={page.data.lastModified}
      markdown={page.data.content}
      path={page.path}
      title={page.data.title}
      toc={(page.data.toc ?? []) as TOCItemType[]}
      url={page.url}
    >
      <MDX
        components={getPrimitivesMDXComponents(
          { a: createRelativeLink(source, page) },
          slug,
        )}
      />
    </DocsPageShell>
  );
}

export function generateStaticParams() {
  return source
    .generateParams()
    .filter(({ slug }) => slug[0] === SECTION && slug.length === 2)
    .map(({ slug }) => ({ slug: slug[1]! }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = source.getPage([SECTION, slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}
