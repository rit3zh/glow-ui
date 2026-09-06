import { Card, Cards } from "fumadocs-ui/components/card";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

import { PackageInstall } from "@/components/component-docs/install-command";
import { Callout } from "@/components/docs/callout";
import { Changelog } from "@/components/docs/changelog";
import {
  CodeBlock,
  type CodeBlockProps,
  Pre,
} from "@/components/docs/codeblock";
import { ExternalLink } from "@/components/docs/external-link";
import { LazyVideo } from "@/components/docs/lazy-video";
import { PropTable } from "@/components/docs/prop-table";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * MDX mapping for the docs instance.
 *
 * Prose elements are deliberately absent: headings, paragraphs, lists and
 * tables are styled by the `#docs-body` rules in the stylesheet, because that
 * markup comes from the MDX compiler rather than from us. What is mapped here
 * is everything with behaviour, plus the two elements whose default styling is
 * actively wrong (`pre` and inline `code`).
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,

    Card: ({ children, className, ...props }) => (
      <Card
        className={cn(
          "flex flex-col items-center justify-center border-none bg-accent/50 py-7 [&>h3]:text-base [&>h3]:text-current [&>div]:border-none [&>div]:bg-transparent [&>div]:shadow-none [&_svg]:size-10",
          className,
        )}
        {...props}
      >
        {children}
      </Card>
    ),
    Cards,
    Callout,
    Changelog,
    ExternalLink,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable: PropTable,
    video: LazyVideo as MDXComponents["video"],

    // `package-install` fences are rewritten into this tag before the
    // highlighter runs — see `lib/remark-package-install.ts`.
    PackageInstall,

    pre: (props: CodeBlockProps) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),

    // Inline code only — fenced blocks go through the `pre` mapping above.
    code: ({ children, className, ...props }) => {
      if (typeof children !== "string") {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }

      return (
        <code
          className="not-prose rounded-md bg-accent px-2.5 py-1 font-mono text-sm tracking-tight text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    },

    ...components,
  };
}
