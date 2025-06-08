import { cn } from '@/lib/utils'

export const a = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLAnchorElement>) => (
  <a
    className={cn('font-medium underline underline-offset-4', className)}
    {...props}
  />
)
