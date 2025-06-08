import React, { type PropsWithChildren } from 'react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

type FeaturedCardProps = PropsWithChildren<{
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}>

export function FeaturedCard({
  icon,
  title,
  children,
  description,
  orientation = 'vertical',
}: FeaturedCardProps) {
  return (
    <Card className="backdrop-blur-lg dark:bg-card-primary">
      <CardHeader
        className={cn(
          'flex gap-4 pb-2',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col'
        )}
      >
        {icon && (
          <div className="bg-muted/45 flex w-11 items-center justify-center rounded-md px-3 py-2 text-center text-lg">
            {icon}
          </div>
        )}

        {title && <CardTitle>{title}</CardTitle>}
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {description && <CardDescription>{description}</CardDescription>}

        {children}
      </CardContent>
    </Card>
  )
}
