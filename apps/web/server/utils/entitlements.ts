import { and, eq, gte, isNull, lte, or } from 'drizzle-orm';
import type { EntitlementCheck, EntitlementKind } from '@grayprint/schemas';
import { useDb } from './db.js';
import { entitlement } from '../db/schema/entitlements.js';
import { template } from '../db/schema/registry.js';

/**
 * Check whether `userId` may access `resource` under `kind`. Free templates are open;
 * paid templates check for a matching entitlement granted by Polar.
 */
export async function checkEntitlement(
  userId: string | null,
  kind: EntitlementKind,
  resource: string,
): Promise<EntitlementCheck> {
  const db = useDb();

  if (kind === 'template_access') {
    const [t] = await db
      .select({ pricing: template.pricing, authorId: template.authorId })
      .from(template)
      .where(eq(template.slug, resource))
      .limit(1);
    if (!t) return { granted: false, reason: 'template_not_found' };
    if (t.pricing === 'free') return { granted: true, reason: 'free_template' };
    if (userId && t.authorId === userId) return { granted: true, reason: 'author' };
  }

  if (!userId) return { granted: false, reason: 'unauthenticated' };

  const now = new Date();
  const rows = await db
    .select()
    .from(entitlement)
    .where(
      and(
        eq(entitlement.userId, userId),
        eq(entitlement.kind, kind),
        eq(entitlement.resource, resource),
        lte(entitlement.validFrom, now),
        or(isNull(entitlement.validUntil), gte(entitlement.validUntil, now)),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (row) {
    return {
      granted: true,
      reason: `entitlement:${row.source}`,
      via: {
        id: row.id,
        userId: row.userId,
        kind: row.kind as EntitlementKind,
        resource: row.resource,
        permissions: row.permissions ?? ['view'],
        source: row.source as 'polar' | 'admin' | 'free',
        polarOrderId: row.polarOrderId,
        polarSubscriptionId: row.polarSubscriptionId,
        validFrom: row.validFrom.toISOString(),
        validUntil: row.validUntil ? row.validUntil.toISOString() : null,
        createdAt: row.createdAt.toISOString(),
      },
    };
  }

  return { granted: false, reason: 'no_entitlement' };
}

/**
 * Translate a Polar webhook into entitlement state. Level 0 stub — Level 1 will map
 * specific product ids to template / registry resources. For now we record orders so
 * the audit trail is intact and dashboards can surface them.
 */
export async function reconcileEntitlementsFromPolar(_payload: unknown) {
  // Intentionally minimal at Level 0. Hook point for Level 1 commerce.
  return;
}
