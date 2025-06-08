import { CopyButton, CopyNpmCommandButton } from './copy-button'
import { cn } from '@/lib/utils'

import type { NpmCommands } from '@/lib/opendocs/types/unist'

export const pre = ({
  className,
  __src__,
  __style__,
  __withMeta__,
  __rawString__,
  __bunCommand__,
  __npmCommand__,
  __yarnCommand__,
  __pnpmCommand__,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & {
  __src__?: string
  __rawString__?: string
  __withMeta__?: boolean
  __style__?: 'default' | 'new-york'
} & NpmCommands) => {
  return (
    <div className="relative">
      <pre
        className={cn(
          'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 text-white dark:bg-zinc-900',
          className
        )}
        {...props}
      />

      {__rawString__ && !__npmCommand__ && (
        <CopyButton
          value={__rawString__}
          src={__src__}
          className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
        />
      )}
      {__npmCommand__ &&
        __yarnCommand__ &&
        __pnpmCommand__ &&
        __bunCommand__ && (
          <CopyNpmCommandButton
            commands={{
              __bunCommand__,
              __npmCommand__,
              __yarnCommand__,
              __pnpmCommand__,
            }}
            className={cn('absolute right-4 top-4', __withMeta__ && 'top-16')}
          />
        )}
    </div>
  )
}
