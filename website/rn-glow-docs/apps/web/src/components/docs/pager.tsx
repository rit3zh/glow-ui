import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

import type { NavItem, NavItemWithChildren } from '@/lib/opendocs/types/nav'
import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { Doc } from 'contentlayer/generated'

import {
  getSlugWithoutLocale,
  getObjectValueByLocale,
} from '@/lib/opendocs/utils/locale'

import { getServerDocsConfig } from '@/lib/opendocs/utils/get-server-docs-config'
import { buttonVariants } from '../ui/button'
import { Link } from '@/navigation'
import { cn } from '@/lib/utils'

interface DocsPagerProps {
  doc: Doc
  locale: LocaleOptions
}

export async function DocsPager({ doc, locale }: DocsPagerProps) {
  const pager = await getPagerForCurrentDoc({
    doc,
    locale,
  })

  if (!pager) {
    return null
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev?.href && (
        <Link
          href={pager.prev.href}
          className={buttonVariants({ variant: 'outline' })}
        >
          <ChevronLeftIcon className="mr-2 size-4" />

          {getObjectValueByLocale(pager.prev.title, pager.currentLocale)}
        </Link>
      )}

      {pager?.next?.href && (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto')}
        >
          {getObjectValueByLocale(pager.next.title, pager.currentLocale)}

          <ChevronRightIcon className="ml-2 size-4" />
        </Link>
      )}
    </div>
  )
}

export async function getPagerForCurrentDoc({
  doc,
  locale,
}: {
  doc: Doc
  locale: LocaleOptions
}) {
  const docsConfig = await getServerDocsConfig({ locale })
  const flattenedLinks = [null, ...flatten(docsConfig.docs.sidebarNav), null]

  const slugWithoutLocaleFolder = getSlugWithoutLocale(doc.slug, 'docs')

  const activeIndex = flattenedLinks.findIndex(
    (link) => slugWithoutLocaleFolder === link?.href
  )

  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null

  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null

  return {
    prev,
    next,
    currentLocale: docsConfig.currentLocale,
  }
}

export function flatten(links: NavItemWithChildren[]): NavItem[] {
  return links
    .reduce<NavItem[]>((flat, link) => {
      return [
        ...flat,
        ...(link.href ? [link] : []),
        ...(link.items?.length > 0 ? flatten(link.items) : []),
      ]
    }, [])
    .filter((link) => !link?.disabled)
}
