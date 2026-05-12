---
title: MCP server
description: Streamable HTTP plus stdio. Authenticated via agent API keys.
order: 3
---

Grayprint ships an authenticated Model Context Protocol server. Two transports are supported.

## stdio

For local agents and editor integrations:

```bash
grayprint mcp
```

Then configure your client (Claude Desktop, etc.) to spawn that command.

## Streamable HTTP

The marketplace exposes `/api/mcp`. Authenticate with a bearer token from an agent API key
(create one in `/dashboard/agents`).

## Tools

- `search_templates` — full-text + filtered search
- `get_template` — fetch the full public record by slug
- `list_categories` — enumerate categories
- `publish_template` — auth-gated publish (`registry:write` scope required)

All shapes are defined by `@grayprint/schemas` — the same Zod contracts the website uses.
