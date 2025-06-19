/**
 * This file contains the configuration for the documentation
 * to be used by files like:
 * - src/components/command-menu.tsx
 * - src/components/mobile-nav.tsx
 * - src/app/[locale]/docs/layout.tsx
 * - src/lib/opendocs/components/docs/pager.tsx
 */

import type { DocsConfig } from "@/lib/opendocs/types/docs";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      href: "/docs",

      title: {
        en: "Documentation",
        pt: "Documentação",
      },
    },
  ],

  sidebarNav: [
    {
      title: {
        en: "React Native Glow UI",
        pt: "Começando",
      },

      items: [
        {
          href: "/docs",

          title: {
            en: "Introduction",
            pt: "Introdução",
          },

          items: [],
        },
        {
          href: "/docs/getting-started",

          title: {
            en: "Getting started",
            pt: "Adicionando novos documentos",
          },

          items: [],
        },

        {
          title: {
            en: "Components",
          },

          label: {
            en: "New",
            pt: "Novo",
          },

          items: [
            {
              href: "/docs/components/avatar",

              title: {
                en: "Avatar",
                pt: "Cabeçalho de metadados",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },

            {
              href: "/docs/components/avatar-group",

              title: {
                en: "Avatar Group",
                pt: "Código",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },

            {
              href: "/docs/components/action_card",

              title: {
                en: "Action Card",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/accordion",

              title: {
                en: "Accordion",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/badge",

              title: {
                en: "Badge",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/button",

              title: {
                en: "Button",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/breadcrumbs",

              title: {
                en: "Breadcrumbs",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/card",

              title: {
                en: "Card",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/chip",

              title: {
                en: "Chip",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/center",

              title: {
                en: "Center",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/checkbox",

              title: {
                en: "Check Box",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/dialog",
              title: {
                en: "Dialog",
                pt: "Componentes",
              },
              label: {
                en: "New",
                pt: "Novo",
              },
              items: [],
            },
            {
              href: "/docs/components/divider",

              title: {
                en: "Divider",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/floatingsheet",

              title: {
                en: "Floating Sheet",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
            {
              href: "/docs/components/header",

              title: {
                en: "Header",
                pt: "Componentes",
              },

              label: {
                en: "New",
                pt: "Novo",
              },

              items: [],
            },
          ],
        },

        {
          href: "/docs/changelog",

          title: {
            en: "Changelog",
            pt: "Histórico de alterações",
          },

          items: [],
        },
      ],
    },
  ],
} as const;
