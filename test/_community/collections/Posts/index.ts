import type { Block, CollectionConfig, Field } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const postsSlug = 'posts'

/**
 * Depth-limited recursive block factory — the documented community pattern for
 * recursive block structures (see e.g. discussion #4238): every nesting level
 * returns a distinct block config object sharing the same `slug` and
 * `interfaceName`; the deepest level omits the nested `children` field.
 */
const buildRecursiveBlock = (depth: number): Block => {
  const fields: Field[] = [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
  ]

  if (depth > 1) {
    fields.push({
      name: 'children',
      type: 'blocks',
      blocks: [buildRecursiveBlock(depth - 1)],
    })
  }

  return {
    slug: 'recursiveItem',
    fields,
    interfaceName: 'RecursiveItemBlock',
  }
}

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
    {
      name: 'recursiveBlockField',
      type: 'blocks',
      blocks: [buildRecursiveBlock(3)],
    },
  ],
  versions: false,
}
