"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import {
  Sidebar001Content,
  Sidebar001Item,
  Sidebar001Section,
} from "@/components/component-docs/sidebar/sidebar-001";
import type { SidebarEntry } from "@/components/component-docs/sidebar/context";
import { cn } from "@/components/workspace-ui/lib/utils";

interface Section {
  title: string;
  items: { label: string; href: string }[];
}

/**
 * Fold the flat `meta.json` order into sections.
 *
 * The list arrives as pages interleaved with separators, which is the shape
 * fumadocs keeps it in; the rail wants each run of pages grouped under the
 * separator that opened it.
 */
function toSections(entries: SidebarEntry[]): Section[] {
  const sections: Section[] = [];

  for (const entry of entries) {
    if (entry.type === "separator") {
      sections.push({ title: entry.label, items: [] });
      continue;
    }

    if (!entry.url) continue;

    if (sections.length === 0) {
      sections.push({ title: "", items: [] });
    }

    sections.at(-1)?.items.push({ label: entry.label, href: entry.url });
  }

  return sections.filter((section) => section.items.length > 0);
}

export function ComponentSidebarNavContent({
  entries,
  contentClassName,
  edgeFades,
  onNavigate,
}: {
  entries: SidebarEntry[];
  contentClassName?: string;
  edgeFades?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const sections = useMemo(() => toSections(entries), [entries]);

  return (
    <Sidebar001Content
      className={cn("py-3", contentClassName)}
      edgeFades={edgeFades}
    >
      {sections.map((section) => (
        <Sidebar001Section
          className="px-2"
          key={section.title}
          label={section.title}
        >
          {section.items.map((item) => (
            <Sidebar001Item
              href={item.href}
              isActive={pathname === item.href}
              key={item.href}
              label={item.label}
              onClick={onNavigate}
            />
          ))}
        </Sidebar001Section>
      ))}
    </Sidebar001Content>
  );
}
