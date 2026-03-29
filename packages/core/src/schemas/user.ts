import { z } from 'zod'

export const UserRoleSchema = z.enum(['user', 'creator', 'admin'])

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  githubUsername: z.string().optional(),
  role: UserRoleSchema,
  createdAt: z.date(),
})

export const OrganizationPlanSchema = z.enum(['free', 'pro', 'enterprise'])

export const OrganizationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
  plan: OrganizationPlanSchema,
  ownerId: z.string(),
  createdAt: z.date(),
})

export type UserRole = z.infer<typeof UserRoleSchema>
export type User = z.infer<typeof UserSchema>
export type OrganizationPlan = z.infer<typeof OrganizationPlanSchema>
export type Organization = z.infer<typeof OrganizationSchema>
