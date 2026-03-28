import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import type {
  users,
  sessions,
  accounts,
  verifications,
  templates,
  templateVersions,
  registryItems,
  purchases,
  organizations,
  orgMembers,
  reviews,
  collections,
  templateStars,
} from './schema'

export * from './schema'

export {
  createInsertSchema,
  createSelectSchema,
} from 'drizzle-zod'

export type SelectUser = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>

export type SelectSession = InferSelectModel<typeof sessions>
export type InsertSession = InferInsertModel<typeof sessions>

export type SelectAccount = InferSelectModel<typeof accounts>
export type InsertAccount = InferInsertModel<typeof accounts>

export type SelectVerification = InferSelectModel<typeof verifications>
export type InsertVerification = InferInsertModel<typeof verifications>

export type SelectTemplate = InferSelectModel<typeof templates>
export type InsertTemplate = InferInsertModel<typeof templates>

export type SelectTemplateVersion = InferSelectModel<typeof templateVersions>
export type InsertTemplateVersion = InferInsertModel<typeof templateVersions>

export type SelectRegistryItem = InferSelectModel<typeof registryItems>
export type InsertRegistryItem = InferInsertModel<typeof registryItems>

export type SelectPurchase = InferSelectModel<typeof purchases>
export type InsertPurchase = InferInsertModel<typeof purchases>

export type SelectOrganization = InferSelectModel<typeof organizations>
export type InsertOrganization = InferInsertModel<typeof organizations>

export type SelectOrgMember = InferSelectModel<typeof orgMembers>
export type InsertOrgMember = InferInsertModel<typeof orgMembers>

export type SelectReview = InferSelectModel<typeof reviews>
export type InsertReview = InferInsertModel<typeof reviews>

export type SelectCollection = InferSelectModel<typeof collections>
export type InsertCollection = InferInsertModel<typeof collections>

export type SelectTemplateStar = InferSelectModel<typeof templateStars>
export type InsertTemplateStar = InferInsertModel<typeof templateStars>

export function createDb(connectionString: string) {
  const client = postgres(connectionString)
  return drizzle(client, { schema })
}

export type Db = ReturnType<typeof createDb>
