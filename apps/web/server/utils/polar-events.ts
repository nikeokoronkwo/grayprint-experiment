import { sql } from 'drizzle-orm';
import { useDb } from './db.js';
import { polarEvent } from '../db/schema/entitlements.js';
import { reconcileEntitlementsFromPolar } from './entitlements.js';

/**
 * Persist a Polar webhook payload idempotently. Webhooks may be retried by Polar — we
 * key on the payload `id` so a duplicate delivery is a no-op.
 */
export async function recordPolarEvent(payload: unknown) {
  const db = useDb();
  const p = payload as { id?: string; type?: string; data?: { id?: string } };
  const id = p.id ?? p.data?.id;
  const type = p.type ?? 'unknown';
  if (!id) return; // can't deduplicate without an id; drop on the floor

  await db
    .insert(polarEvent)
    .values({ id, type, payload: payload as object })
    .onConflictDoNothing({ target: polarEvent.id });

  await reconcileEntitlementsFromPolar(payload);
}
