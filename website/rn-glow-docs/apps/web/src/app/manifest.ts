import type { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    start_url: '/',
    theme_color: '#181423',
    display: 'standalone',

    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
