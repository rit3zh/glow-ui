'use client'

import type { LinkProps } from 'next/link'

import { Link, useRouter } from '@/navigation'
import { cn } from '@/lib/utils'

export interface MobileLinkProps extends Omit<LinkProps, 'locale'> {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function MobileLink({
  href,
  children,
  className,
  onOpenChange,
  ...props
}: MobileLinkProps) {
  const router = useRouter()

  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
