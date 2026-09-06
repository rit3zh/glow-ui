import { ForceDarkTheme } from "@/components/force-dark-theme";
import { BottomEdgeBlur } from "@/components/landing/bottom-edge-blur";
import { Footer } from "@/components/landing/footer";
import { Community } from "@/components/landing/community";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import {
  MobileNavDrawer,
  MobileNavProvider,
  MobileNavShell,
} from "@/components/landing/mobile-nav";
import { Navbar } from "@/components/landing/navbar";
import { Note } from "@/components/landing/note";
import { Showcase } from "@/components/landing/showcase";
import { SmoothScroll } from "@/components/landing/smooth-scroll";

export default function Home() {
  return (
    <>
      <ForceDarkTheme />
      <MobileNavProvider>
        <div className="min-h-screen bg-surface font-brand text-ink tracking-[-0.011em]">
          <div aria-hidden className="fixed inset-0 -z-10 bg-black" />

          <Navbar />
          <MobileNavDrawer />

          {/* Everything inside the shell becomes the card the mobile drawer
              pushes aside; the header deliberately stays outside it. */}
          <MobileNavShell>
            <div aria-hidden className="fixed inset-0 -z-10 bg-surface" />

            <SmoothScroll>
              <main>
                <Hero />
                <Showcase />
                <Note />
                <Community />
                <Faq />
              </main>
              <Footer />
            </SmoothScroll>

            <BottomEdgeBlur position="bottom" />
          </MobileNavShell>
        </div>
      </MobileNavProvider>
    </>
  );
}
