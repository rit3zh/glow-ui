"use client";

import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, ChevronDown, Copy, FileText, Pencil } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Highlight, HighlightItem } from "@/components/animate/highlight";
import {
  ChatGPTIcon,
  ClaudeIcon,
  DeepSeekIcon,
  GeminiIcon,
} from "@/components/workspace-ui/icons/ai-icons";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * Where the markdown for a page can be read or edited.
 *
 * The `.mdx` suffix is served by a rewrite (see `next.config.mjs`) and returns
 * the page's markdown source — which is also what the "open in" targets are
 * pointed at, since an assistant can fetch it but cannot read the rendered
 * page's DOM.
 */
const CONTENT_REPO = "https://github.com/rit3zh/reacticx";
const SITE_URL = "https://www.reacticx.com";

const buttonClassName =
  "relative flex h-9 cursor-pointer items-center justify-center rounded-[40px] border border-foreground/5 bg-foreground/[0.04] px-4 text-foreground transition-colors duration-150 hover:bg-foreground/[0.06]";

const labelClassName = "ml-2.5 text-[13px] font-medium tracking-tight";

const ICON_SPRING = { type: "spring", stiffness: 600, damping: 25 } as const;

/**
 * A fixed-size slot for an icon that swaps.
 *
 * The 16px box is the point: both glyphs are absolutely positioned inside it,
 * so the swap never changes the button's width and the label beside it stays
 * put while the icon morphs.
 */
function MorphIcon({ swapped }: { swapped: boolean }) {
  return (
    <div className="relative flex size-4 shrink-0 items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={swapped ? "check" : "copy"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={ICON_SPRING}
          className="absolute inset-0 flex items-center justify-center"
        >
          {swapped ? <Check className="size-4" /> : <Copy className="size-4" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CopyMarkdown({ markdown }: { markdown: string }) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    setLoading(true);
    try {
      await navigator.clipboard.writeText(markdown);
    } finally {
      setLoading(false);
    }
  });

  return (
    <motion.button
      type="button"
      disabled={isLoading}
      onClick={() => onClick({} as React.MouseEvent)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={cn(buttonClassName, "disabled:opacity-40")}
    >
      <MorphIcon swapped={checked} />
      <span className={labelClassName}>Copy Markdown</span>
    </motion.button>
  );
}

/** Brand tiles are artwork, not glyphs — they keep their own colours. */
const brandIconClassName = "size-5 rounded-[5px]";

const MENU_ITEMS = (markdownUrl: string, prompt: string) => [
  {
    href: markdownUrl,
    icon: <FileText />,
    title: "View as Markdown",
    description: "The raw source for this page",
  },
  {
    href: `https://claude.ai/new?q=${prompt}`,
    icon: <ClaudeIcon className={brandIconClassName} />,
    title: "Open in Claude",
    description: "Ask questions about this page",
  },
  {
    href: `https://chatgpt.com/?hints=search&q=${prompt}`,
    icon: <ChatGPTIcon className={brandIconClassName} />,
    title: "Open in ChatGPT",
    description: "Ask questions about this page",
  },
  {
    href: `https://gemini.google.com/app?q=${prompt}`,
    icon: <GeminiIcon className={brandIconClassName} />,
    title: "Open in Gemini",
    description: "Ask questions about this page",
  },
  {
    href: `https://chat.deepseek.com/?q=${prompt}`,
    icon: <DeepSeekIcon className={brandIconClassName} />,
    title: "Open in DeepSeek",
    description: "Ask questions about this page",
  },
];

interface PageActionsProps {
  /** The page's markdown source, for the clipboard. */
  markdown: string;
  /** Page URL, e.g. `/docs/usage`. */
  url: string;
  /** Path within `content/`, e.g. `docs/usage.mdx`. */
  path: string;
  className?: string;
}

export function PageActions({
  markdown,
  url,
  path,
  className,
}: PageActionsProps) {
  const [open, setOpen] = useState(false);

  const markdownUrl = `${SITE_URL}${url}.mdx`;
  const editUrl = `${CONTENT_REPO}/blob/main/website/content/${path}`;
  const prompt = encodeURIComponent(
    `Read ${markdownUrl} so I can ask questions about it.`,
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <motion.a
        href={editUrl}
        target="_blank"
        rel="noreferrer noopener"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={cn(buttonClassName, "no-underline!")}
      >
        <Pencil className="size-4 shrink-0" />
        <span className={labelClassName}>Edit on GitHub</span>
      </motion.a>

      <CopyMarkdown markdown={markdown} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className={buttonClassName}
          >
            <span className="text-[13px] font-medium tracking-tight">Open</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="ml-1.5 inline-flex"
            >
              <ChevronDown className="size-4 shrink-0" />
            </motion.span>
          </motion.button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-1.5">
          {/* One highlight rectangle slides between items rather than each
              item lighting its own background — the movement is what makes
              the menu read as a single surface. */}
          <Highlight
            mode="parent"
            hover
            controlledItems
            value={null}
            className="rounded-lg bg-accent"
            containerClassName="flex flex-col gap-0.5"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 40,
              mass: 0.6,
            }}
          >
            {MENU_ITEMS(markdownUrl, prompt).map((item) => (
              <HighlightItem key={item.href} value={item.href} asChild>
                <PopoverClose asChild>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="relative z-10 flex items-center gap-2.5 rounded-lg p-2 text-left no-underline! [&_svg]:shrink-0"
                  >
                    {/* Centred against the whole row: the rows are two lines
                        tall, so an icon aligned to the first line reads as
                        sitting high rather than as belonging to the entry. */}
                    <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground [&>svg:not([class*='size-'])]:size-4">
                      {item.icon}
                    </span>
                    <span className="flex flex-col gap-0">
                      <span className="font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="text-xs leading-snug text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                  </a>
                </PopoverClose>
              </HighlightItem>
            ))}
          </Highlight>
        </PopoverContent>
      </Popover>
    </div>
  );
}
