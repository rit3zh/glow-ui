import { cn } from '@/lib/utils'

export const h6 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h6
    className={cn(
      'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)
