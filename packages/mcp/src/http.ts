import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { buildServer, type GrayprintMcpOptions } from './server.js';

/**
 * Build a Streamable HTTP MCP transport handler. Mount it from your server framework
 * (Nuxt/Nitro, Express, Hono, etc.) — the handler accepts WHATWG Request and returns
 * Response.
 *
 * Auth: the handler reads `Authorization: Bearer <key>` from the request and passes
 * it through to the underlying SDK calls. Validate the key against your registry's
 * `/api/agents/me` endpoint before invoking the transport (typically in a middleware).
 *
 * Example Nuxt route (apps/web/server/api/mcp.ts):
 *
 *   import { createHttpHandler } from '@grayprint/mcp/http';
 *   const handler = createHttpHandler();
 *   export default defineEventHandler((event) => handler(toWebRequest(event)));
 */
export function createHttpHandler(opts: GrayprintMcpOptions = {}) {
  return async (request: Request): Promise<Response> => {
    const auth = request.headers.get('authorization') ?? undefined;
    const token = auth?.replace(/^Bearer\s+/i, '');
    const server = buildServer({ ...opts, token });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
    });
    await server.connect(transport);
    return transport.handleRequest(request);
  };
}
