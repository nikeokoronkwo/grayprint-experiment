import { type SQL, sql } from 'drizzle-orm';
import {
  type AnyPgColumn,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type {
  AiMetadata,
  ComponentRef,
  InstallInstruction,
  TemplatePreview,
} from '@grayprint/schemas';
import { user } from './auth.js';

/** Postgres `tsvector` custom type for full-text search. */
const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const category = pgTable(
  'category',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    icon: text('icon'),
    parentId: text('parent_id').references((): AnyPgColumn => category.id, {
      onDelete: 'set null',
    }),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('category_slug_idx').on(t.slug)],
);

export const tag = pgTable(
  'tag',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('tag_slug_idx').on(t.slug)],
);

export const template = pgTable(
  'template',
  {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    description: text('description').notNull(),
    kind: text('kind').notNull(),
    framework: text('framework').notNull(),
    license: text('license').notNull().default('MIT'),
    version: text('version').notNull().default('0.1.0'),
    status: text('status').notNull().default('draft'),
    visibility: text('visibility').notNull().default('public'),
    pricing: text('pricing').notNull().default('free'),
    priceCents: integer('price_cents').notNull().default(0),

    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    preview: jsonb('preview').$type<TemplatePreview>().notNull().default(sql`'{}'::jsonb`),
    install: jsonb('install').$type<InstallInstruction[]>().notNull().default(sql`'[]'::jsonb`),
    components: jsonb('components').$type<ComponentRef[]>().notNull().default(sql`'[]'::jsonb`),
    dependencies: jsonb('dependencies')
      .$type<Array<{ name: string; version?: string; kind: 'runtime' | 'dev' | 'peer' }>>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    ai: jsonb('ai').$type<AiMetadata>().notNull(),

    polarProductId: text('polar_product_id'),
    searchKeywords: jsonb('search_keywords').$type<string[]>().notNull().default(sql`'[]'::jsonb`),

    /**
     * Generated tsvector for full-text search.
     * A: title (highest weight), B: summary, C: description (first 8k chars are enough).
     * GIN-indexed below.
     */
    searchVector: tsvector('search_vector').generatedAlwaysAs(
      (): SQL => sql`
        setweight(to_tsvector('english', coalesce(${template.title}, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(${template.summary}, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(left(${template.description}, 8000), '')), 'C')
      `,
    ),

    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('template_slug_idx').on(t.slug),
    index('template_author_idx').on(t.authorId),
    index('template_kind_idx').on(t.kind),
    index('template_framework_idx').on(t.framework),
    index('template_status_idx').on(t.status),
    index('template_published_idx').on(t.publishedAt),
    index('template_search_idx').using('gin', t.searchVector),
  ],
);

export const templateCategory = pgTable(
  'template_category',
  {
    templateId: text('template_id')
      .notNull()
      .references(() => template.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => category.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.templateId, t.categoryId] })],
);

export const templateTag = pgTable(
  'template_tag',
  {
    templateId: text('template_id')
      .notNull()
      .references(() => template.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.templateId, t.tagId] })],
);

export const templateVersion = pgTable(
  'template_version',
  {
    id: text('id').primaryKey(),
    templateId: text('template_id')
      .notNull()
      .references(() => template.id, { onDelete: 'cascade' }),
    version: text('version').notNull(),
    changelog: text('changelog').notNull().default(''),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('template_version_idx').on(t.templateId, t.version),
    index('template_version_template_idx').on(t.templateId),
  ],
);
