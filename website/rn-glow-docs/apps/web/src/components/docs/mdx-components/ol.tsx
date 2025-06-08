import { cn } from '@/lib/utils'

export const ol = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
)
