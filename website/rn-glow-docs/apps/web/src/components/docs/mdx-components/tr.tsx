import { cn } from '@/lib/utils'

export const tr = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('even:bg-muted m-0 border-t p-0', className)} {...props} />
)
