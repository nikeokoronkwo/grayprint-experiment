---
title: What is Grayprint?
description: A dynamic template marketplace where templates are content — discoverable, AI-readable, and built for both humans and agents.
order: 0
---

Grayprint is a marketplace for project starters, drop-in components, and agent-ready
workflows. It treats templates as **content**: every public template has its own page that's
SEO-indexed, machine-readable, and addressable by both humans and AI agents.

## Why Grayprint

Most template galleries are a list of links. Grayprint is built around three ideas that
existing solutions don't get right:

- **Templates are discoverable content.** Each public template gets a curated detail page
  with structured metadata, install instructions, and dependency info. Search engines
  index it; agents and LLMs parse it. The page itself does the marketing.
- **AI agents are first-class users.** Every detail page embeds an
  `application/grayprint+json` block (schema version `grayprint.ai/v1`) and a Schema.org
  `SoftwareSourceCode` JSON-LD block. There's a public `/llms.txt`, a `/llms-full.txt`
  catalogue, and an authenticated MCP server at `/api/mcp`. Agents can search, inspect,
  and publish without scraping HTML.
- **One product, two surfaces.** The website and the CLI share one identity layer
  (better-auth) and one registry. Sign in once; your CLI uses the same account.

## How it compares

- **vs. GitHub template repos**: a starter repo gives you a clone command. Grayprint gives
  you a curated, searchable catalog with consistent metadata, AI-readable blocks, and a
  dedicated CLI for finding and using templates programmatically.
- **vs. component galleries (shadcn-vue, etc.)**: those host components for a single
  framework. Grayprint hosts full starters, single components, and agent workflows
  side-by-side, each with the same structured metadata.
- **vs. boilerplate marketplaces**: most are paywalled PDFs of zip files. Grayprint is
  open-by-default, agent-readable, and architected so creator monetization can grow on
  top without breaking the discovery surface.

## What's in Level 0

- Public marketplace at [`/templates`](/templates) with filtering, search, categories, tags
- A canonical detail page per template with structured AI metadata
- Two CLIs: `create-grayprint` (bootstrap) and `grayprint` (manage + publish)
- Authenticated MCP server for agents at `/api/mcp`
- `/llms.txt` + `/llms-full.txt` for LLM context

What's not in Level 0 yet (and is intentionally architected, not built): paid templates,
private registries, creator payouts, and template ownership transfer. See the project
backlog under `docs/BACKLOG.md` in the repo.

## Where to go next

- [Use the marketplace](/docs/marketplace) — find and install templates
- [Programmatic usage](/docs/cli) — the CLI workflow
- [Publish a template](/docs/publishing) — get your template listed
- [AI-readability spec](/docs/ai-readability) — what agents see
- [MCP server](/docs/mcp) — let an agent drive the registry
