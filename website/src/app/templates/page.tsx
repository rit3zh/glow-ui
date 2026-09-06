import Link from "next/link";
import { templates } from "#/lib/source";
import localFont from "next/font/local";
import { GridBackground } from "@/components/templates/grid-background";
import { Header } from "@/components/header/header";
import { AnimatedBadge } from "@/components/animated-badge";

export const dynamic = "force-static";
const satoshi = localFont({
  src: [
    {
      path: "../../assets/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  fallback: ["system-ui", "sans-serif"],
});

export default function TemplatesPage() {
  const allTemplates = templates;

  const videoMap: Record<string, string> = {
    "chat-v1":
      "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-chat-v1.mp4",
    "settings-v1":
      "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-settings-v1.mp4",
    "property-listing":
      "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/property-listing-screen.mp4",
    "sign-up-v1":
      "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-sign-up-v1.mp4",
    "sign-up-v2":
      "https://pub-9197ce7f777e4624837aafbc57c580a2.r2.dev/template-sign-up-v2.mp4",
  };

  return (
    <div
      className={`${satoshi.variable} min-h-screen bg-[#0a0a0b] font-[family-name:var(--font-satoshi)]`}
    >
      <GridBackground />
      <Header />
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[40%] left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/[0.04] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 pt-36 pb-24 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-14">
          <AnimatedBadge
            text={`${allTemplates.length} templates available`}
            color="#fff"
          />
          <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.035em] text-white">
            Templates
          </h1>
          <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-neutral-500">
            Pre-built screen templates to kickstart your app development.
            Production-ready, beautifully crafted.
          </p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allTemplates.map((template, index) => {
            const slug = template._file.path.replace(/\.mdx$/, "");
            const hasVideo = !!videoMap[slug];
            const hasPreview = !!template.preview;

            const tags = template.tags;
            const category = template.category;
            const isPro = (template as any).isPro as boolean | undefined;
            const isComingSoon = (template as any).comingSoon as
              | boolean
              | undefined;

            return (
              <Link
                key={slug}
                href={`/templates/${slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] transition-all duration-300 hover:border-white/[0.12] hover:bg-[#141416] hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
              >
                {/* ── Media preview ── */}
                {(hasVideo || hasPreview) && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c0c0e]">
                    {hasVideo ? (
                      <video
                        src={videoMap[slug]}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <img
                        src={template.preview}
                        alt={template.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    )}

                    {/* Bottom fade overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/20 to-transparent opacity-80" />

                    {/* Top-left category badge */}
                    {category && (
                      <span className="absolute top-3.5 left-3.5 z-10 rounded-md bg-white/[0.1] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-md">
                        {category}
                      </span>
                    )}

                    {/* Top-right Pro badge */}
                    {isPro && (
                      <span className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 rounded-md bg-indigo-500/20 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 backdrop-blur-md">
                        <svg
                          className="h-3 w-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Pro
                      </span>
                    )}

                    {/* Coming soon lock overlay */}
                    {isComingSoon && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[13px] font-medium text-white/70 backdrop-blur-md">
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Coming Soon
                        </span>
                      </div>
                    )}

                    {/* Inner ring for depth */}
                    <div className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-white/[0.04]" />
                  </div>
                )}

                {/* ── Card content ── */}
                <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-white">
                    {template.title}
                  </h2>

                  {template.description && (
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-neutral-500">
                      {template.description}
                    </p>
                  )}

                  {/* Tags row */}
                  {tags && tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover border glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/[0.08]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
