import { getTranslations, setRequestLocale } from 'next-intl/server'
import { allDocs } from 'contentlayer/generated'

import type { LocaleOptions } from '@/lib/opendocs/types/i18n'
import type { Metadata } from 'next'

import '@/styles/mdx.css'

import { DashboardTableOfContents } from '@/components/docs/toc'
import { DocumentNotFound } from '@/components/docs/not-found'
import { getTableOfContents } from '@/lib/opendocs/utils/toc'
import { DocBreadcrumb } from '@/components/docs/breadcrumb'
import { getDocFromParams } from '@/lib/opendocs/utils/doc'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DocPageProps } from '@/lib/opendocs/types/docs'
import { DocHeading } from '@/components/docs/heading'
import { DocsPager } from '@/components/docs/pager'
import { DocLinks } from '@/components/docs/links'
import { defaultLocale } from '@/config/i18n'
import { Mdx } from '@/components/docs/mdx'
import { siteConfig } from '@/config/site'
import { absoluteUrl } from '@/lib/utils'

export const dynamicParams = true

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const locale = params.locale

  setRequestLocale(locale || defaultLocale)

  const doc = await getDocFromParams({ params })

  if (!doc) {
    return {}
  }

  const [, ...docSlugList] = doc.slugAsParams.split('/')
  const docSlug = docSlugList.join('/') || ''

  return {
    title: doc.title,
    description: doc.description,

    openGraph: {
      type: 'article',
      title: doc.title,
      url: absoluteUrl(`/${locale}/docs/${docSlug}`),
      description: doc.description,

      images: [
        {
          ...siteConfig.og.size,
          url: siteConfig.og.image,
          alt: siteConfig.name,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.description,
      images: [siteConfig.og.image],
      creator: siteConfig.links.twitter.username,
    },
  }
}

export async function generateStaticParams(): Promise<
  DocPageProps['params'][]
> {
  const docs = allDocs.map((doc) => {
    const [locale, ...slugs] = doc.slugAsParams.split('/')

    return {
      slug: slugs,
      locale: locale as LocaleOptions,
    }
  })

  return docs
}

export default async function DocPage({ params }: DocPageProps) {
  setRequestLocale(params.locale || defaultLocale)

  const doc = await getDocFromParams({ params })
  const t = await getTranslations('docs')

  if (!doc) {
    return (
      <DocumentNotFound
        messages={{
          title: t('not_found.title'),
          description: t('not_found.description'),
        }}
      />
    )
  }

  const toc = await getTableOfContents(doc.body.raw)

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocBreadcrumb
          doc={doc}
          messages={{
            docs: t('docs'),
          }}
        />

        <DocHeading doc={doc} locale={params.locale} />
        <DocLinks doc={doc} />

        <div className="pb-12 pt-8">
          <Mdx code={doc.body.code} />
        </div>

        <DocsPager doc={doc} locale={params.locale} />
      </div>

      {doc.toc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-fit py-12">
                <DashboardTableOfContents
                  toc={toc}
                  sourceFilePath={doc._raw.sourceFilePath}
                  messages={{
                    onThisPage: t('on_this_page'),
                    editPageOnGitHub: t('edit_page_on_github'),
                    startDiscussionOnGitHub: t('start_discussion_on_github'),
                  }}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>
  )
}
