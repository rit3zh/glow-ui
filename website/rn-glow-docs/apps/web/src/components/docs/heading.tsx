import Balancer from 'react-wrap-balancer'

import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { Doc } from 'contentlayer/generated'

import { DocNotAvailableInThisLanguage } from './not-available'

interface DocHeadingProps {
  doc: Doc & { notAvailable: boolean }
  locale: LocaleOptions
}

export function DocHeading({ doc, locale }: DocHeadingProps) {
  return (
    <div className="space-y-2">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {doc.title}
      </h1>

      {doc.description && (
        <p className="text-muted-foreground text-lg">
          <Balancer>{doc.description}</Balancer>
        </p>
      )}

      {doc.notAvailable && <DocNotAvailableInThisLanguage locale={locale} />}
    </div>
  )
}
