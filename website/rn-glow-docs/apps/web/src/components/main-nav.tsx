'use client'

import { Link, usePathname } from '@/navigation'
import { Icons } from '@/components/icons'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface MainNavProps {
  messages: {
    docs: string
    blog?: string
  }
}

export function MainNav({ messages }: MainNavProps) {
  const pathname = usePathname()

  return (
    <div className="ml-5 mt-3 hidden md:flex">
      <Link href="/" className="mr-2 flex items-center">
        <Image src={require('../../../web/public/logo_.png')} alt='logo' className='w-10 h-10'/>
      </Link>

      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/docs"
          className={cn(
            'hover:text-foreground/80 transition-colors',
            pathname.includes('/docs')
              ? 'dark:text-primary-active'
              : 'text-foreground/60'
          )}
        >
          {messages.docs}
        </Link>
      </nav>
    </div>
  )
}
