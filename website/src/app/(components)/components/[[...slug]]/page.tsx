import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getComponentMDXComponents } from "@/app/components-mdx-components";
import { siteConfig } from "@/app/config/site";
import { ComponentPageShell } from "@/components/component-docs/page-shell";
import { getComponentPageMeta } from "#/lib/component-page-meta";
import { source } from "#/lib/source";

export const dynamic = "force-static";
export const dynamicParams = false;

/** The section's own folder inside the shared collection. */
const SECTION = "components";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await props.params;
  const page = source.getPage([SECTION, ...slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const { videoSrc, installPath, sourceName } = getComponentPageMeta(
    page.data.content,
    slug.at(-1) ?? "",
    page.data.previewVideo ?? page.data.video,
  );

  // A component with no recording still has a landing asset — the clip or the
  // still the sidebar and the landing cards already show on hover. Standing it
  // in leaves the preview column showing the component instead of an apology,
  // and it costs nothing: the file is derived from the bucket, not authored.
  const previewSrc = videoSrc ?? (page.data.hoverVideo?.trim() || undefined);

  return (
    <ComponentPageShell
      description={page.data.description}
      installPath={installPath}
      lastModified={page.data.lastModified}
      previewSrc={previewSrc}
      slug={slug.at(-1) ?? ""}
      sourceName={sourceName}
      title={page.data.title}
      url={page.url}
    >
      <MDX
        components={getComponentMDXComponents(
          { a: createRelativeLink(source, page) },
          slug.at(-1) ?? "",
        )}
      />
    </ComponentPageShell>
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

  if (!page) {
    return { title: "Components", description: siteConfig.description };
  }

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
