import { cn } from '@/lib/utils'

export const td = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
      className
    )}
    {...props}
  />
)
