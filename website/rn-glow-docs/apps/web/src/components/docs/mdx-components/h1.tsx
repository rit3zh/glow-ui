import { cn } from '@/lib/utils'

export const h1 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn(
      'font-heading mt-2 scroll-m-20 text-4xl font-bold',
      className
    )}
    {...props}
  />
)
