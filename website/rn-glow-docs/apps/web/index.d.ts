import type { IntlMessages as Messages } from './src/lib/opendocs/types/i18n'

declare global {
  interface IntlMessages extends Messages {}

  type AbstractIntlMessages = Messages
}
