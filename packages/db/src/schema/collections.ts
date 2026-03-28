import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const collections = pgTable('collections', {
  id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(false).notNull(),
  templateIds: uuid('template_ids').array().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
