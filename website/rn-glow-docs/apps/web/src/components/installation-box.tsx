import {
  CopyButton,
  CopyNpmCommandButton,
} from './docs/mdx-components/copy-button'

import { highlightServerCode } from '@/lib/opendocs/utils/code-theme'
import { cn } from '@/lib/utils'

import type { NpmCommands } from '@/lib/opendocs/types/unist'

export const InstallationBox = async ({
  theme,
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
  theme?: Parameters<typeof highlightServerCode>[1]
} & NpmCommands) => {
  const htmlCode = await highlightServerCode(
    __rawString__ || '',
    theme || 'Aura Theme',
    'shell'
  )

  return (
    <div className="relative">
      <pre
        className={cn(
          'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 text-white dark:bg-zinc-900',
          className
        )}
        {...props}
        dangerouslySetInnerHTML={{ __html: htmlCode }}
      />

      {__rawString__ && !__npmCommand__ && (
        <CopyButton
          value={__rawString__}
          src={__src__}
          className={cn('absolute right-4 top-10')}
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
            className={cn('absolute right-4 top-10')}
          />
        )}
    </div>
  )
}
