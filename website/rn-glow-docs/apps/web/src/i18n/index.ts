import { getRequestConfig } from 'next-intl/server'
import deepmerge from 'deepmerge'

import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { AbstractIntlMessages } from 'next-intl'

import { locales } from '@/config/i18n'
import { routing } from '@/navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  const fallbackMessages: AbstractIntlMessages = await import(
    `@/i18n/locales/${routing.defaultLocale}.json`
  )

  let messagesFromCurrentLocale: AbstractIntlMessages = {}

  if (!locale || !locales.includes(locale as LocaleOptions)) {
    locale = routing.defaultLocale
  }

  try {
    messagesFromCurrentLocale = await import(`@/i18n/locales/${locale}.json`)
  } catch {}

  const messages = deepmerge(fallbackMessages, messagesFromCurrentLocale)

  return { messages, locale }
})
