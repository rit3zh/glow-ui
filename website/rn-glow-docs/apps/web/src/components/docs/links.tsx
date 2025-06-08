import { getTranslations } from 'next-intl/server'
import { ExternalLinkIcon } from 'lucide-react'

import type { Doc } from 'contentlayer/generated'

import { badgeVariants } from '../ui/badge'
import { Link } from '@/navigation'
import { cn } from '@/lib/utils'

export async function DocLinks({ doc }: { doc: Doc }) {
  if (!doc?.links) {
    return null
  }

  const t = await getTranslations()

  return (
    <div className="flex items-center space-x-2 pt-4">
      {doc.links?.source && (
        <Link
          href={doc.links.source}
          target="_blank"
          rel="noreferrer"
          className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}
        >
          {t('docs.source')}

          <ExternalLinkIcon className="size-3" />
        </Link>
      )}

      {doc.links?.doc && (
        <Link
          href={doc.links.doc}
          target="_blank"
          rel="noreferrer"
          className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}
        >
          {t('docs.docs')}

          <ExternalLinkIcon className="size-3" />
        </Link>
      )}

      {doc.links?.api && (
        <Link
          href={doc.links.api}
          target="_blank"
          rel="noreferrer"
          className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}
        >
          {t('docs.api_reference')}

          <ExternalLinkIcon className="size-3" />
        </Link>
      )}

      {doc.links?.blog && (
        <Link
          href={doc.links.blog}
          target="_blank"
          rel="noreferrer"
          className={cn(badgeVariants({ variant: 'secondary' }), 'gap-1')}
        >
          {t('site.words.blog')}

          <ExternalLinkIcon className="size-3" />
        </Link>
      )}
    </div>
  )
}
