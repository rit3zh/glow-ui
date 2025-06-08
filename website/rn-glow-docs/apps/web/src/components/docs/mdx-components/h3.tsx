import { cn } from '@/lib/utils'

export const h3 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)
