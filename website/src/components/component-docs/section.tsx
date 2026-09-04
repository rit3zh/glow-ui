import type { ReactNode } from "react";

import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * One titled block in the left column.
 *
 * The id doubles as the scroll target for the in-page nav, so it is derived
 * from the title when the caller does not pin one.
 */
export function ComponentDocsSection({
  title,
  children,
  id,
  className,
}: {
  title: string;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const sectionId = id ?? title.toLowerCase().replace(/\s+/g, "-");

  return (
    <section
      className={cn("scroll-mt-20", className)}
      data-section-title={title}
      id={sectionId}
    >
      <h2 className="mb-6 text-[1.75rem] font-normal leading-tight tracking-[-0.025em] text-foreground">
        {title}
      </h2>

      <div className="space-y-3.5">{children}</div>
    </section>
  );
}
