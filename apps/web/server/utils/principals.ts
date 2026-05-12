import type { H3Event } from 'h3';
import { getPrincipal } from './auth';

/** Require an authenticated principal (user OR API key); throw 401 otherwise. */
export async function requirePrincipal(event: H3Event) {
  const principal = await getPrincipal(event);
  if (!principal) {
    throw createError({ statusCode: 401, statusMessage: 'authentication required' });
  }
  return principal;
}

/** Require a session-backed user (no API keys). Used for /dashboard etc. */
export async function requireUser(event: H3Event) {
  const principal = await getPrincipal(event);
  if (!principal || principal.kind !== 'user') {
    throw createError({ statusCode: 401, statusMessage: 'sign-in required' });
  }
  return principal;
}

export type ApiKeyScope = 'registry:read' | 'registry:write' | 'mcp:call' | 'agent:identify';

/** For API-key callers, check that a specific scope is granted. */
export function principalHasScope(
  principal: Awaited<ReturnType<typeof getPrincipal>>,
  scope: ApiKeyScope,
) {
  if (!principal) return false;
  if (principal.kind === 'user') return true; // session user has full scope
  const permissions = principal.permissions;
  if (!permissions || typeof permissions !== 'object') return false;
  const [domain, action] = scope.split(':') as ['registry' | 'mcp' | 'agent', string];
  const actions = (permissions as Record<string, string[]>)[domain];
  return Array.isArray(actions) && (actions.includes(action) || actions.includes('*'));
}
