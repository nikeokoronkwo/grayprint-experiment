import { getPrincipal } from '~/server/utils/auth';

/** Used by the MCP server (and SDK) to verify a bearer token and resolve the principal. */
export default defineEventHandler(async (event) => {
  const principal = await getPrincipal(event);
  if (!principal) {
    throw createError({ statusCode: 401, statusMessage: 'unauthenticated' });
  }
  return {
    userId: principal.userId,
    kind: principal.kind,
    permissions: principal.kind === 'apiKey' ? principal.permissions : undefined,
  };
});
