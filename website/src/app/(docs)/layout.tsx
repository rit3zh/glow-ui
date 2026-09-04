import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { ThemeSwitcher } from "@/components/animate/theme-switcher";
import { Nav } from "@/components/docs/nav";
import { DocsSidebar } from "@/components/docs/sidebar";
import { TopShadow } from "@/components/docs/top-shadow";
import XIcon from "@/components/workspace-ui/icons/x-icon";
import { siteConfig } from "@/app/config/site";
import { source } from "#/lib/source";

import { baseOptions } from "./layout.config";

/**
 * The shell both sections share.
 *
 * `tree` is the whole page tree, not a section of it — fumadocs narrows it to
 * the nearest folder marked `"root": true`, so standing in `/docs` shows the
 * Docs branch without this layout having to select it.
 */
const docsLayoutProps: DocsLayoutProps = {
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

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    // `ux` is the docs palette scope — see the stylesheet. Everything fumadocs
    // renders lives under it, so the framework's own `--color-fd-*` properties
    // resolve to this theme rather than the landing page's.
    <div className="ux">
      <TopShadow />
      <DocsLayout
        {...docsLayoutProps}
        sidebar={{
          component: <DocsSidebar {...docsLayoutProps} />,
        }}
        nav={{ component: <Nav /> }}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
