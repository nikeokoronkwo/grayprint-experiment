import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { users } from './users'

export const orgPlanEnum = pgEnum('org_plan', ['free', 'pro', 'enterprise'])

export const orgMemberRoleEnum = pgEnum('org_member_role', ['admin', 'editor', 'viewer'])

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  plan: orgPlanEnum('plan').default('free').notNull(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const orgMembers = pgTable(
  'org_members',
  {
    id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orgId: uuid('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: orgMemberRoleEnum('role').default('viewer').notNull(),
    invitedAt: timestamp('invited_at').defaultNow().notNull(),
    joinedAt: timestamp('joined_at'),
  },
  (table) => [
    uniqueIndex('org_members_org_user_unique').on(table.orgId, table.userId),
  ]
)
