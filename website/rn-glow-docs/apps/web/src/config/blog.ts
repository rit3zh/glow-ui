import type { BlogConfig } from '../lib/opendocs/types/blog'

export const blogConfig: BlogConfig = {
  mainNav: [
    {
      href: '/blog',

      title: {
        en: 'Blog',
      },
    },
  ],

  authors: [
    {
      /* the id property must be the same as author_id in the blog post mdx files required for the computed field
        in contentlayer.config.ts so we can get the author details from the blogConfig by comparing the author_id
        with the id below
      */
      id: 'daltonmenezes',
      name: 'Dalton Menezes',
      image: '/authors/daltonmenezes.jpg',
      site: 'https://daltonmenezes.com',
      email: 'daltonmenezes@outlook.com',

      bio: {
        en: 'Software Engineer | Writer | Designer',
        pt: 'Engenheiro de Software | Escritor | Designer',
      },

      social: {
        github: 'daltonmenezes',
        twitter: '@daltonmenezes',
        youtube: 'daltonmenezes',
        linkedin: 'daltonmenezes',
      },
    },
  ],

  rss: [
    {
      type: 'xml',
      file: 'blog.xml',
      contentType: 'application/xml',
    },

    {
      type: 'json',
      file: 'blog.json',
      contentType: 'application/json',
    },
  ],
} as const
