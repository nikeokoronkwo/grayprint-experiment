import { checkEntitlement } from '~~/server/utils/entitlements';
import { getPrincipal } from '~~/server/utils/auth';
import type { EntitlementKind } from '@grayprint/schemas';

export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const kind = String(q.kind ?? '') as EntitlementKind;
  const resource = String(q.resource ?? '');
  if (!kind || !resource) {
    throw createError({ statusCode: 400, statusMessage: 'kind and resource required' });
  }
  const principal = await getPrincipal(event);
  return checkEntitlement(principal?.userId ?? null, kind, resource);
});
