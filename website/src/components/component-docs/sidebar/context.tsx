"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";

import { catalogueForPath, type Catalogue } from "@/lib/catalogues";

export interface SidebarEntry {
  type: "separator" | "page";
  label: string;
  url?: string;
}

interface SidebarContextValue {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  close: () => void;
  /** The trigger the panel hangs from — the panel opens directly below it. */
  anchorRef: RefObject<HTMLDivElement | null>;
  /** The catalogue the page being read belongs to. */
  catalogue: Catalogue;
  entries: SidebarEntry[];
}

/**
 * A catalogue's pages, in the shape the rail reads: a run of pages under the
 * separator that opened it.
 */
function toEntries(catalogue: Catalogue): SidebarEntry[] {
  return catalogue.sections.flatMap<SidebarEntry>((section) => [
    { type: "separator", label: section.label },
    ...section.items.map((item) => ({
      type: "page" as const,
      label: item.title,
      url: item.href,
    })),
  ]);
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * The rail lists one catalogue, not the whole collection.
 *
 * Every component page shares the `/components/<slug>` prefix, so the section
 * used to hand the panel all 136 pages — a reader on a receipt scrolled past
 * fifteen shaders to find the next piece. Which catalogue is showing is read
 * off the current slug instead, which is why this is resolved here rather than
 * passed down from the layout: the layout sits above the slug segment and
 * cannot see it.
 */
export function ComponentSidebarProvider({ children }: { children: ReactNode }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  const pathname = usePathname();
  const catalogue = useMemo(() => catalogueForPath(pathname), [pathname]);
  const entries = useMemo(() => toEntries(catalogue), [catalogue]);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, close, anchorRef, catalogue, entries }),
    [isOpen, close, catalogue, entries],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

/**
 * Whether the panel is up, for chrome that has to step aside while it is.
 *
 * Unlike `useComponentSidebar` this tolerates being called outside the
 * provider, so shell pieces can consult it without demanding one.
 */
export function useComponentSidebarOpen() {
  return useContext(SidebarContext)?.isOpen ?? false;
}

export function useComponentSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useComponentSidebar must be used within ComponentSidebarProvider",
    );
  }
  return context;
}
