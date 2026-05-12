import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { buildServer, type GrayprintMcpOptions } from './server.js';

export type McpHttpHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  parsedBody?: unknown,
) => Promise<void>;

/**
 * Build a Streamable HTTP MCP transport handler.
 *
 * `StreamableHTTPServerTransport` is Node http-shaped (req/res), so this handler is
 * meant to be mounted via h3/Nitro's `event.node.req`/`event.node.res`, Express, or
 * any other Node http framework. Server framework adapters should also accept the
 * pre-parsed JSON body as `parsedBody` so the transport doesn't re-read the stream.
 *
 * Example Nuxt route (apps/web/server/api/mcp.ts):
 *
 *   import { createHttpHandler } from '@grayprint/mcp/http';
 *   const handlerPromise = createHttpHandler();
 *   export default defineEventHandler(async (event) => {
 *     const handler = await handlerPromise;
 *     const body = await readBody(event).catch(() => undefined);
 *     await handler(event.node.req, event.node.res, body);
 *   });
 */
export async function createHttpHandler(opts: GrayprintMcpOptions = {}): Promise<McpHttpHandler> {
  const server = buildServer(opts);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
  await server.connect(transport);

  return (req, res, parsedBody) => transport.handleRequest(req, res, parsedBody);
}
