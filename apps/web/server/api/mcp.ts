import { createHttpHandler } from '@grayprint/mcp/http';
import { getPrincipal } from '~~/server/utils/auth';

/**
 * Authenticated Streamable HTTP MCP transport. Validates the bearer via better-auth
 * before delegating to @grayprint/mcp/http (Node-style req/res transport).
 *
 * The MCP server instance is built once on first use; tools accept the request's
 * bearer dynamically through the SDK's per-request auth header, so a single server
 * can multiplex agents safely.
 */
const handlerPromise = createHttpHandler();

export default defineEventHandler(async (event) => {
  const principal = await getPrincipal(event);
  if (!principal) {
    throw createError({ statusCode: 401, statusMessage: 'authentication required' });
  }
  const handler = await handlerPromise;
  const body = await readBody(event).catch(() => undefined);
  await handler(event.node.req, event.node.res, body);
});
