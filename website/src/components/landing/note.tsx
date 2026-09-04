"use client";

import Link from "next/link";

import { DOCS_HREF, FEATURED_COMPONENT_HREF, REPO } from "./data";
import { Chars, Reveal } from "./primitives";

const NOTE_DATE = "2026-08-13";
const AVATAR: string =
  "https://i.pinimg.com/originals/81/ca/65/81ca659db9c8c6a017575f23d4c8c494.jpg";

export function Note() {
  return (
    <section className="mx-auto w-full max-w-[46rem] px-5 pt-40 md:px-8 md:pt-56">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="flex items-center gap-3 text-[1.35rem] text-ink tracking-[-0.02em] md:text-[1.55rem]">
          A note from
          <img
            alt=""
            aria-hidden
            className="size-8 rounded-full"
            height={32}
            src={AVATAR}
            width={32}
          />
          Ritesh.
        </h2>
        <time
          className="font-mono text-[0.8rem] text-ink-faint"
          dateTime={NOTE_DATE}
        >
          {NOTE_DATE}
        </time>
      </Reveal>

      <div className="mt-12 flex flex-col gap-8 text-[1.05rem] text-ink-muted leading-[1.7] md:text-[1.15rem]">
        <Reveal delay={0.06}>
          Reacticx started because React Native apps kept giving themselves
          away. The layout was right, the colours were right, and then something
          moved — a sheet, a tab bar, a slider — and it felt like a website
          wearing a phone.
        </Reveal>

        <Reveal delay={0.1}>
          So the emphasis went into{" "}
          <span className="font-serif text-ink italic">motion</span>,{" "}
          <span className="font-serif text-ink italic">gesture</span>, and{" "}
          <span className="font-serif text-ink italic">restraint</span>. Every
          component runs its animation on the UI thread, and none of them ask
          you to adopt a framework to get there.
        </Reveal>

        <Reveal delay={0.14}>
          Start with a single{" "}
          <Link
            className="text-brand underline decoration-brand/30 underline-offset-4 transition-[opacity,text-decoration-color] duration-200 hover:decoration-brand hover:opacity-80"
            href={FEATURED_COMPONENT_HREF}
          >
            component
          </Link>
          , read the{" "}
          <Link
            className="text-brand underline decoration-brand/30 underline-offset-4 transition-[opacity,text-decoration-color] duration-200 hover:decoration-brand hover:opacity-80"
            href={DOCS_HREF}
          >
            guide
          </Link>
          , or go straight to the{" "}
          <a
            className="text-brand underline decoration-brand/30 underline-offset-4 transition-[opacity,text-decoration-color] duration-200 hover:decoration-brand hover:opacity-80"
            href={REPO}
            rel="noopener noreferrer"
            target="_blank"
          >
            source
          </a>
          . Templates are next.
        </Reveal>

        <Reveal
          className="font-serif text-[1.4rem] text-ink italic"
          delay={0.18}
        >
          <Chars>Take your time. Enjoy the visit.</Chars>
        </Reveal>
      </div>
    </section>
  );
}
