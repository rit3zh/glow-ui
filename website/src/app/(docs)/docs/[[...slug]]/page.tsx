import type { TOCItemType } from "fumadocs-core/server";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getMDXComponents } from "@/app/mdx-components";
import { DocsPageShell } from "@/components/docs/page";
import { siteConfig } from "@/app/config/site";
import { source } from "#/lib/source";

export const dynamic = "force-static";
export const dynamicParams = false;

/** The section's own folder inside the shared collection. */
const SECTION = "docs";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;
  const page = source.getPage([SECTION, ...slug]);
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
        components={getMDXComponents({
          a: createRelativeLink(source, page),
        })}
      />
    </DocsPageShell>
  );
}

export function generateStaticParams() {
  return source
    .generateParams()
    .filter(({ slug }) => slug[0] === SECTION)
    .map(({ slug }) => ({ slug: slug.slice(1) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage([SECTION, ...slug]);
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
