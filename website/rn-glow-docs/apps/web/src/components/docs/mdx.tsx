'use client'

import { useMDXComponent } from 'next-contentlayer2/hooks'
import Image from 'next/image'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

import { CodeBlockWrapper } from '@/components/docs/mdx-components/code-block-wrapper'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Callout } from '@/components/callout'
import { Link } from '@/navigation'
import { cn } from '@/lib/utils'

import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { blockquote } from './mdx-components/blockquote'
import { table } from './mdx-components/table'
import { code } from './mdx-components/code'
import { img } from './mdx-components/img'
import { pre } from './mdx-components/pre'
import { h1 } from './mdx-components/h1'
import { h2 } from './mdx-components/h2'
import { h3 } from './mdx-components/h3'
import { h4 } from './mdx-components/h4'
import { h5 } from './mdx-components/h5'
import { h6 } from './mdx-components/h6'
import { ul } from './mdx-components/ul'
import { ol } from './mdx-components/ol'
import { li } from './mdx-components/li'
import { hr } from './mdx-components/hr'
import { tr } from './mdx-components/tr'
import { th } from './mdx-components/th'
import { td } from './mdx-components/td'
import { a } from './mdx-components/a'
import { p } from './mdx-components/p'

import type { ComponentProps } from 'react'

const components = {
  Image,
  Alert,
  Callout,
  Accordion,
  AlertTitle,
  AspectRatio,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
  AlertDescription,

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  p,
  ul,
  ol,
  li,
  hr,
  tr,
  th,
  td,
  img,
  pre,
  code,
  table,
  blockquote,

  CodeBlockWrapper: ({ ...props }) => (
    <CodeBlockWrapper className="rounded-md border" {...props} />
  ),

  Step: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3
      className={cn(
        'font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),

  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step steps mb-12 ml-4 border-l pl-8 [counter-reset:step]"
      {...props}
    />
  ),

  Tabs: ({ className, ...props }: ComponentProps<typeof Tabs>) => (
    <Tabs className={cn('relative mt-6 w-full', className)} {...props} />
  ),

  TabsList: ({ className, ...props }: ComponentProps<typeof TabsList>) => (
    <TabsList
      className={cn(
        'w-full justify-start rounded-none border-b bg-transparent p-0',
        className
      )}
      {...props}
    />
  ),

  TabsTrigger: ({
    className,
    ...props
  }: ComponentProps<typeof TabsTrigger>) => (
    <TabsTrigger
      className={cn(
        'text-muted-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold shadow-none transition-none data-[state=active]:shadow-none',
        className
      )}
      {...props}
    />
  ),

  TabsContent: ({
    className,
    ...props
  }: ComponentProps<typeof TabsContent>) => (
    <TabsContent
      className={cn(
        'relative [&_h3.font-heading]:text-base [&_h3.font-heading]:font-semibold',
        className
      )}
      {...props}
    />
  ),

  Link: ({ className, ...props }: ComponentProps<typeof Link>) => (
    <Link
      className={cn('font-medium underline underline-offset-4', className)}
      {...props}
    />
  ),

  LinkedCard: ({ className, ...props }: ComponentProps<typeof Link>) => (
    <Link
      className={cn(
        'bg-card text-card-foreground hover:bg-muted/50 flex w-full flex-col items-center rounded-xl border p-6 shadow transition-colors sm:p-10',
        className
      )}
      {...props}
    />
  ),
}

interface MdxProps {
  code: string
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code)

  return (
    <div className="mdx">
      <Component components={components} />
    </div>
  )
}
