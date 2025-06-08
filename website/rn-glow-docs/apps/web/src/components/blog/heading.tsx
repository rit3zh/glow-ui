import Balancer from 'react-wrap-balancer'

import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { Blog } from 'contentlayer/generated'

import { DocNotAvailableInThisLanguage } from '../docs/not-available'
import { getObjectValueByLocale } from '@/lib/opendocs/utils/locale'
import { cn, formatDate } from '@/lib/utils'
import { dateLocales } from '@/config/i18n'
import { ReadTime } from './read-time'

interface BlogPostHeadingProps {
  locale: LocaleOptions
  post: Blog & { notAvailable: boolean }

  messages: {
    by: string
    min_read: string
  }
}

export function BlogPostHeading({
  post,
  locale,
  messages,
}: BlogPostHeadingProps) {
  return (
    <div className="flex flex-col space-y-2 gap-2">
      <h1
        className={cn(
          'scroll-m-20 text-4xl sm:text-6xl font-bold tracking-tight'
        )}
      >
        <Balancer>{post.title}</Balancer>
      </h1>

      <div className="flex flex-col">
        <ReadTime
          iconSize={13}
          variant="unstyled"
          time={post.readTimeInMinutes}
          className="text-md max-w-max"
          messages={{ min_read: messages.min_read }}
        />

        <div className="inline-flex flex-wrap items-center gap-2">
          <time dateTime={post.date} className="text-sm text-gray-500">
            {formatDate(post.date, getObjectValueByLocale(dateLocales, locale))}
          </time>

          {post.author?.name && (
            <span className="truncate max-w-52">
              <Balancer>
                {messages.by} {post.author?.name}
              </Balancer>
            </span>
          )}
        </div>
      </div>

      {post.excerpt && (
        <p className="text-muted-foreground text-xl">
          <Balancer>{post.excerpt}</Balancer>
        </p>
      )}

      {post.notAvailable && <DocNotAvailableInThisLanguage locale={locale} />}
    </div>
  )
}
