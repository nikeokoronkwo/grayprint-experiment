export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const site = config.public.siteUrl;
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  setHeader(event, 'Cache-Control', 'public, max-age=300');

  return `# Grayprint

> A dynamic template marketplace where templates are content — discoverable,
> AI-readable, and built for both humans and agents.

## Surfaces
- ${site}/templates — marketplace index (filterable by kind, framework, category, tag)
- ${site}/templates/<slug> — public template detail with full AI-readability block
- ${site}/search?q=<query> — full-text search across titles, summaries, and content
- ${site}/categories, ${site}/categories/<slug>
- ${site}/tags/<slug>

## Machine endpoints
- ${site}/llms-full.txt — full catalogue with metadata
- ${site}/api/templates — JSON list (?q, ?kind, ?framework, ?category, ?tag, ?page, ?perPage)
- ${site}/api/templates/<slug> — JSON detail
- ${site}/api/categories — JSON list
- ${site}/api/search?q=<query> — JSON search
- ${site}/api/mcp — authenticated Streamable HTTP MCP transport (Bearer <agent-api-key>)

## AI-readability
Every public template page embeds:
- <script type="application/ld+json"> — Schema.org SoftwareSourceCode
- <script type="application/grayprint+json"> — schemaVersion: "grayprint.ai/v1"

## Auth for agents
Issue an API key at ${site}/dashboard/agents. Include as Authorization: Bearer <key>.
`;
});
