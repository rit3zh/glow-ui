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
import { pieces } from "@/lib/components.generated";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Pieces",
  description:
    "Self-contained visual objects — tickets, receipts, cards and badges.",
};

/**
 * The pieces catalogue.
 *
 * A piece is a finished object rather than an interface primitive: a ticket, a
 * receipt, a polaroid. Grouping them with buttons and sheets flattened that
 * distinction, so they browse here instead — same grid, same machinery, read
 * off the same generated registry.
 *
 * One flat section rather than four category headings: the set is small enough
 * that splitting it would be filing rather than navigation.
 */
export default function PiecesPreviewPage() {
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
                flatBlurb="Finished objects you can drop in whole — tickets, receipts, cards and badges."
                flatTitle="Pieces"
                heading="Small things, finished."
                intro={`${pieces.length} self-contained pieces, ready to drop into a screen.`}
                items={pieces}
                searchLabel="Search pieces…"
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
