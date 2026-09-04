import { cn } from "@/components/workspace-ui/lib/utils";

/**
 * The native modules a component needs, as chips.
 *
 * These arrive from the MDX preview tags, which in the split layout no longer
 * render a preview of their own — the recording moved to the right column, so
 * what is left of them is the dependency list they were carrying.
 */
export function Dependencies({
  items,
  className,
}: {
  items?: string[];
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) => (
        <span
          className="rounded-full border-[0.5px] border-accent-pro/30 bg-accent-pro/8 px-2.5 py-1 font-mono text-[12px] text-accent-pro"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
