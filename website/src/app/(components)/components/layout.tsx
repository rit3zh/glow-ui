import type { ReactNode } from "react";

import { ComponentSidebarProvider } from "@/components/component-docs/floating-sidebar";

/**
 * The shell the components section renders inside.
 *
 * Unlike `/docs` there is no persistent sidebar: the split layout gives both
 * halves of the viewport to the page, so navigation is a panel that opens over
 * it. `ux` is the docs palette scope — see the stylesheet.
 *
 * The panel lists the catalogue the open page belongs to rather than the whole
 * collection, and works that out from the slug — which this layout sits above
 * and cannot read. So it takes no nav of its own.
 */
export default function ComponentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="ux">
      <ComponentSidebarProvider>{children}</ComponentSidebarProvider>
    </div>
  );
}
