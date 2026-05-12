import { z } from 'zod';
import { cuid, isoDate } from './primitives.js';

/**
 * Entitlement model — wired but not heavily exposed at Level 0. Level 1 will use this
 * to gate private registries and paid templates. We define it now so Polar webhooks
 * and the future seller flow drop straight in.
 */
export const entitlementKind = z.enum([
  'template_access',
  'registry_access',
  'creator_subscription',
]);
export type EntitlementKind = z.infer<typeof entitlementKind>;

export const entitlement = z.object({
  id: cuid,
  userId: cuid,
  kind: entitlementKind,
  /** Polymorphic resource — e.g. a template slug, a registry id, a creator handle. */
  resource: z.string().min(1).max(128),
  /** Granular permissions: 'view' | 'download' | 'fork' | 'admin'. */
  permissions: z.array(z.enum(['view', 'download', 'fork', 'admin'])).default(['view']),
  source: z.enum(['polar', 'admin', 'free']).default('free'),
  polarOrderId: z.string().max(128).nullable().default(null),
  polarSubscriptionId: z.string().max(128).nullable().default(null),
  validFrom: isoDate,
  validUntil: isoDate.nullable().default(null),
  createdAt: isoDate,
});
export type Entitlement = z.infer<typeof entitlement>;

export const entitlementCheck = z.object({
  granted: z.boolean(),
  reason: z.string().optional(),
  via: entitlement.optional(),
});
export type EntitlementCheck = z.infer<typeof entitlementCheck>;
