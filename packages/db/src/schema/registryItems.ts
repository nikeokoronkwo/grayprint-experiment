import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  boolean,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { templates } from './templates'
import { organizations } from './organizations'

export const registryItemTypeEnum = pgEnum('registry_item_type', [
  'registry:block',
  'registry:component',
  'registry:hook',
  'registry:page',
  'registry:file',
])

export const registryItems = pgTable(
  'registry_items',
  {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    namespace: text('namespace'),
    templateId: uuid('template_id').references(() => templates.id, {
      onDelete: 'set null',
    }),
    type: registryItemTypeEnum('type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    itemJson: jsonb('item_json').notNull(),
    isPrivate: boolean('is_private').default(false).notNull(),
    orgId: uuid('org_id').references(() => organizations.id, {
      onDelete: 'cascade',
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('registry_items_name_namespace_unique').on(
      table.name,
      table.namespace
    ),
  ]
)
