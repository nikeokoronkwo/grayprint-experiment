import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'
import { templates } from './templates'

export const templateVersions = pgTable('template_versions', {
  id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  templateId: uuid('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'cascade' }),
  version: text('version').notNull(),
  changelog: text('changelog'),
  manifestJson: jsonb('manifest_json'),
  fileSize: integer('file_size'),
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
