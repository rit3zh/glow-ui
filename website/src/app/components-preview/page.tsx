import type { Metadata } from "next";

import { ComponentsGallery } from "@/components/components-preview/gallery";
import { ForceDarkTheme } from "@/components/force-dark-theme";
import { BottomEdgeBlur } from "@/components/landing/bottom-edge-blur";
import { Footer } from "@/components/landing/footer";
import {
  MobileNavDrawer,
  MobileNavProvider,
  MobileNavShell,
} from "@/components/landing/mobile-nav";
import { Navbar } from "@/components/landing/navbar";
import { uiComponents } from "@/lib/components.generated";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Components",
  description: `Browse all ${uiComponents.length} React Native components by category.`,
};

/**
 * The whole catalogue on one page, grouped by category.
 *
 * Wrapped in the landing shell rather than the docs one: this is a browsing
 * surface, so it takes the site's own navigation, brand face and dark ground
 * instead of the documentation chrome.
 *
 * Every card carries a live recording, so the grid is built to keep only what
 * is on screen decoding — see `PreviewCard`. The data is the generated
 * registry, which means this page can never drift from the docs.
 *
 * One catalogue only. Pieces, charts and primitives are their own kinds of
 * thing and browse on `/pieces-preview`, `/charts` and `/primitives`; the
 * heading here used to call all of them "every piece", which is exactly the
 * conflation the split was meant to end.
 */
export default function ComponentsPreviewPage() {
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
              <ComponentsGallery
                heading="The components, in one place."
                intro={`${uiComponents.length} React Native components — shaders, type, micro interactions and the building blocks.`}
                items={uiComponents}
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
