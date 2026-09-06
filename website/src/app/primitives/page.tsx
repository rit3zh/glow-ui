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
import { primitives } from "@/lib/components.generated";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Primitives",
  description:
    "The plain interface furniture — switches, tabs, lists, dialogs and alerts, unstyled enough to build on.",
};

/**
 * The primitives catalogue.
 *
 * A primitive is the piece of furniture every app needs and nobody wants to
 * write again: a switch, a tab bar, a list row, a dialog. They are deliberately
 * quiet — the interesting thing about one is its behaviour and its parts, not
 * its motion — so they read badly next to a page of shaders and carousels, and
 * browse here instead.
 *
 * One flat section: the set is small, and it is browsed by knowing what you
 * need rather than by discovering it.
 */
export default function PrimitivesPage() {
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
                flatBlurb="Switches, tabs, lists, dialogs and alerts — compound, themeable, and yours to style."
                flatTitle="Primitives"
                heading="The parts you stop rewriting."
                intro={`${primitives.length} interface primitives, built from parts you can rearrange.`}
                items={primitives}
                searchLabel="Search primitives…"
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
