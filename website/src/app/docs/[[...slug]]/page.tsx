import { source } from "#/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  PageLastUpdate,
} from "fumadocs-ui/page";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { TOCItemType } from "fumadocs-core/toc";
import { CopyMarkdownButton } from "@/components/copy-markdown-button";
import { ViewOptions } from "@/components/page-actions";
import {
  PreviewClient,
  PreviewComment,
} from "@/components/docs/preview-client";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { ComponentSource } from "@/components/docs/component-source";
import { ExampleComponentSource } from "@/components/docs/example-component-source";
import { AutoTypeTable } from "@/components/docs/auto-type";
import { BundleSizeBadge } from "@/components/bundle-size-badge";
import { LazyVideo } from "@/components/docs/lazy-video";

export const dynamic = "force-static";
export const dynamicParams = false;

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug) as any;
  const lastModifiedTime = page?.data.lastModified;
  if (!page) notFound();

  const MDX = page.data.body;

  // Extract component name if we're in the components section
  const componentName =
    params.slug?.[0] === "components" && params.slug?.[1]
      ? params.slug[1]
      : null;

  return (
    <DocsPage
      footer={{ enabled: false }}
      tableOfContent={{
        enabled: true,
        style: "clerk",
        single: true,
      }}
      toc={page.data.toc as TOCItemType[]}
    >
      <DocsTitle className="ml-2 md:ml-4 lg:ml-8 font-semibold text-4xl tracking-tighter mb-0">
        {page.data.title}
      </DocsTitle>
      <DocsDescription className="ml-2 md:ml-4 lg:ml-8 text-xl tracking-tighter mb-0">
        {page.data.description}
      </DocsDescription>

      {lastModifiedTime && (
        <div className="ml-2 md:ml-4 lg:ml-8">
          <PageLastUpdate date={lastModifiedTime} />
        </div>
      )}

      <div className="ml-2 md:ml-4 lg:ml-8 flex flex-wrap items-center gap-2 md:gap-3 mt-2 border-b pt-2 pb-5">
        <EditOnGitHub
          className="inline-flex flex-shrink-0 items-center gap-1.5 h-7 px-2 md:px-2.5 rounded-md text-xs font-medium bg-fd-secondary text-black dark:text-white border border-fd-border hover:bg-fd-secondary/80 transition-colors [&_svg]:size-3"
          href={`https://github.com/rit3zh/reacticx/tree/main/website/content/docs/${params.slug ? `${params.slug.join("/")}.mdx` : "index.mdx"}`}
        />
        <CopyMarkdownButton
          markdownUrl={`/llms.mdx/${params.slug ? params.slug.join("/") : ""}`}
        />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/rit3zh/reacticx/tree/main/website/content/docs/${params.slug ? `${params.slug.join("/")}.mdx` : "index.mdx"}`}
        />
        {componentName && <BundleSizeBadge slug={componentName} />}
      </div>
      <DocsBody className="ml-2 md:ml-4 lg:ml-8">
        <MDX
          components={{
            ...defaultMdxComponents,
            ...TabsComponents,
            a: createRelativeLink(source, page) as any,
            video: LazyVideo as any,
            PreviewClient,
            PreviewComment,
            ComponentSource,
            ExampleComponentSource,
            AutoTypeTable,
            Steps,
            Step,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
