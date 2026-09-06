"use client";

import type { ReactNode } from "react";

import {
  ComponentSidebarProvider as SidebarStateProvider,
  type SidebarEntry,
} from "@/components/component-docs/sidebar/context";
import { FloatingSidebarPanel } from "@/components/component-docs/sidebar/panel";

export type { SidebarEntry };
export { SidebarTrigger } from "@/components/component-docs/sidebar/trigger";

/**
 * State and panel for the section's navigation.
 *
 * The panel is mounted here rather than beside the trigger because it is
 * portaled to the body and outlives any one page's header.
 */
export function ComponentSidebarProvider({ children }: { children: ReactNode }) {
  return (
    <SidebarStateProvider>
      {children}
      <FloatingSidebarPanel />
    </SidebarStateProvider>
  );
}
