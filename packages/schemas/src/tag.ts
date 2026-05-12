import { z } from 'zod';
import { cuid, isoDate, slug } from './primitives.js';

export const tag = z.object({
  id: cuid,
  slug,
  name: z.string().min(1).max(48),
  createdAt: isoDate,
});
export type Tag = z.infer<typeof tag>;

export const tagInput = tag.pick({ slug: true, name: true });
export type TagInput = z.infer<typeof tagInput>;
