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
import { charts } from "@/lib/components.generated";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Charts",
  description:
    "Data visualisation for React Native — line, bar, pie, radar and radial charts, drawn and animated on the device.",
};

/**
 * The charts catalogue.
 *
 * A chart is a data surface rather than an interface control: it is composed
 * from its own parts — a grid, axes, a cursor, a tooltip — and is chosen by
 * what you are plotting, not by how it behaves under a finger. Mixing them into
 * the components grid meant scrolling past seventy carousels to find one.
 *
 * One flat section: five charts do not need four headings, and the set is
 * browsed by shape, which the cards already show.
 */
export default function ChartsPage() {
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
                flatBlurb="Composable data surfaces — bring your own grid, axes, cursor and tooltip."
                flatTitle="Charts"
                heading="Data, drawn on the device."
                intro={`${charts.length} React Native charts, composed from parts you can rearrange.`}
                items={charts}
                searchLabel="Search charts…"
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
