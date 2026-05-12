---
name: grayprint-mcp-tools
description: Use the Grayprint MCP server to search, inspect, and publish templates from an agent loop.
version: 1
---

# Grayprint MCP

## When to use this skill

When the agent has access to the Grayprint MCP server (either spawned over stdio or via the
authenticated HTTP transport at `/api/mcp`) and needs to interact with the marketplace
programmatically.

## Configuring Claude Desktop (stdio)

```jsonc
// claude_desktop_config.json
{
  "mcpServers": {
    "grayprint": {
      "command": "grayprint",
      "args": ["mcp"],
      "env": {
        "GRAYPRINT_TOKEN": "gp_…"  // optional; required for publish
      }
    }
  }
}
```

Use `grayprint login` first to seed `~/.grayprint/config.json` so the server picks up your
account automatically (the explicit env override is optional).

## HTTP transport

```
POST https://grayprint.dev/api/mcp
Authorization: Bearer <agent-api-key>
```

Issue keys at `https://grayprint.dev/dashboard/agents`. Public read tools work with any
valid key; `publish_template` requires `registry:write` scope.

## Available tools

| Tool | Purpose | Required scope |
|---|---|---|
| `search_templates` | Full-text + filtered search (q, kind, framework, category, tag) | none |
| `get_template` | Full public record for one template by slug | none |
| `list_categories` | All categories | none |
| `publish_template` | Publish a draft you own | `registry:write` |

All outputs are JSON. Schemas live in `@grayprint/schemas` and are stable across the v1 AI surface (`grayprint.ai/v1`).
