import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { templates } from './templates'

export const purchases = pgTable('purchases', {
  id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  templateId: uuid('template_id')
    .notNull()
    .references(() => templates.id, { onDelete: 'restrict' }),
  amountInCents: integer('amount_in_cents').notNull(),
  currency: text('currency').default('usd').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id').unique(),
  licenseKey: text('license_key').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
