import { z } from 'zod';
import { cuid, isoDate, url } from './primitives.js';

export const userRole = z.enum(['user', 'creator', 'admin']);
export type UserRole = z.infer<typeof userRole>;

export const user = z.object({
  id: cuid,
  email: z.string().email(),
  name: z.string().min(1).max(64).nullable().default(null),
  handle: z
    .string()
    .min(2)
    .max(32)
    .regex(/^[a-z0-9_-]+$/i)
    .nullable()
    .default(null),
  avatarUrl: url.nullable().default(null),
  bio: z.string().max(280).nullable().default(null),
  website: url.nullable().default(null),
  role: userRole.default('user'),
  emailVerified: z.boolean().default(false),
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type User = z.infer<typeof user>;

export const publicUser = user.pick({
  id: true,
  handle: true,
  name: true,
  avatarUrl: true,
  bio: true,
  website: true,
});
export type PublicUser = z.infer<typeof publicUser>;
