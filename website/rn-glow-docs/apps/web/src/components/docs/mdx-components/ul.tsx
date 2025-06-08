import { cn } from '@/lib/utils'

export const ul = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn('ml-6 list-disc', className)} {...props} />
)
