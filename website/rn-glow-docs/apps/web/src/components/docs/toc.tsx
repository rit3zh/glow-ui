'use client'

import { useMemo, useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { useMounted } from '@/lib/opendocs/hooks/use-mounted'
import { TableOfContents } from '@/lib/opendocs/utils/toc'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

interface DefaultTableOfContentItemsProps {
  sourceFilePath: string

  messages: {
    onThisPage: string
    editPageOnGitHub: string
    startDiscussionOnGitHub: string
  }
}

interface DashboardTableOfContentsProps
  extends DefaultTableOfContentItemsProps {
  toc: TableOfContents
}

export function DashboardTableOfContents({
  toc,
  messages,
  sourceFilePath,
}: DashboardTableOfContentsProps) {
  const itemIds = useMemo(
    () =>
      toc.items
        ? toc.items
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split('#')[1])
        : [],
    [toc]
  )

  const mounted = useMounted()
  const activeHeading = useActiveItem(itemIds as string[])

  if (!toc?.items || !mounted) {
    return (
      <div className="space-y-2">
        <DefaultTableOfContentItems
          messages={messages}
          sourceFilePath={sourceFilePath}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">{messages.onThisPage}</p>

      <Tree tree={toc} activeItem={activeHeading as string} />

      <div className="py-4">
        <Separator />
      </div>

      <DefaultTableOfContentItems
        messages={messages}
        sourceFilePath={sourceFilePath}
      />
    </div>
  )
}

function DefaultTableOfContentItems({
  messages,
  sourceFilePath,
}: DefaultTableOfContentItemsProps) {
  return (
    <div className="mt-2 flex flex-col gap-1">
      <a
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
        href={`${siteConfig.links.github.url}/edit/main/apps/content/${sourceFilePath}`}
      >
        {messages.editPageOnGitHub} <ExternalLink size={12} />
      </a>

      <a
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition"
        href={`${siteConfig.links.github.url}/discussions/new/choose`}
      >
        {messages.startDiscussionOnGitHub} <ExternalLink size={12} />
      </a>
    </div>
  )
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` }
    )

    itemIds?.forEach((id) => {
      const element = document.getElementById(id)

      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id)

        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [itemIds])

  return activeId
}

interface TreeProps {
  level?: number
  activeItem?: string
  tree: TableOfContents
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  return tree?.items?.length && level < 3 ? (
    <ul className={cn('m-0 list-none', { 'pl-4': level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li key={index} className={cn('mt-0 pt-2')}>
            <a
              href={item.url}
              className={cn(
                'hover:text-foreground inline-block no-underline transition-colors',
                item.url === `#${activeItem}`
                  ? 'text-foreground border-l-primary-active border-l-2 pl-2 font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {item.title}
            </a>

            {item.items?.length ? (
              <Tree tree={item} level={level + 1} activeItem={activeItem} />
            ) : null}
          </li>
        )
      })}
    </ul>
  ) : null
}
