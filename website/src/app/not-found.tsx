import Link from "next/link";

import { ForceDarkTheme } from "@/components/force-dark-theme";
import { Chars, Reveal } from "@/components/landing/primitives";
import { BROWSE_HREF, DOCS_HREF, REPO } from "@/components/landing/data";
import { Logo } from "@/components/logo";

/**
 * Where a dead end can still go. Kept to four rows: the two catalogues people
 * mistype their way into, the guide, and the repo.
 */
const LINKS: { label: string; href: string; hint: string; external?: boolean }[] =
  [
    { label: "Home", href: "/", hint: "Back to the start" },
    {
      label: "Components",
      href: BROWSE_HREF,
      hint: "Browse the library",
    },
    { label: "Guides", href: DOCS_HREF, hint: "Install and get moving" },
    { label: "GitHub", href: REPO, hint: "Source and issues", external: true },
  ];

export default function NotFound() {
  return (
    <>
      <ForceDarkTheme />

      <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-surface font-brand text-ink tracking-[-0.011em]">
        {/*
          One warm source low on the page — the same ember the footer's aurora
          leaves behind, without a WebGL context running for a page nobody
          means to be on.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[28rem]"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 100%, rgba(255,106,61,0.16) 0%, rgba(255,106,61,0.05) 38%, transparent 72%)",
          }}
        />

        <header className="px-5 pt-8 md:px-8">
          <Reveal blur={6} distance={8} immediate>
            <Link
              aria-label="Reacticx home"
              className="inline-flex text-ink transition-opacity duration-200 hover:opacity-70"
              href="/"
            >
              <Logo className="h-6 w-auto" />
            </Link>
          </Reveal>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center md:px-8">
          <Reveal
            as="p"
            blur={6}
            className="font-mono text-[0.75rem] text-ink-faint uppercase tracking-[0.18em]"
            delay={0.02}
            immediate
          >
            404
          </Reveal>

          <h1 className="mt-6 font-serif text-[clamp(2.2rem,5.5vw,4rem)] text-ink leading-[1.05] tracking-[-0.03em]">
            <span className="block">
              <Chars delay={0.08} immediate spread={1.4}>
                This page never
              </Chars>
            </span>
            <span className="block italic">
              <Chars delay={0.22} immediate spread={1.4}>
                shipped
              </Chars>
              <span className="text-brand">.</span>
            </span>
          </h1>

          <Reveal
            blur={14}
            className="mt-8 max-w-[42ch] text-[0.95rem] text-ink-muted leading-[1.75]"
            delay={0.34}
            immediate
          >
            The link is broken, renamed, or was only ever a typo. Nothing here
            moves — everything below does.
          </Reveal>

          <Reveal
            blur={10}
            className="mt-14 w-full max-w-[26rem]"
            delay={0.44}
            immediate
          >
            <ul className="divide-y divide-white/5 border-white/5 border-y text-left">
              {LINKS.map((link) => {
                const className =
                  "group flex items-baseline justify-between gap-6 py-4 transition-colors duration-200";

                const content = (
                  <>
                    <span className="text-[0.95rem] text-ink transition-colors duration-200 group-hover:text-brand">
                      {link.label}
                    </span>
                    <span className="text-[0.8rem] text-ink-faint">
                      {link.hint}
                    </span>
                  </>
                );

                return (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        className={className}
                        href={link.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {content}
                      </a>
                    ) : (
                      <Link className={className} href={link.href}>
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </main>
      </div>
    </>
  );
}
