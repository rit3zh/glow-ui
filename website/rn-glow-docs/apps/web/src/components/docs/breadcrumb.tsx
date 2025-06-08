import { ChevronRightIcon } from 'lucide-react'
import { Fragment } from 'react'

import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { Doc } from 'contentlayer/generated'

import { getObjectValueByLocale } from '@/lib/opendocs/utils/locale'
import { getBreadcrumb } from '@/lib/opendocs/utils/doc'
import { defaultLocale } from '@/config/i18n'
import { Link } from '@/navigation'

interface DocBreadcrumbProps {
  doc: Doc

  messages: {
    docs: string
  }
}

export function DocBreadcrumb({ doc, messages }: DocBreadcrumbProps) {
  const [locale] = (doc.slugAsParams.split('/') || defaultLocale) as [
    LocaleOptions,
  ]

  const breadcrumbItems = getBreadcrumb(doc.slug)

  return (
    <div className="text-muted-foreground mb-4 flex items-center space-x-1 text-sm">
      <Link href="/docs" className="text-foreground hover:underline">
        {messages.docs}
      </Link>

      {breadcrumbItems?.map((item, index, items) => {
        const isLastItem = index === items.length - 1
        const docTitle = getObjectValueByLocale(item.title, locale)

        return (
          <Fragment key={index}>
            <ChevronRightIcon className="size-4" />

            {item.href && !isLastItem ? (
              <Link
                href={item.href}
                className="truncate text-foreground font-medium hover:underline"
              >
                {docTitle}
              </Link>
            ) : (
              <span className="truncate">{docTitle}</span>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
