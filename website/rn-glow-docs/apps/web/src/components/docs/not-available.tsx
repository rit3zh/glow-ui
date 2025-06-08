import { defaultLocale } from '@/config/i18n'

const messages = {
  pt: 'Este conteúdo não está disponível em sua língua ainda',
  en: 'This content is not available in your language yet',
  es: 'Este contenido no está disponible en su idioma todavía',
  fr: "Ce contenu n'est pas encore disponible dans votre langue",
  de: 'Dieser Inhalt ist noch nicht in Ihrer Sprache verfügbar',
  it: 'Questo contenuto non è ancora disponibile nella tua lingua',
  ja: 'このコンテンツはまだあなたの言語で利用できません',
  ko: '이 콘텐츠는 아직 귀하의 언어로 제공되지 않았습니다',
  nl: 'Deze inhoud is nog niet beschikbaar in uw taal',
  pl: 'Ten zasób nie jest jeszcze dostępny w twoim języku',
  ru: 'Этот контент пока не доступен на вашем языке',
  zh: '此内容尚未提供您的语言版本',
} as const

type Locales = keyof typeof messages

type Props = {
  locale: Locales | (string & {})
}

export function DocNotAvailableInThisLanguage({ locale }: Props) {
  const message = messages?.[locale as Locales]

  return (
    <div className="rounded-md border border-amber-600/50 bg-amber-800/70 p-4">
      ⚠️ {message || messages[defaultLocale]}.
    </div>
  )
}
