import { absoluteUrl } from '@/lib/utils'
import en from '@/i18n/locales/en.json'
import pt from '@/i18n/locales/pt.json'

export const siteConfig = {
  name: 'Glow UI Docs',

  description: {
    en: en.site.description,
    pt: pt.site.description,
  },

  url: process.env.NEXT_PUBLIC_APP_URL,

  og: {
    image: absoluteUrl('/og.jpg'),

    size: {
      width: 1200,
      height: 630,
    },
  },

  app: {
    latestVersion: '3.0.8',
  },

  author: {
    name: 'rit3zh',
    site: 'https://github.com/rit3zh',
  },

  links: {
    twitter: {
      label: 'Twitter',
      username: '@daltonmenezes',
      url: 'https://twitter.com/daltonmenezes',
    },

    github: {
      label: 'GitHub',
      url: 'https://github.com/daltonmenezes/opendocs',
    },
  },
} as const

export type SiteConfig = typeof siteConfig
