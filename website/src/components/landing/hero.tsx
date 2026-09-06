"use client";

import Link from "next/link";

import { BROWSE_HREF, COMPONENT_COUNT, DOCS_HREF } from "./data";
import { CyclingText } from "./cycling-text";
import { Chars, Reveal } from "./primitives";

/** Swapped on a timer in the headline. Kept short so the line stays balanced. */
const PHRASES = ["native ones", "the system", "SwiftUI does", "muscle memory"];

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-5 text-center md:px-8">
      <h1 className="font-serif text-[clamp(2.4rem,6vw,4.6rem)] text-ink leading-[1.05] tracking-[-0.03em]">
        <span className="block">
          <Chars delay={0.05} immediate spread={1.4}>
            Components that move
          </Chars>
        </span>
        <span className="block italic">
          <Chars delay={0.2} immediate spread={1.4}>
            like
          </Chars>{" "}
          <CyclingText phrases={PHRASES} spread={1.4} />
          <span className="text-brand">.</span>
        </span>
      </h1>

      <Reveal
        blur={14}
        className="mt-9 max-w-[46ch] text-[0.95rem] text-ink-muted leading-[1.75]"
        delay={0.34}
        immediate
      >
        {COMPONENT_COUNT} React Native{" "}
        <Link className={linkClass} href={BROWSE_HREF}>
          components
        </Link>{" "}
        built on Reanimated, Skia and Gesture Handler,{" "}
        <Link className={linkClass} href={DOCS_HREF}>
          shaped by motion
        </Link>{" "}
        that runs on the UI thread.
      </Reveal>
    </section>
  );
}

const linkClass =
  "text-brand underline decoration-brand/30 underline-offset-4 transition-[opacity,text-decoration-color] duration-200 hover:decoration-brand hover:opacity-80";
