import { cn } from '@/lib/utils'

export const table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="my-6 w-full overflow-y-auto">
    <table className={cn('w-full', className)} {...props} />
  </div>
)
