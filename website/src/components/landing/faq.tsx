"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import { cn } from "#/lib/utils";
import { DISCORD } from "./data";
import { HoverGroup, useHoverItem } from "./hover-group";
import { EASE_OUT, SPRING } from "./motion";
import { Chars, Reveal } from "./primitives";

const FAQS = [
  {
    question: "Is Reacticx free to use?",
    answer:
      "Yes. Every component is free and open source under MIT, for personal and commercial work alike.",
  },
  {
    question: "Do I need to install a package?",
    answer:
      "No. The CLI copies component source into your project, so Reacticx never appears in your dependency tree. You only install the peers a component actually uses.",
  },
  {
    question: "Is this an animation library?",
    answer:
      "No — it is a UI component library. It sits on top of Reanimated and Skia to deliver components whose motion is already right, rather than giving you primitives to animate yourself.",
  },
  {
    question: "Can I customise the components?",
    answer:
      "The source lands in your repository, so you can rename, restyle or rewrite anything. Nothing is locked behind props you cannot reach.",
  },
  {
    question: "What does it require?",
    answer:
      "Expo as the base, plus React Native Reanimated and React Native Skia for rendering and motion. Per-component peers are listed on each documentation page.",
  },
  {
    question: "Does it work in Expo Go?",
    answer:
      "Components that use Skia need a development build. Everything else runs in Expo Go.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-[46rem] px-5 pt-40 pb-32 md:px-8 md:pt-56 md:pb-44">
      <h2 className="text-center font-serif text-[clamp(2rem,4vw,3.2rem)] text-ink leading-[1.05] tracking-[-0.025em]">
        <Chars>Frequently asked questions</Chars>
      </h2>

      <Reveal
        className="mt-5 text-center text-[0.9rem] text-ink-faint"
        delay={0.08}
      >
        Anything else?{" "}
        <a
          className="text-brand underline decoration-brand/30 underline-offset-4 transition-[opacity,text-decoration-color] duration-200 hover:decoration-brand hover:opacity-80"
          href={DISCORD}
          rel="noopener noreferrer"
          target="_blank"
        >
          Ask on Discord.
        </a>
      </Reveal>

      <HoverGroup
        className="mt-14 flex flex-col gap-3"
        highlightClassName="rounded-3xl bg-white/[0.045]"
      >
        {FAQS.map((item, index) => (
          <Reveal delay={index * 0.04} key={item.question}>
            <FaqRow
              answer={item.answer}
              onToggle={() => setOpen(open === index ? null : index)}
              open={open === index}
              question={item.question}
            />
          </Reveal>
        ))}
      </HoverGroup>
    </section>
  );
}

function FaqRow({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const hover = useHoverItem();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-surface-raised transition-colors duration-300",
        // Hover is the group's shared highlight; only the open state tints the
        // row itself, so an open row stays lit once the pointer moves on.
        open && "bg-[#1c1c1c]",
      )}
      {...hover}
    >
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-8 py-7 text-left"
        onClick={onToggle}
        type="button"
      >
        <span
          className={cn(
            "text-[1.05rem] transition-colors duration-300",
            "text-ink",
          )}
        >
          {question}
        </span>
        <PlusMark open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.36, ease: EASE_OUT }}
          >
            <p className="px-8 pb-8 text-[0.95rem] text-ink-muted leading-[1.75]">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** A plus that rotates into a cross rather than swapping glyphs. */
function PlusMark({ open }: { open: boolean }) {
  return (
    <motion.span
      animate={{ rotate: open ? 135 : 0 }}
      className="relative flex size-5 shrink-0 items-center justify-center"
      transition={SPRING}
    >
      <span
        className={cn(
          "absolute h-px w-3 transition-colors duration-300",
          open ? "bg-ink" : "bg-ink-faint",
        )}
      />
      <span
        className={cn(
          "absolute h-3 w-px transition-colors duration-300",
          open ? "bg-ink" : "bg-ink-faint",
        )}
      />
    </motion.span>
  );
}
