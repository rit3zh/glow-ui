import { cn } from '@/lib/utils'

export const img = ({
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className={cn('rounded-md', className)} alt={alt} {...props} />
)
