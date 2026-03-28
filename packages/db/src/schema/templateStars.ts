import {
  pgTable,
  timestamp,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { templates } from './templates'

export const templateStars = pgTable(
  'template_stars',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    templateId: uuid('template_id')
      .notNull()
      .references(() => templates.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.templateId] }),
  ]
)
