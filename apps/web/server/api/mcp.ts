import { createHttpHandler } from '@grayprint/mcp/http';
import { getPrincipal } from '~/server/utils/auth';

/**
 * Authenticated Streamable HTTP MCP transport. Validates the bearer via better-auth
 * before delegating to the @grayprint/mcp transport.
 */
const handler = createHttpHandler();

export default defineEventHandler(async (event) => {
  const principal = await getPrincipal(event);
  if (!principal) {
    throw createError({ statusCode: 401, statusMessage: 'authentication required' });
  }
  return handler(toWebRequest(event));
});
