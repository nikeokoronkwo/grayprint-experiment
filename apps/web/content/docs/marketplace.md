---
title: Using the marketplace
description: Find templates, understand the detail page, and install with one command.
order: 1
---

The marketplace is the human-facing surface. Every public template is also reachable from
the same data via the CLI or MCP — see [Programmatic usage](/docs/cli).

## Browsing

- **[/templates](/templates)** — the full marketplace index. Filter by:
  - **kind**: `starter`, `component`, `workflow`
  - **framework**: `nuxt`, `next`, `astro`, `vue`, `react`, `svelte`, `agnostic`
  - **category** (e.g. `starters`, `components`, `workflows`)
  - **tag** (free-form: `auth`, `dashboard`, `marketing`, etc.)
- **[/categories](/categories)** — browse by curated category
- **[/tags/&lt;slug&gt;](/templates)** — every tag has its own listing page
- **[/search?q=&lt;query&gt;](/search)** — Postgres full-text search across title, summary,
  and description. Searches are weighted: title `A`, summary `B`, description `C`.

## The detail page

Each template at `/templates/<slug>` has:

- **Title, summary, description** — what it is and why.
- **Author, version, license, last-published-at**.
- **Categories + tags** — clickable, take you to filtered listings.
- **Install** — a one-line install command per package manager. The "Copy install
  command" button puts it on your clipboard.
- **Components** — for component templates, a list of the primitives it includes.
- **AI metadata block** — the same structured data the agents read (purpose,
  capabilities, non-goals, components, requirements, install hint, examples,
  compatibility). It's visible on the page so humans can sanity-check what agents see.
- **Embedded structured data** — two `<script>` blocks for crawlers and agents:
  - `application/ld+json` Schema.org `SoftwareSourceCode`
  - `application/grayprint+json` (schema version `grayprint.ai/v1`)

## Installing a template

Most templates list a `pnpm create grayprint <slug>` command on the detail page. That
runs the `create-grayprint` bootstrap CLI — it fetches the template tarball from the
registry, unpacks it, and runs any setup hooks. See
[Programmatic usage](/docs/cli) for the full flow.

For drop-in component templates, the detail page shows the right `grayprint add` command
to merge files into an existing project (Level 0: a manual copy step; future levels:
automated diff-and-merge).

## What's free in Level 0

Every published template is **free** in Level 0. The pricing model is wired into the
schema (`pricing: 'free' | 'paid' | 'pay_what_you_want'`, `priceCents`, `polarProductId`)
but creator monetization isn't surfaced yet — that's Level 1.

## When something's wrong

Templates are user-published. If a template page is incorrect, the author can republish
from the CLI; that propagates to the detail page on the next request. If a template
shouldn't be in the marketplace at all (broken, abandoned, abusive), the registry
exposes a private API for moderation — currently admin-only.
