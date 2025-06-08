import { defaultLocale } from '@/config/i18n'

import type { LocaleOptions } from '../types/i18n'

interface ServerDocsConfig {
  locale: LocaleOptions
}

export async function getServerDocsConfig({ locale }: ServerDocsConfig) {
  const { docsConfig } = await import(`@/config/docs`)

  return {
    docs: docsConfig,
    currentLocale: locale || defaultLocale,
  }
}
