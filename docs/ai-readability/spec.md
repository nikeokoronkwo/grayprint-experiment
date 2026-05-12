# Grayprint AI-readability — v1 spec (`grayprint.ai/v1`)

Authoritative spec for the `application/grayprint+json` block embedded on every public template
page and returned by the registry API and MCP `get_template` tool.

The shape is defined by `@grayprint/schemas/ai` (`aiMetadata`). This document mirrors it for human readers.

## Locations

- HTML: `<script type="application/grayprint+json">{...}</script>` on each `/templates/<slug>` page.
- API: `ai` field on `GET /api/templates/<slug>`.
- MCP: returned by the `get_template` tool.
- llms-full.txt: condensed prose form for context windows.

## Fields

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `schemaVersion` | `"grayprint.ai/v1"` | ✓ | Always present; bumped on breaking changes. |
| `summary` | string ≤ 280 | ✓ | One sentence. |
| `purpose` | string ≤ 1000 | ✓ | One paragraph. The "why" for agents. |
| `capabilities` | string[] | | Up to 32. Concrete behaviours. |
| `nonGoals` | string[] | | Up to 16. What this template explicitly does *not* try to do. |
| `components` | object[] | | Up to 64. Composable parts (name, kind, path, description). |
| `requirements` | object[] | | Runtime/package/service deps the consumer must already have. |
| `installHint` | string ≤ 600 | | Plain shell or prose — used verbatim by agents. |
| `examples` | object[] | | Up to 8. `title`, `body`, optional `language`. |
| `compatibility.runtimes` | string[] | | e.g. `["node", "vercel"]`. |
| `compatibility.frameworks` | string[] | | e.g. `["nuxt"]`. |
| `compatibility.package_managers` | string[] | | `pnpm`, `npm`, `yarn`, `bun`, `deno`. |

## Versioning

- Additive changes (new optional fields) **never** bump `schemaVersion`.
- Removal, rename, or type changes bump to `grayprint.ai/v2`.
- Old versions remain readable indefinitely on existing pages.

## Why we ship our own spec on top of Schema.org JSON-LD

Schema.org is great for crawlers but doesn't model template-specific concerns like agent
capabilities, install hints, or runtime compatibility at the granularity we need. We keep
JSON-LD for SEO and add `application/grayprint+json` for agents.
