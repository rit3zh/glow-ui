import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { GithubInfo } from "fumadocs-ui/components/github-info";
import { BookIcon } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <img
          src={"/static/media/logo_.svg"}
          alt="Logo"
          className="h-10 w-auto object-contain"
        />
      </>
    ),
    enabled: true,
  },

  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      type: "custom",
      children: (
        <GithubInfo owner="rit3zh" repo="glow-ui" className="lg:-mx-2" />
      ),
    },
  ],
};
