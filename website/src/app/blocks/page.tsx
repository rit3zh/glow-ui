import type { Metadata } from "next";

import { BlocksGallery } from "@/components/blocks-preview/gallery";
import { ForceDarkTheme } from "@/components/force-dark-theme";
import { BottomEdgeBlur } from "@/components/landing/bottom-edge-blur";
import { Footer } from "@/components/landing/footer";
import {
  MobileNavDrawer,
  MobileNavProvider,
  MobileNavShell,
} from "@/components/landing/mobile-nav";
import { Navbar } from "@/components/landing/navbar";
import { mockupCategories, v2Mockups } from "@/lib/v2-mockups.generated";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blocks",
  description:
    "Whole screens, captured on the device — sheets, settings, empty states and welcome flows, with the source behind each one.",
};

/**
 * The blocks catalogue.
 *
 * A block is bigger than a component: a bottom sheet with its form in it, a
 * settings screen with its rows, the frame an app opens on. Nothing about one
 * is legible from a cropped preview tile, so each is shown as what it is — a
 * screenshot inside the phone it was taken on.
 *
 * The categories and the screenshots come from `v2-mockups.generated.ts`, which
 * `bun run mockups:sync` writes from the `reacticx-v2-mockups` bucket; the code
 * on each block's own page is read from `reacticx-codebase` at build time. Both
 * sides are therefore the repo as it is, not a snapshot re-synced by hand.
 */
export default function BlocksPage() {
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

            <main>
              <BlocksGallery
                blocks={v2Mockups}
                categories={mockupCategories}
                heading="Screens, already built."
                intro={`${v2Mockups.length} blocks across ${mockupCategories.length} categories — copy the file, keep the screen.`}
                searchLabel="Search blocks…"
              />
            </main>
            <Footer />

            <BottomEdgeBlur position="bottom" />
          </MobileNavShell>
        </div>
      </MobileNavProvider>
    </>
  );
}
