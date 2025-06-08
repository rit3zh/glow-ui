import rehypePrettyCode, { type Options } from 'rehype-pretty-code'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { codeImport } from 'remark-code-import'
import { visit } from 'unist-util-visit'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import type { BlogConfig } from './src/lib/opendocs/types/blog'

import {
  makeSource,
  defineNestedType,
  defineDocumentType,
  type ComputedFields,
} from 'contentlayer2/source-files'

import { rehypeNpmCommand } from './src/lib/opendocs/utils/rehype-npm-command'
import { getContentLayerCodeTheme } from './src/lib/opendocs/utils/code-theme'
import { blogConfig } from './src/config/blog'

const docComputedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },

  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
}

const blogComputedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (post) => `/${post._raw.flattenedPath}`,
  },

  slugAsParams: {
    type: 'string',
    resolve: (post) => post._raw.flattenedPath.split('/').slice(1).join('/'),
  },

  author: {
    type: 'nested',
    description: 'The author of the post',

    resolve: (
      post
    ): Partial<BlogConfig['authors'][number]> & { bio?: string } => {
      const author = blogConfig.authors.find(
        (author) => author.id === post.author_id
      )

      const [, locale] = post._raw.sourceFileDir.split('/')

      if (!author) {
        return {
          id: post?.author_id,
        }
      }

      return {
        ...author,
        bio: author.bio?.[locale as keyof typeof author.bio] || author.bio?.en,
      }
    },
  },

  readTimeInMinutes: {
    type: 'number',

    resolve: (post) => {
      const wordsPerMinute = 200
      const numberOfWords = post.body.raw.trim().split(/\s+/).length
      const readTimeInMinutes = numberOfWords / wordsPerMinute

      return Math.ceil(readTimeInMinutes)
    },
  },
}

const LinksProperties = defineNestedType(() => ({
  name: 'LinksProperties',

  fields: {
    doc: {
      type: 'string',
    },

    blog: {
      type: 'string',
    },

    api: {
      type: 'string',
    },

    source: {
      type: 'string',
    },
  },
}))

const AuthorProperties = defineNestedType(() => ({
  name: 'AuthorProperties',

  fields: {
    id: {
      type: 'string',
    },

    name: {
      type: 'string',
    },

    bio: {
      type: 'string',
    },

    site: {
      type: 'string',
    },

    email: {
      type: 'string',
    },

    image: {
      type: 'string',
    },

    social: {
      type: 'nested',

      of: defineNestedType(() => ({
        name: 'SocialProperties',

        fields: {
          github: {
            type: 'string',
          },

          twitter: {
            type: 'string',
          },

          youtube: {
            type: 'string',
          },

          linkedin: {
            type: 'string',
          },
        },
      })),
    },
  },
}))

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  contentType: 'mdx',
  filePathPattern: `docs/**/*.mdx`,

  fields: {
    title: {
      type: 'string',
      required: true,
    },

    description: {
      type: 'string',
      required: true,
    },

    links: {
      type: 'nested',
      of: LinksProperties,
    },

    toc: {
      type: 'boolean',
      default: true,
      required: false,
    },
  },

  computedFields: docComputedFields,
}))

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  contentType: 'mdx',
  filePathPattern: `blog/**/*.mdx`,

  fields: {
    title: {
      type: 'string',
      required: true,
    },

    excerpt: {
      type: 'string',
      required: true,
    },

    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },

    author: {
      type: 'nested',
      of: AuthorProperties,
    },

    author_id: {
      type: 'string',
      description: 'The author of the post',
    },

    og_image: {
      type: 'string',
      description: 'The image for the open graph meta tag',
    },

    links: {
      type: 'nested',
      of: LinksProperties,
    },

    tags: {
      type: 'list',
      of: { type: 'string' },
      required: true,
    },
  },

  computedFields: blogComputedFields,
}))

export default makeSource({
  documentTypes: [Doc, Blog],
  contentDirPath: '../content',
  contentDirInclude: ['docs', 'blog'],

  mdx: {
    remarkPlugins: [remarkGfm, codeImport],

    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === 'element' && node?.tagName === 'pre') {
            const [codeEl] = node.children
            if (codeEl.tagName !== 'code') {
              return
            }

            node.__rawString__ = codeEl.children?.[0].value
            node.__src__ = node.properties?.__src__
            node.__style__ = node.properties?.__style__
          }
        })
      },

      [
        rehypePrettyCode,
        {
          keepBackground: false,
          theme: getContentLayerCodeTheme(),

          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },

          onVisitHighlightedLine(node) {
            node?.properties?.className?.push('line--highlighted')
          },

          onVisitHighlightedChars(node) {
            node.properties.className = ['word--highlighted']
          },
        } as Options,
      ],

      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === 'element' && !!node?.tagName) {
            const preElement = node?.children?.at(-1)

            if (preElement?.tagName !== 'pre') {
              return
            }

            preElement.properties['__withMeta__'] =
              node?.children?.at(0)?.tagName === 'div'

            preElement.properties['__rawString__'] = node?.__rawString__

            if (node?.__src__) {
              preElement.properties['__src__'] = node.__src__
            }

            if (node?.__style__) {
              preElement.properties['__style__'] = node.__style__
            }
          }
        })
      },

      rehypeNpmCommand,

      [
        rehypeAutolinkHeadings,

        {
          properties: {
            ariaLabel: 'Link to section',
            className: ['subheading-anchor'],
          },
        },
      ],
    ],
  },
})
