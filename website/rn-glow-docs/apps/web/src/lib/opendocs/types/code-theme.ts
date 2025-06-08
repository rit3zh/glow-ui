import { bundledThemes, bundledLanguages } from 'shiki'

import { localCodeThemes } from '@/config/code-theme'

export type LocalCodeThemes = typeof localCodeThemes
export type BundledCodeThemeOptions = keyof typeof bundledThemes
export type BundledCodeLanguageOptions = keyof typeof bundledLanguages

export type CodeTheme =
  | BundledCodeThemeOptions
  | LocalCodeThemes[number]
  | (string & {})

export type CodeThemeLanguage = BundledCodeLanguageOptions | (string & {})

export interface CodeThemeConfig {
  theme: CodeTheme
  languages: CodeThemeLanguage[]
  localThemes: LocalCodeThemes
}
