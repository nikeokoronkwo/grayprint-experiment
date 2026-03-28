import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const templateTypeEnum = pgEnum('template_type', [
  'template',
  'component',
  'block',
  'page',
  'hook',
  'utility',
])

export const templatePricingEnum = pgEnum('template_pricing', ['free', 'paid'])

export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  longDescription: text('long_description'),
  type: templateTypeEnum('type').default('template').notNull(),
  frameworks: text('frameworks').array().default([]).notNull(),
  pricing: templatePricingEnum('pricing').default('free').notNull(),
  priceInCents: integer('price_in_cents'),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  githubUrl: text('github_url'),
  previewUrl: text('preview_url'),
  screenshots: text('screenshots').array().default([]).notNull(),
  tags: text('tags').array().default([]).notNull(),
  downloadCount: integer('download_count').default(0).notNull(),
  starCount: integer('star_count').default(0).notNull(),
  isDynamic: boolean('is_dynamic').default(false).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  featuredAt: timestamp('featured_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
