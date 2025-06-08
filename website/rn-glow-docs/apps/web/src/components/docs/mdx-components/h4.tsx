import { cn } from '@/lib/utils'

export const h4 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    className={cn(
      'font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)
