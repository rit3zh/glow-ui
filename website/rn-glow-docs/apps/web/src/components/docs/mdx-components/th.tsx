import { cn } from '@/lib/utils'

export const th = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
      className
    )}
    {...props}
  />
)
