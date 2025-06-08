'use client'

import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import { useCallback, useEffect, useState } from 'react'

import type { NpmCommands } from '@/lib/opendocs/types/unist'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  src?: string
}

export async function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value)
}

export function CopyButton({
  src,
  value,
  className,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        'relative z-10 size-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50',
        className
      )}
      onClick={() => {
        copyToClipboardWithMeta(value)
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>

      {hasCopied ? (
        <CheckIcon className="size-3" />
      ) : (
        <CopyIcon className="size-3" />
      )}
    </Button>
  )
}

interface CopyNpmCommandButtonProps extends DropdownMenuTriggerProps {
  commands: Required<NpmCommands>
}

const packageManagers = ['npm', 'yarn', 'pnpm', 'bun'] as const

export function CopyNpmCommandButton({
  commands,
  className,
  ...props
}: CopyNpmCommandButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  const copyCommand = useCallback(
    (value: string, pm: (typeof packageManagers)[number]) => {
      copyToClipboardWithMeta(value)

      setHasCopied(true)
    },
    []
  )

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild {...props}>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'relative z-10 size-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50',
            className
          )}
        >
          {hasCopied ? (
            <CheckIcon className="size-3" />
          ) : (
            <CopyIcon className="size-3" />
          )}

          <span className="sr-only">Copy</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {packageManagers.map((packageManager) => {
          const packageManagerKey = Object.keys(commands).find(
            (key) => key === `__${packageManager}Command__`
          ) as keyof NpmCommands

          return (
            <DropdownMenuItem
              key={packageManager}
              onClick={() =>
                copyCommand(commands[packageManagerKey], packageManager)
              }
            >
              {packageManager}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
