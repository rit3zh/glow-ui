import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { siteConfig } from "@/app/config/site";

/**
 * Shared docs layout configuration.
 *
 * `links` is deliberately empty: the sidebar renders these above the page
 * tree, where they duplicated navigation the top nav already carries.
 */
export const baseOptions: BaseLayoutProps = {
  githubUrl: siteConfig.links.github,
  links: [],
};
