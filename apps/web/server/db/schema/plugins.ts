import { boolean, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth';

/** better-auth `apiKey` plugin table — the agent-auth surface. */
export const apiKey = pgTable(
  'api_key',
  {
    id: text('id').primaryKey(),
    name: text('name'),
    start: text('start'),
    prefix: text('prefix'),
    key: text('key').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    refillInterval: integer('refill_interval'),
    refillAmount: integer('refill_amount'),
    lastRefillAt: timestamp('last_refill_at', { withTimezone: true }),
    enabled: boolean('enabled').notNull().default(true),
    rateLimitEnabled: boolean('rate_limit_enabled').notNull().default(false),
    rateLimitTimeWindow: integer('rate_limit_time_window'),
    rateLimitMax: integer('rate_limit_max'),
    requestCount: integer('request_count').notNull().default(0),
    remaining: integer('remaining'),
    lastRequest: timestamp('last_request', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    permissions: text('permissions'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('api_key_user_idx').on(t.userId),
    uniqueIndex('api_key_key_idx').on(t.key),
  ],
);

/** better-auth `deviceAuthorization` plugin table — CLI device flow. */
export const deviceCode = pgTable(
  'device_code',
  {
    id: text('id').primaryKey(),
    deviceCode: text('device_code').notNull(),
    userCode: text('user_code').notNull(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    status: text('status').notNull().default('pending'),
    lastPolledAt: timestamp('last_polled_at', { withTimezone: true }),
    pollingInterval: integer('polling_interval').notNull().default(5),
    clientId: text('client_id'),
    scope: text('scope'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('device_code_device_idx').on(t.deviceCode),
    uniqueIndex('device_code_user_code_idx').on(t.userCode),
  ],
);

/** Magic link tokens — managed by the `magicLink` plugin via the verification table,
 *  but we keep a dedicated table for issuance auditing (optional, denormalised). */
export const magicLinkLog = pgTable(
  'magic_link_log',
  {
    id: text('id').primaryKey(),
    email: text('email').notNull(),
    requestedIp: text('requested_ip'),
    requestedUa: text('requested_ua'),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('magic_link_log_email_idx').on(t.email)],
);
