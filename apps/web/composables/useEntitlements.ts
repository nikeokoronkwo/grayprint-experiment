import type { EntitlementCheck, EntitlementKind } from '@grayprint/schemas';

/**
 * Level-0 stub. Returns "granted" for free resources and "ungranted: unauthenticated"
 * otherwise. Level 1 swaps in the real reconcile-against-Polar logic — same shape,
 * same hook, so callers don't change.
 */
export function useEntitlements() {
  async function check(kind: EntitlementKind, resource: string): Promise<EntitlementCheck> {
    return await $fetch('/api/entitlements/check', {
      method: 'GET',
      query: { kind, resource },
    }).catch(() => ({ granted: false, reason: 'check_failed' }));
  }
  return { check };
}
