import Balance from 'react-wrap-balancer'

import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

function PageHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

function PageHeaderHeading({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]',
        'dark:bg-gradient-to-r dark:from-slate-50 dark:to-slate-200 dark:bg-clip-text dark:text-transparent',
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Balance
      className={cn(
        'text-muted-foreground max-w-[750px] text-center text-lg sm:text-xl',
        className
      )}
      {...props}
    />
  )
}

function PageActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center space-x-4 py-4 md:pb-10',
        className
      )}
      {...props}
    />
  )
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription, PageActions }
