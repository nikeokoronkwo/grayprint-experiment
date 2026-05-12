import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getActiveAccount } from '@grayprint/cli-core';
import { buildServer } from './server.js';

/**
 * Run the Grayprint MCP server over stdio — for `grayprint mcp`, Claude Desktop,
 * Cursor, and any other client that spawns a child process.
 *
 * Auth: uses the active CLI account's token, OR an explicit `GRAYPRINT_TOKEN` env.
 * Anonymous calls work for public read tools; publish requires a token with
 * `registry:write` scope.
 */
export async function runStdioMcp() {
  const active = getActiveAccount();
  const token = process.env.GRAYPRINT_TOKEN ?? active?.account.token;
  const apiUrl = process.env.GRAYPRINT_API_URL ?? active?.host;

  const server = buildServer({ apiUrl, token });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Run when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runStdioMcp().catch((err) => {
    console.error('[grayprint-mcp]', err);
    process.exit(1);
  });
}
