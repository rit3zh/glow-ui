import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { ThemeSwitcher } from "@/components/animate/theme-switcher";
import { Nav } from "@/components/docs/nav";
import { DocsSidebar } from "@/components/docs/sidebar";
import { TopShadow } from "@/components/docs/top-shadow";
import XIcon from "@/components/workspace-ui/icons/x-icon";
import { siteConfig } from "@/app/config/site";
import { baseOptions } from "@/app/(docs)/layout.config";
import { source } from "#/lib/source";

/**
 * The shell the primitives pages render inside.
 *
 * Deliberately the same furniture as `/docs`: the same `DocsLayout`, the same
 * `Nav`, the same `DocsSidebar`. `tree` is the whole page tree — fumadocs
 * narrows it to the nearest folder marked `"root": true`, so standing in
 * `/primitives/*` shows the primitives branch without this layout selecting
 * it, exactly as `/docs` and `/components` already do.
 *
 * It sits under `[slug]` rather than at `/primitives`, which keeps the
 * catalogue grid at `/primitives` free of docs chrome.
 */
const layoutProps: DocsLayoutProps = {
  tree: source.pageTree,
  sidebar: {},
  themeSwitch: {
    component: <ThemeSwitcher />,
  },
  ...baseOptions,
  links: [
    ...(baseOptions.links ?? []),
    {
      icon: <XIcon />,
      url: siteConfig.links.twitter,
      text: "X",
      type: "icon",
    },
  ],
};

export default function PrimitivesDocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // `ux` is the shared docs palette; `ux-primitive` layers the one difference
    // on top of it — fumadocs' primary becomes the brand orange, so the
    // sidebar's active mark and the TOC rail read in the accent here.
    <div className="ux ux-primitive">
      <TopShadow />
      <DocsLayout
        {...layoutProps}
        sidebar={{
          component: <DocsSidebar {...layoutProps} />,
        }}
        nav={{ component: <Nav /> }}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
