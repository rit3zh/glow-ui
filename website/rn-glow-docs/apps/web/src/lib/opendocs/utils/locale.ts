import { defaultLocale, locales } from '@/config/i18n'

import type { LocaleOptions } from '../types/i18n'

export function getObjectValueByLocale(
  obj: Record<string, string>,
  locale: LocaleOptions
) {
  return String(obj?.[locale] || obj?.[defaultLocale])
}

export function getSlugWithoutLocale(slug: string, context: string) {
  let slugWithoutLocaleFolder = slug

  for (const locale of locales) {
    const selectPathWithCurrentLocale = new RegExp(
      `^\/${context}\/(${locale})\/?`
    )

    if (selectPathWithCurrentLocale.test(slug)) {
      slugWithoutLocaleFolder = slugWithoutLocaleFolder
        .replace(new RegExp(`${locale}\/?`), '')
        .replace(/\/$/, '')
    }
  }

  return slugWithoutLocaleFolder
}
