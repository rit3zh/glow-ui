import { ArrowRightIcon } from '@radix-ui/react-icons'

import { Separator } from '@/components/ui/separator'
import { Link } from '@/navigation'

export function Announcement({
  title,
  href,
}: {
  title: string
  href?: string
}) {
  return (
    <Link
      href={href ? href : '/docs/changelog'}
      className="border bg-card-primary border-input group inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium"
    >
      🎉{' '}
      <Separator className="mx-2 h-4 dark:bg-border" orientation="vertical" />{' '}
      <span className="sm:hidden">{title}</span>
      <span className="hidden sm:inline">{title}</span>
      <ArrowRightIcon className="ml-1 size-4 transition group-hover:translate-x-1" />
    </Link>
  )
}
