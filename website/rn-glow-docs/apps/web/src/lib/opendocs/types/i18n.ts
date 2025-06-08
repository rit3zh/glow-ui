import { locale } from '@/config/i18n'

export type Locales = (keyof typeof locale)[]
export type LocaleOptions = Locales[number]

export type LocalizedRecord = Partial<{
  [key in LocaleOptions]: string
}>

export type IntlMessages = typeof import('@/i18n/locales/en.json')
