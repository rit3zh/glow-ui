import { NextResponse } from 'next/server'
import { Feed, type Item } from 'feed'
import { cache } from 'react'

import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { RSSFeed } from '@/lib/opendocs/types/blog'

import { getObjectValueByLocale } from '@/lib/opendocs/utils/locale'
import { allBlogs, type Blog } from 'contentlayer/generated'
import { defaultLocale, locales } from '@/config/i18n'
import { siteConfig } from '@/config/site'
import { blogConfig } from '@/config/blog'
import { absoluteUrl } from '@/lib/utils'

function generateWebsiteFeeds({
  file,
  posts,
  locale,
}: {
  posts: Blog[]
  file: RSSFeed['file']
  locale: LocaleOptions
}) {
  const feed = new Feed({
    id: file,
    generator: siteConfig.name,
    copyright: siteConfig.name,
    image: siteConfig.og.image,
    language: locale || defaultLocale,
    title: `Blog - ${siteConfig.name}`,
    favicon: absoluteUrl('/favicon.ico'),
    link: absoluteUrl(`/${locale}/feed/${file}`),
    description: getObjectValueByLocale(siteConfig.description, locale),
  })

  const blogFeedEntries = posts
    .filter((post) => {
      const [postLocale] = post.slugAsParams.split('/')

      return postLocale === locale
    })
    .map((post) => {
      const [postLocale, ...postSlugList] = post.slugAsParams.split('/')
      const postSlug = postSlugList.join('/') || ''

      const postLink =
        postLocale === defaultLocale
          ? `/blog/${postSlug}`
          : `/${locale}/blog/${postSlug}`

      const link = absoluteUrl(postLink)

      return {
        id: link,
        link,
        title: post.title,
        description: post.excerpt,
        date: new Date(post.date || Date.now()),

        author: [
          {
            name: post.author?.name,
            link: post.author?.site,
            email: post.author?.email || ' ',
          },
        ],
      } as Item
    })

  for (const blogFeedEntry of blogFeedEntries) {
    feed.addItem(blogFeedEntry)
  }

  return new Map<string, Feed>([[file, feed]])
}

const provideWebsiteFeeds = cache(
  ({ feed, locale }: { feed: string; locale: LocaleOptions }) => {
    const websiteFeeds = generateWebsiteFeeds({
      locale,
      file: feed,
      posts: allBlogs,
    })

    switch (feed) {
      case 'blog.xml':
        return websiteFeeds.get(feed)?.rss2()

      case 'blog.json':
        return websiteFeeds.get(feed)?.json1()

      default:
        return undefined
    }
  }
)

type StaticParams = {
  params: { feed: RSSFeed['file']; locale: LocaleOptions }
}

export const generateStaticParams = async (): Promise<
  StaticParams['params'][]
> => {
  return blogConfig.rss
    .map(({ file }) => locales.map((locale) => ({ feed: file, locale })))
    .flat()
}

export const GET = async (_: Request, { params }: StaticParams) => {
  const websiteFeed = provideWebsiteFeeds({
    feed: params.feed,
    locale: params.locale || defaultLocale,
  })

  const feed = blogConfig.rss.find((rss) => rss.file === params.feed)

  const contentType = String(
    feed?.contentType || blogConfig.rss?.[0]?.contentType
  )

  return new NextResponse(websiteFeed, {
    status: websiteFeed ? 200 : 404,
    headers: {
      'Content-Type': contentType,
    },
  })
}

export const dynamicParams = true
export const dynamic = 'force-static'

const VERCEL_REVALIDATE = Number(
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  process.env.NEXT_PUBLIC_VERCEL_REVALIDATE_TIME || 300
)

export const revalidate = VERCEL_REVALIDATE
