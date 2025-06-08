'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import type { Blog } from 'contentlayer/generated'

import { PaginationEllipsis } from '../ui/pagination'
import { Link } from '@/navigation'
import { Badge } from '../ui/badge'

export function BlogPostItemTags({
  post,
  limitOfTagsToDisplay = 5,
}: {
  post: Blog
  limitOfTagsToDisplay?: number
}) {
  const searchParams = useSearchParams()

  const totalOfTags = post?.tags?.length || 0
  const shouldDisplayEllipsis = totalOfTags > limitOfTagsToDisplay

  const tags = useMemo(() => {
    if (!post?.tags) {
      return null
    }

    const tags = shouldDisplayEllipsis
      ? post.tags.slice(0, limitOfTagsToDisplay)
      : post.tags

    const uniqueTags = Array.from(new Set(tags))

    return uniqueTags
  }, [post?.tags, limitOfTagsToDisplay, shouldDisplayEllipsis])

  if (!tags) {
    return null
  }

  return (
    <div className="w-fit flex flex-wrap items-center gap-2 pt-4">
      {tags.map((tag) => {
        const currentTag = searchParams.get('tag') || ''
        const isCurrentTagActive = tag === currentTag

        const href = isCurrentTagActive
          ? '/blog'
          : `/blog?tag=${encodeURI(tag)}`

        return (
          <Link key={tag} href={href}>
            <Badge variant={isCurrentTagActive ? 'default' : 'secondary'}>
              {tag}
            </Badge>
          </Link>
        )
      })}

      {shouldDisplayEllipsis && (
        <Badge variant="secondary" className="pointer-events-none">
          <PaginationEllipsis className="w-fit h-full" />
        </Badge>
      )}
    </div>
  )
}
