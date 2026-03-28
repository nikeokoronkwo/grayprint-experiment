import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { templates } from './templates'

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    templateId: uuid('template_id')
      .notNull()
      .references(() => templates.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('reviews_template_user_unique').on(
      table.templateId,
      table.userId
    ),
  ]
)
