"use client";

import type { ReactNode } from "react";

import {
  InstallCommand,
  PackageInstall,
} from "@/components/component-docs/install-command";
import { SlidingTabs } from "@/components/primitives-docs/sliding-tabs";
import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * The installation block: `CLI` or `Manual`, modelled on the Unlumen docs.
 *
 * CLI is the one line most people want. Manual is the same install written out
 * — dependencies, the source, and the one edit nobody remembers — as numbered
 * steps down a rail, so it reads as a procedure rather than as a wall of code
 * panels stacked under a heading.
 */

/**
 * The numbered rail.
 *
 * Two real columns — a marker column and a content column — rather than a
 * padded box with an absolutely-positioned circle over it. The absolute
 * version depends on the padding and the offset agreeing, and when they do not
 * the number lands on top of the first word instead of beside it. Here the
 * columns cannot overlap: the marker is a flex item, and the rule connecting
 * one marker to the next is an element in that column rather than a
 * pseudo-element hung off the row.
 */
function Steps({ children }: { children: ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

function Step({
  index,
  last,
  title,
  children,
}: {
  index: number;
  /** The rail stops at the last marker rather than running past it. */
  last?: boolean;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-[0.5px] border-border/70 bg-card text-[13px] tabular-nums text-muted-foreground">
          {index}
        </div>
        {last ? null : <div aria-hidden className="w-px flex-1 bg-border/60" />}
      </div>

      <div className={cn("min-w-0 flex-1", last ? "pb-1" : "pb-8")}>
        <h4 className="pt-1.5 text-[15px] font-medium leading-none tracking-[-0.01em] text-foreground">
          {title}
        </h4>
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>
  );
}

export function PrimitiveInstall({
  name,
  dependencies,
  files,
}: {
  /** The primitive's slug — what the CLI installs. */
  name: string;
  /** Space-separated packages, or empty when the primitive has none. */
  dependencies?: string;
  /** The component's folder, rendered by the caller. */
  files: ReactNode;
}) {
  const steps: { title: string; content?: ReactNode }[] = [];

  if (dependencies) {
    steps.push({
      title: "Install the following dependencies:",
      content: <PackageInstall packages={dependencies} />,
    });
  }

  steps.push({
    title: "Copy and paste the following code into your project:",
    content: files,
  });

  steps.push({
    title: "Update the import paths to match your project setup.",
  });

  return (
    <SlidingTabs
      ariaLabel="Installation method"
      tabs={[
        {
          id: "cli",
          label: "CLI",
          content: (
            <div className="p-1.5">
              <InstallCommand component={name} />
            </div>
          ),
        },
        {
          id: "manual",
          label: "Manual",
          content: (
            <div className="p-5">
              <Steps>
                {steps.map((step, index) => (
                  <Step
                    index={index + 1}
                    key={step.title}
                    last={index === steps.length - 1}
                    title={step.title}
                  >
                    {step.content}
                  </Step>
                ))}
              </Steps>
            </div>
          ),
        },
      ]}
    />
  );
}
