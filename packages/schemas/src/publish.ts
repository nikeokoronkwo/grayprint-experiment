import { z } from 'zod';
import { semver } from './primitives.js';

export const publishRequest = z.object({
  version: semver.optional(),
  /** Optional changelog entry; rendered in the docs/changelog feed. */
  changelog: z.string().max(2000).optional(),
});
export type PublishRequest = z.infer<typeof publishRequest>;

export const publishResult = z.object({
  ok: z.literal(true),
  slug: z.string(),
  version: semver,
  publishedAt: z.string(),
  url: z.string().url(),
});
export type PublishResult = z.infer<typeof publishResult>;
