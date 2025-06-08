import { type Blog, allBlogs } from 'contentlayer/generated'

import type { BlogPageProps } from '../types/blog'

import { defaultLocale } from '@/config/i18n'

export function makeLocalizedSlug({ locale, slug }: BlogPageProps['params']) {
  const _slug = slug?.join('/')
  const _locale = locale || defaultLocale

  const localizedSlug = [_locale, _slug].filter(Boolean).join('/')

  return localizedSlug
}

export async function getBlogFromParams({
  params,
}: BlogPageProps): Promise<(Blog & { notAvailable: boolean }) | null> {
  let localizedSlug = makeLocalizedSlug(params)
  let blog = allBlogs.find((blog) => blog.slugAsParams === localizedSlug)

  if (!blog) {
    localizedSlug = makeLocalizedSlug({
      ...params,
      locale: defaultLocale,
    })

    blog = allBlogs.find((blog) => blog.slugAsParams === localizedSlug)

    return blog ? { ...blog, notAvailable: true } : null
  }

  return { ...blog, notAvailable: false }
}
