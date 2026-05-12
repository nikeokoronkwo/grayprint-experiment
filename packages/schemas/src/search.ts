import { z } from 'zod';
import { framework, pricingModel, templateKind } from './primitives.js';
import { templateCard } from './template.js';

export const searchQuery = z.object({
  q: z.string().max(200).default(''),
  category: z.string().optional(),
  tag: z.string().optional(),
  kind: templateKind.optional(),
  framework: framework.optional(),
  pricing: pricingModel.optional(),
  sort: z.enum(['relevance', 'newest', 'popular']).default('relevance'),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(48).default(24),
});
export type SearchQuery = z.infer<typeof searchQuery>;

export const searchResponse = z.object({
  items: z.array(templateCard),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  perPage: z.number().int().min(1),
  facets: z
    .object({
      categories: z.array(z.object({ slug: z.string(), name: z.string(), count: z.number() })),
      tags: z.array(z.object({ slug: z.string(), name: z.string(), count: z.number() })),
      frameworks: z.array(z.object({ value: framework, count: z.number() })),
      kinds: z.array(z.object({ value: templateKind, count: z.number() })),
    })
    .optional(),
});
export type SearchResponse = z.infer<typeof searchResponse>;
