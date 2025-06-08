import { type Doc, allDocs } from 'contentlayer/generated'

import type { NavItem, SidebarNavItem } from '../types/nav'
import type { DocPageProps } from '../types/docs'

import { getSlugWithoutLocale } from './locale'
import { defaultLocale } from '@/config/i18n'
import { docsConfig } from '@/config/docs'

export function makeLocalizedSlug({ locale, slug }: DocPageProps['params']) {
  const _slug = slug?.join('/')
  const _locale = locale || defaultLocale

  const localizedSlug = [_locale, _slug].filter(Boolean).join('/')

  return localizedSlug
}

export async function getDocFromParams({
  params,
}: DocPageProps): Promise<(Doc & { notAvailable: boolean }) | null> {
  let localizedSlug = makeLocalizedSlug(params)
  let doc = allDocs.find((doc) => doc.slugAsParams === localizedSlug)

  if (!doc) {
    localizedSlug = makeLocalizedSlug({
      ...params,
      locale: defaultLocale,
    })

    doc = allDocs.find((doc) => doc.slugAsParams === localizedSlug)

    return doc ? { ...doc, notAvailable: true } : null
  }

  return { ...doc, notAvailable: false }
}

export function getBreadcrumb(docSlug: string) {
  const slug = getSlugWithoutLocale(docSlug, 'docs')

  const findBreadcrumbPath = (
    items: SidebarNavItem[],
    slug: string,
    path: SidebarNavItem[] = []
  ): NavItem[] | null => {
    for (const item of items) {
      const newPath = [...path, item]

      if (item.href === slug) {
        return newPath
      }

      if (item.items) {
        const foundPath = findBreadcrumbPath(item.items, slug, newPath)

        if (foundPath) {
          return foundPath
        }
      }
    }

    return null
  }

  const makeBreadcrumb = (
    slug: string,
    config: typeof docsConfig
  ): NavItem[] | null => {
    for (const nav of config.sidebarNav) {
      const path = findBreadcrumbPath([nav], slug)

      if (path) {
        return path
      }
    }

    return null
  }

  const breadcrumbs = makeBreadcrumb(slug, docsConfig)

  return breadcrumbs || []
}
