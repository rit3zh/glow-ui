import { LinkedInLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import { Globe, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import type { Blog } from 'contentlayer/generated'

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'
import { Icons } from '../icons'

export function AuthorCard({ post }: { post: Blog }) {
  const { author } = post

  return (
    <Card className="backdrop-blur-lg dark:bg-card-primary w-full">
      <CardHeader
        className={cn('flex gap-4 flex-wrap', 'flex-row items-center')}
      >
        {author?.image && (
          <Image
            width={80}
            height={80}
            src={post.author?.image!}
            alt={post.author?.name!}
            className="w-20 rounded-full border-4 border-muted"
          />
        )}

        <div className="flex flex-col items-start justify-start">
          {author?.name && <CardTitle>{author.name}</CardTitle>}

          <CardContent className="p-0 pt-1">
            {author?.bio && <CardDescription>{author.bio}</CardDescription>}
          </CardContent>

          <div className="flex flex-wrap items-center w-full pt-2">
            {author?.site && (
              <Link
                aria-label={author.site}
                title={author.site}
                href={author.site}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-accent-foreground w-fit',
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'px-2'
                )}
              >
                <Globe size={16} />
              </Link>
            )}

            {author?.social?.github && (
              <Link
                aria-label={author?.social?.github}
                title={author?.social?.github}
                href={`https://github.com/${author?.social?.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-accent-foreground w-fit',
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'px-2'
                )}
              >
                <Icons.gitHub className="size-4" />
              </Link>
            )}

            {author?.social?.twitter && (
              <Link
                aria-label={author?.social?.twitter}
                title={author?.social?.twitter}
                href={`https://x.com/${author?.social?.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-accent-foreground w-fit',
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'px-2'
                )}
              >
                <TwitterLogoIcon />
              </Link>
            )}

            {author?.social?.linkedin && (
              <Link
                aria-label={author?.social?.linkedin}
                title={author?.social?.linkedin}
                href={`https://linkedin.com/in/${author?.social?.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-accent-foreground w-fit',
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'px-2'
                )}
              >
                <LinkedInLogoIcon />
              </Link>
            )}

            {author?.social?.youtube && (
              <Link
                aria-label={author?.social?.youtube}
                title={author?.social?.youtube}
                href={`https://www.youtube.com/${author?.social?.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-accent-foreground w-fit',
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'px-2'
                )}
              >
                <Icons.youtube className="size-4" />
              </Link>
            )}

            {author?.email && (
              <Link
                aria-label={author.email}
                title={author.email}
                href={`mailto:${author.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'text-accent-foreground w-fit',
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'px-2'
                )}
              >
                <Mail size={16} />
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
