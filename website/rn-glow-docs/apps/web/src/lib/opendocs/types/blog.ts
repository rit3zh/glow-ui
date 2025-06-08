import type { LocaleOptions, LocalizedRecord } from './i18n'
import type { NavItem } from './nav'

export interface PostAuthor {
  id?: string
  name?: string
  site?: string
  email?: string
  image?: string
  bio?: LocalizedRecord

  social?: {
    github?: string
    twitter?: string
    youtube?: string
    linkedin?: string
  }
}

export interface RSSFeed {
  file: string
  type: string
  contentType: string
}

export interface BlogConfig {
  mainNav: NavItem[]
  authors: PostAuthor[]

  rss: RSSFeed[]
}

export interface BlogPageProps {
  params: {
    slug: string[]
    locale: LocaleOptions
  }
}
