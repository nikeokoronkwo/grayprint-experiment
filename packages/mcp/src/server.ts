import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { GrayprintClient } from '@grayprint/sdk';

export interface GrayprintMcpOptions {
  apiUrl?: string;
  token?: string;
  name?: string;
  version?: string;
}

/**
 * Build a configured MCP server with Grayprint's tools. Caller wires the transport.
 *
 * Tools:
 *   - search_templates: full-text + filtered search
 *   - get_template: fetch a public template by slug
 *   - list_categories: enumerate categories
 *   - publish_template: auth-gated publish (registry:write scope)
 */
export function buildServer(opts: GrayprintMcpOptions = {}) {
  const server = new McpServer({
    name: opts.name ?? 'grayprint',
    version: opts.version ?? '0.0.0',
  });
  const sdk = new GrayprintClient({ apiUrl: opts.apiUrl, token: opts.token });

  server.tool(
    'search_templates',
    'Full-text and filtered search across published templates. Returns up to 24 cards.',
    {
      q: z.string().default('').describe('Search query (optional).'),
      kind: z.enum(['app', 'component', 'starter', 'snippet', 'theme', 'workflow']).optional(),
      framework: z
        .enum(['nuxt', 'next', 'sveltekit', 'remix', 'astro', 'vue', 'react', 'svelte', 'solid', 'angular', 'agnostic'])
        .optional(),
      category: z.string().optional(),
      tag: z.string().optional(),
      perPage: z.number().int().min(1).max(48).default(24),
    },
    async (args) => {
      const res = await sdk.search(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
      };
    },
  );

  server.tool(
    'get_template',
    'Fetch the full public record for a single template by slug — includes the AI-readability block.',
    { slug: z.string() },
    async ({ slug }) => {
      const t = await sdk.getTemplate(slug);
      return { content: [{ type: 'text', text: JSON.stringify(t, null, 2) }] };
    },
  );

  server.tool(
    'list_categories',
    'List all template categories.',
    {},
    async () => {
      const cats = await sdk.listCategories();
      return { content: [{ type: 'text', text: JSON.stringify(cats, null, 2) }] };
    },
  );

  server.tool(
    'publish_template',
    'Publish a template the caller owns. Requires registry:write scope on the API key. The template draft must already exist.',
    {
      slug: z.string(),
      version: z.string().optional(),
      changelog: z.string().max(2000).optional(),
    },
    async (args) => {
      const result = await sdk.publishTemplate(args.slug, {
        version: args.version,
        changelog: args.changelog,
      });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  return server;
}
