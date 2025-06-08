import type { ComponentProps } from 'react'

import { highlightServerCode } from '@/lib/opendocs/utils/code-theme'
import { cn } from '@/lib/utils'

type CodeBlockProps = ComponentProps<'div'> & {
  code: string
  language?: string
  theme?: Parameters<typeof highlightServerCode>[1]
}

export async function CodeBlock({
  code,
  theme,
  className,
  language,
  ...props
}: CodeBlockProps) {
  const htmlCode = await highlightServerCode(code, theme, language)

  return (
    <div
      className={cn(
        'mb-4 mt-6 max-h-[650px] overflow-x-auto p-4 overflow-auto rounded-lg border py-4',
        'bg-primary dark:bg-zinc-900 text-white',
        className
      )}
      {...props}
    >
      <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
    </div>
  )
}
