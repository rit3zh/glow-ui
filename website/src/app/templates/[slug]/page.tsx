import defaultMdxComponents from "fumadocs-ui/mdx";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { notFound } from "next/navigation";
import { templates } from "#/lib/source";

import Link from "next/link";
import { Header } from "@/components/header/header";
import { LazyVideo } from "@/components/docs/lazy-video";

export const dynamic = "force-static";
export const dynamicParams = false;

const videoMap: Record<string, string> = {
  "chat-v1":
    "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-chat-v1.mp4",
  "settings-v1":
    "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-settings-v1.mp4",
  "sign-up-v1":
    "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-sign-up-v1.mp4",
  "sign-up-v2":
    "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-sign-up-v2.mp4",
  "property-listing":
    "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/property-listing-screen.mp4",
};

function getTemplate(slug: string) {
  return templates.find((t) => t.info.path.replace(/\.mdx$/, "") === slug);
}

export default async function TemplatePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const template = getTemplate(slug);

  if (!template) {
    return notFound();
  }

  const MDX = template.body;
  const hasVideo = !!videoMap[slug];
  const hasPreview = !!template.preview;

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 [background-size:40px_40px] [background-image:linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)]" />
        <div className="absolute inset-0 bg-[#0a0a0b] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_70%)]" />
      </div>

      <Header />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[40%] left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-white/4 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <Link
          href="/templates"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/3 px-4 py-2 text-[13px] font-medium text-neutral-400 backdrop-blur-sm transition-all duration-200 hover:border-white/12 hover:bg-white/6 hover:text-neutral-200"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Templates
        </Link>

        <div className="mb-10">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.035em] text-white">
            {template.title}
          </h1>

          {template.description && (
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-neutral-500">
              {template.description}
            </p>
          )}
        </div>

        {(hasVideo || hasPreview) && (
          <div className="relative mb-12 overflow-hidden rounded-2xl border border-white/6 bg-[#0c0c0e]">
            {hasVideo ? (
              <LazyVideo
                src={videoMap[slug]}
                muted
                autoPlay
                loop
                className="aspect-video w-full object-cover"
              />
            ) : (
              <img
                src={template.preview}
                alt={template.title}
                className="aspect-video w-full object-cover"
              />
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
          </div>
        )}

        <div className="mb-10 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/8 to-transparent" />
        </div>
        <article className="prose prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-p:text-neutral-400 prose-p:leading-relaxed prose-a:text-white prose-a:no-underline hover:prose-a:text-neutral-300 prose-strong:text-white prose-code:rounded prose-code:border prose-code:border-white/6 prose-code:bg-white/4 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal prose-code:text-neutral-300 prose-pre:border prose-pre:border-white/6 prose-pre:bg-[#0c0c0e] prose-img:rounded-xl prose-img:border prose-img:border-white/6">
          <MDX
            components={{
              ...defaultMdxComponents,
              img: (props: any) => <ImageZoom {...props} />,
              video: LazyVideo as any,
              ...TabsComponents,
              Steps,
              Step,
            }}
          />
        </article>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-between">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-[13px] text-neutral-500 transition-colors hover:text-neutral-300"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            All Templates
          </Link>
          <div className="mx-4 h-px flex-1 bg-linear-to-r from-white/6 via-white/4 to-white/6" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-600">
            Reacticx
          </span>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return templates.map((t) => ({
    slug: t.info.path.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const template = getTemplate(slug);

  if (!template) {
    return notFound();
  }

  return {
    title: `${template.title} | Reactix Templates`,
    description: template.description,
  };
}
