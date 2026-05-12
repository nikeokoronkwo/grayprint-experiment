---
name: grayprint-ai-readability
description: How Grayprint exposes machine-readable metadata for every template — the application/grayprint+json contract.
version: 1
---

# Grayprint AI-readability spec

Every public Grayprint template page emits two machine-readable blocks:

1. **JSON-LD** (`<script type="application/ld+json">`) — standard Schema.org `SoftwareSourceCode` for crawlers and SEO. Keep it for compat; don't extend it for agent needs.

2. **Grayprint AI block** (`<script type="application/grayprint+json">`) — the canonical agent surface. Versioned.

## Shape (`grayprint.ai/v1`)

```jsonc
{
  "schemaVersion": "grayprint.ai/v1",
  "slug": "nuxt-marketing-starter",
  "url": "https://grayprint.dev/templates/nuxt-marketing-starter",

  "summary": "One sentence (≤ 280 chars). What this template is.",
  "purpose": "One paragraph (≤ 1000 chars). What it's for — the problem it solves.",

  "capabilities": ["concrete capability 1", "concrete capability 2"],
  "nonGoals": ["thing this explicitly does NOT do"],

  "components": [
    { "name": "HeroBlueprint", "kind": "component", "path": "components/HeroBlueprint.vue", "description": "..." }
  ],

  "requirements": [
    { "name": "node", "version": ">=22", "kind": "runtime" },
    { "name": "@nuxthub/core", "kind": "package" }
  ],

  "installHint": "pnpm create grayprint nuxt-marketing-starter my-site",

  "examples": [
    { "title": "Add a blog page", "body": "…", "language": "vue" }
  ],

  "compatibility": {
    "runtimes": ["node", "vercel"],
    "frameworks": ["nuxt"],
    "package_managers": ["pnpm", "npm"]
  }
}
```

## How agents should use this

- **First reach**: call `get_template` over MCP, or `GET /api/templates/<slug>`, and read the `ai` field directly. Faster than HTML parsing and always current.
- **Discovery**: call `search_templates`, then enrich the most promising results with `get_template` for the full `ai` block.
- **Acting**: `installHint` is the canonical shell command. Treat it as authoritative.

## Beyond pages

- `/llms.txt` — concise project map for context windows.
- `/llms-full.txt` — full catalogue with each template's `ai` core fields.
- `/sitemap.xml` — every template URL.

## Stability promise

`grayprint.ai/v1` is stable. Field additions are non-breaking. A breaking change increments the `schemaVersion`.
