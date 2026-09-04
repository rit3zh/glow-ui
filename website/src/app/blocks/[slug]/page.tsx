import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/app/config/site";
import {
  BlockSource,
  type BlockSourceFile,
} from "@/components/blocks-preview/block-source";
import { IPhoneMockup } from "@/components/blocks-preview/iphone-mockup";
import { InstallCommand } from "@/components/component-docs/install-command";
import { highlightSource } from "@/components/component-docs/source-code";
import { ForceDarkTheme } from "@/components/force-dark-theme";
import { BottomEdgeBlur } from "@/components/landing/bottom-edge-blur";
import { Footer } from "@/components/landing/footer";
import {
  MobileNavDrawer,
  MobileNavProvider,
  MobileNavShell,
} from "@/components/landing/mobile-nav";
import { Navbar } from "@/components/landing/navbar";
import {
  CODEBASE_FOLDERS,
  fetchCodebaseFile,
  listFilesInDir,
} from "@/lib/codebase";
import {
  mockupCategories,
  v2Mockups,
  type Mockup,
} from "@/lib/v2-mockups.generated";

export const dynamic = "force-static";
export const dynamicParams = false;

/**
 * The block's folder inside the `core` bucket prefix.
 *
 * `block` is the entry point as it sits in the repo —
 * `src/components/blocks/<category>/<dir>/index.tsx` — and `core/` mirrors
 * `src/components`, so the two differ only by that prefix and the file name.
 * Deriving it beats guessing from the slug: three of these directories are not
 * named after their screenshot.
 */
function blockDir(mockup: Mockup) {
  if (!mockup.block) return null;
  return mockup.block.replace(/^src\/components\//, "").replace(/\/[^/]+$/, "");
}

/**
 * A section heading and, at the far end of the same line, the one fact about
 * it worth stating — where the block installs to, how many files it is. Both
 * used to sit under their panel as loose lines of prose, which read as two more
 * paragraphs rather than as labels.
 */
function SectionLabel({ title, trailing }: { title: string; trailing?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-[13px] tracking-[0.02em] text-ink/40">{title}</h2>
      {trailing ? (
        <span className="truncate font-mono text-[11.5px] text-ink/25">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}

const findMockup = (slug: string) =>
  v2Mockups.find((mockup) => mockup.name === slug);

/**
 * One block: the screen on the left, the folder behind it on the right.
 *
 * The screenshot is the point of the page, so it stays put while the source
 * scrolls beside it — reading `index.tsx` for a bottom sheet without the sheet
 * in view is reading a list of style objects.
 *
 * Source comes from the `reacticx-codebase` bucket at build time, the same as
 * every component page. A block whose folder has not synced yet keeps its
 * screenshot and says so, rather than 404ing on a screen that exists.
 */
export default async function BlockPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const mockup = findMockup(slug);
  if (!mockup) notFound();

  const category = mockupCategories.find((entry) => entry.id === mockup.category);
  const dir = blockDir(mockup);
  const refs = dir ? await listFilesInDir(CODEBASE_FOLDERS.core, dir) : [];

  const loaded = await Promise.all(
    refs.map(async (ref): Promise<BlockSourceFile | null> => {
      const code = await fetchCodebaseFile(ref.key);
      if (code === null) return null;

      const { code: trimmed, rendered } = await highlightSource(
        code,
        ref.path,
        "no-scrollbar max-h-[30rem] overflow-auto px-5 py-4 font-mono text-[12.5px] leading-[1.75]",
      );

      return { path: ref.path, code: trimmed, rendered };
    }),
  );

  const files = loaded.filter((file): file is BlockSourceFile => file !== null);

  // The registry keys a block by its directory name, which is what the CLI
  // takes — not the screenshot's slug.
  const installName = dir?.split("/").pop() ?? slug;

  return (
    <>
      <ForceDarkTheme />
      <MobileNavProvider>
        <div className="min-h-screen bg-surface font-brand tracking-[-0.011em] text-ink">
          <div aria-hidden className="fixed inset-0 -z-10 bg-black" />

          <Navbar />
          <MobileNavDrawer />

          <MobileNavShell>
            <div aria-hidden className="fixed inset-0 -z-10 bg-surface" />

            <main className="mx-auto max-w-6xl px-5 pt-28 pb-32 sm:px-8 sm:pt-36">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
                <div className="lg:sticky lg:top-24 lg:self-start">
                  {/* Bounded by the viewport's height, not the column's width.
                      A phone is twice as tall as it is wide, so a frame sized
                      to fill a phone-width screen is a frame you have to scroll
                      past — `svh` keeps the whole device on screen at any size,
                      and the column caps it once there is room to spare. */}
                  <IPhoneMockup
                    alt={`${mockup.title} — ${category?.title ?? mockup.category} block`}
                    className="mx-auto max-w-[min(320px,calc(72svh*0.4923))]"
                    loading="eager"
                    priority
                    src={mockup.bucketURL}
                  />
                </div>

                <div className="min-w-0">
                  <Link
                    className="inline-block text-[12px] tracking-[0.09em] text-accent-pro uppercase transition-opacity duration-200 hover:opacity-70"
                    href={`/blocks#${mockup.category}`}
                  >
                    {category?.title ?? mockup.category}
                  </Link>
                  <h1 className="mt-2.5 font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] font-normal tracking-[-0.02em] text-ink">
                    {mockup.title}
                  </h1>
                  <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-ink/50">
                    {category?.description}
                  </p>

                  <div className="mt-12 space-y-3">
                    <SectionLabel
                      title="Install"
                      trailing={dir ? `components/${dir}` : undefined}
                    />
                    <InstallCommand component={installName} />
                  </div>

                  <div className="mt-10 space-y-3">
                    <SectionLabel
                      title="Source"
                      trailing={
                        files.length > 0
                          ? `${files.length} ${files.length === 1 ? "file" : "files"}`
                          : undefined
                      }
                    />
                    {files.length > 0 ? (
                      <BlockSource files={files} />
                    ) : (
                      <div className="rounded-2xl border-[0.5px] border-white/8 bg-white/[0.02] px-4 py-3 text-[13px] text-ink/50">
                        Source for{" "}
                        <code className="font-mono text-ink/75">{slug}</code> is
                        not synced yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
            <Footer />

            <BottomEdgeBlur position="bottom" />
          </MobileNavShell>
        </div>
      </MobileNavProvider>
    </>
  );
}

export function generateStaticParams() {
  return v2Mockups.map((mockup) => ({ slug: mockup.name }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const mockup = findMockup(slug);
  if (!mockup) notFound();

  const category = mockupCategories.find((entry) => entry.id === mockup.category);
  const description = `${mockup.title} — a ${(
    category?.title ?? mockup.category
  ).toLowerCase()} block for React Native, with its source.`;
  const url = `/blocks/${mockup.name}`;

  return {
    title: mockup.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: mockup.title,
      description,
      url,
      siteName: siteConfig.name,
      type: "article",
      images: [{ url: mockup.bucketURL }],
    },
  };
}
