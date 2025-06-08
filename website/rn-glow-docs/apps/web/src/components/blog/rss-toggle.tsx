'use client'

import { type PointerEvent, useState } from 'react'
import { useLocale } from 'next-intl'
import ExternalLink from 'next/link'
import { Rss } from 'lucide-react'

import { useIsMobile } from '@/lib/opendocs/hooks/use-is-mobile'
import { Button, buttonVariants } from '@/components/ui/button'
import { blogConfig } from '@/config/blog'
import { cn } from '@/lib/utils'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

interface RSSToggleProps {
  messages: {
    rss_feed: string
  }
}

export function RSSToggle({ messages }: RSSToggleProps) {
  const isMobile = useIsMobile()
  const currentLocale = useLocale()

  const [open, setOpen] = useState(false)

  function openDropdown() {
    setOpen(() => true)
  }

  function closeDropdown(element: PointerEvent<HTMLElement>) {
    const target = element.relatedTarget as Element

    if ('closest' in target && target.closest('[role=menu]')) return

    setOpen(() => false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'flex place-self-end transition-all group pointer-events-auto relative w-fit gap-1 px-2',
            buttonVariants({ variant: 'ghost' }),
            'hover:text-amber-600',
            'aria-expanded:text-amber-600'
          )}
          aria-expanded={open}
          aria-label={messages.rss_feed}
          onClick={() => isMobile && openDropdown()}
          onPointerEnter={() => !isMobile && openDropdown()}
          onPointerLeave={(event) => !isMobile && closeDropdown(event)}
        >
          <Rss
            className="size-[1.2rem] transition-all dark:rotate-0 dark:scale-100"
            size={20}
          />

          <span className="sr-only">{messages.rss_feed}</span>
          <span className="pointer-events-auto absolute z-10 block h-14 w-full" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        role="menu"
        align="center"
        onPointerLeave={closeDropdown}
        className="flex flex-col items-center"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full">
          {blogConfig.rss.map(({ file, type }) => (
            <DropdownMenuItem asChild key={file}>
              <ExternalLink
                target="_blank"
                rel="noreferrer"
                aria-label={type}
                href={`/${currentLocale}/feed/${file}`}
              >
                {type}
              </ExternalLink>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
