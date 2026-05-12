import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth.js';

export const entitlement = pgTable(
  'entitlement',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    kind: text('kind').notNull(),
    resource: text('resource').notNull(),
    permissions: jsonb('permissions')
      .$type<Array<'view' | 'download' | 'fork' | 'admin'>>()
      .notNull()
      .default(sql`'["view"]'::jsonb`),
    source: text('source').notNull().default('free'),
    polarOrderId: text('polar_order_id'),
    polarSubscriptionId: text('polar_subscription_id'),
    validFrom: timestamp('valid_from', { withTimezone: true }).notNull().defaultNow(),
    validUntil: timestamp('valid_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('entitlement_user_idx').on(t.userId),
    index('entitlement_resource_idx').on(t.kind, t.resource),
  ],
);

/** Polar webhook event log — idempotency + audit. */
export const polarEvent = pgTable(
  'polar_event',
  {
    id: text('id').primaryKey(),
    type: text('type').notNull(),
    payload: jsonb('payload').notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('polar_event_id_idx').on(t.id),
    index('polar_event_type_idx').on(t.type),
  ],
);
