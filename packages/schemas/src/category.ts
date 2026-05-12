import { z } from 'zod';
import { cuid, isoDate, slug } from './primitives.js';

export const category = z.object({
  id: cuid,
  slug,
  name: z.string().min(1).max(64),
  description: z.string().max(280).default(''),
  icon: z.string().max(64).nullable().default(null),
  parentId: cuid.nullable().default(null),
  order: z.number().int().nonnegative().default(0),
  createdAt: isoDate,
  updatedAt: isoDate,
});
export type Category = z.infer<typeof category>;

export const categoryInput = category.pick({
  slug: true,
  name: true,
  description: true,
  icon: true,
  parentId: true,
  order: true,
});
export type CategoryInput = z.infer<typeof categoryInput>;
