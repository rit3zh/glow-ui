import type { BaseOptions } from "fumadocs-core/source";
import { Dancing_Script } from "next/font/google";

import { cn } from "#/lib/utils";

const dancing = Dancing_Script({ subsets: ["latin"] });

const Badge = ({
  name,
  className,
  children,
}: {
  name: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className="font-normal!">{name}</span>{" "}
      <span
        className={cn(
          "text-nowrap text-[17px] font-black leading-1 text-foreground",
          className,
        )}
      >
        <span className={cn(dancing.className, "leading-1")}>{children}</span>
      </span>
    </span>
  );
};

/**
 * Frontmatter badges in the sidebar.
 *
 * The status a page declares — `new`, `beta`, `deprecated` — is a property of
 * the page, so it is attached here while the tree is being built rather than
 * threaded through the sidebar component, which only ever sees a node name.
 */
export const attachFile: NonNullable<BaseOptions["attachFile"]> = (node, file) => {
  if (!file) return node;

  const data = file.data as Record<string, unknown> & {
    _exports?: { frontmatter?: Record<string, unknown> };
  };
  const raw = data._exports?.frontmatter ?? data;

  if (raw.new === true) {
    node.name = (
      <span className="inline-flex items-center gap-1.5">
        <span className="font-normal!">{node.name}</span>
        <span className="size-1.5 shrink-0 rounded-full bg-accent-pro" />
      </span>
    );
  }

  if (raw.alpha === true) {
    node.name = (
      <Badge name={node.name} className="text-pink-600 dark:text-pink-400">
        alpha
      </Badge>
    );
  }

  if (raw.beta === true) {
    node.name = (
      <Badge name={node.name} className="text-blue-600 dark:text-blue-400">
        beta
      </Badge>
    );
  }

  if (raw.deprecated === true) {
    node.name = (
      <Badge name={node.name} className="text-red-600 dark:text-red-400">
        deprecated
      </Badge>
    );
  }

  if (raw.updated === true) {
    node.name = (
      <Badge
        name={node.name}
        className="text-emerald-600 dark:text-emerald-400"
      >
        updated
      </Badge>
    );
  }

  return node;
};
