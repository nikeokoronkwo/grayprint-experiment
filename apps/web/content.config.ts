import { defineContentConfig, defineCollection, z } from '@nuxt/content';

// Docs collection — markdown files under content/docs become pages at /docs/<slug>.
// The `page` type auto-emits `path`, `title`, `description`, and a renderable `body` AST.
// We add a single custom field, `order`, to drive the listing order on /docs.
export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        order: z.number().optional(),
      }),
    }),
  },
});
