---
title: Authoring templates
description: Designing templates that ship well — and managing the ones you've already published.
order: 3
---

This is the playbook for authors. [Publishing](/docs/publishing) covers the three-command
flow; this page covers the work _around_ that flow — designing for the detail page,
managing your published templates, and the policies that make agents pick your template
over someone else's.

## Design for the detail page

Treat the detail page as the marketing. A human or an agent should be able to read it
cold and decide.

### The shape of a great `grayprint.json`

```json
{
  "slug": "nuxt-marketing-starter",
  "title": "Nuxt Marketing Starter",
  "summary": "A premium, content-forward marketing site starter with GSAP and shadcn-vue.",
  "description": "A production-ready Nuxt 3 marketing site with a curated content model, MDC for blog posts, dynamic OG images, theming, and tasteful GSAP entrances. Includes a wired contact form, sitemap, and an opinionated typography scale.",
  "kind": "starter",
  "framework": "nuxt",
  "license": "MIT",
  "version": "0.2.0",
  "categories": ["starters"],
  "tags": ["nuxt", "tailwind", "gsap", "shadcn", "marketing"],
  "install": [
    { "packageManager": "pnpm", "command": "pnpm create grayprint nuxt-marketing-starter my-site" }
  ],
  "components": [],
  "dependencies": [],
  "ai": {
    "schemaVersion": "grayprint.ai/v1",
    "summary": "Nuxt 3 starter for marketing sites with content, motion, and SEO baked in.",
    "purpose": "Bootstrap a fast, SEO-strong marketing site without re-inventing the layout, content, or animation primitives every time.",
    "capabilities": ["blog with MDC", "animated hero", "OG image generation", "theming"],
    "nonGoals": ["e-commerce", "auth flows", "complex dashboards"],
    "installHint": "pnpm create grayprint nuxt-marketing-starter my-site",
    "compatibility": {
      "runtimes": ["node", "vercel"],
      "frameworks": ["nuxt"],
      "package_managers": ["pnpm", "npm"]
    }
  }
}
```

### Field-by-field tips

- **`slug`** — lowercase, kebab-case, immutable. Pick something memorable; it's in the
  install command.
- **`summary`** — one line, ~100 chars. This is what shows on listing cards. Lead with
  the noun.
- **`description`** — one short paragraph. Avoid restating the summary; talk about what's
  inside.
- **`kind`** — `starter`, `component`, or `workflow`. Filters depend on this.
- **`framework`** — `nuxt`, `next`, `astro`, `vue`, `react`, `svelte`, `agnostic`. Be
  specific even for cross-framework templates if there's a primary target.
- **`categories`** — pick from existing categories on `/categories`; the registry will
  reject unknown ones.
- **`tags`** — free-form, kebab-case. New tags auto-mint a `/tags/<slug>` page.
- **`install`** — one entry per package manager. The detail page's "Copy install
  command" button uses the first entry by default.
- **`components`** — list primitives (for `kind: component`). Helps agents reason about
  what they're getting.
- **`dependencies`** — runtime/dev/peer. Surfaced on the detail page; agents read this
  to plan environment setup.
- **`ai.purpose`** vs **`ai.summary`** — `summary` is for humans, `purpose` is for
  agents. They're allowed to be similar but `purpose` should answer "when should an
  agent pick this template?"
- **`ai.nonGoals`** — undersold. This is what stops an agent from misapplying your
  template. Be explicit about what you deliberately don't do.

## Managing your published templates

The dashboard at [`/dashboard/templates`](/dashboard/templates) lists every template
you've published with its current status (`draft`, `published`, `archived`) and version.

You can:

- **Edit metadata** — title, summary, description, categories, tags, AI block. Re-publish
  via `grayprint publish` from your project.
- **Bump version** — increment the `version` in `grayprint.json` and re-publish. A new
  `templateVersion` row is created; the detail page shows the latest.
- **Unpublish (archive)** — sets `status: archived`. The detail page returns 410 Gone
  and the template stops appearing in search, but historical versions stay queryable
  for entitlement checks.
- **Delete** — destructive. Removes the template and all versions. Use the dashboard
  affordance, not the API directly.

For the API surface behind the dashboard, see the source under
`apps/web/server/api/templates/`.

## Ownership and authorization

- Every template has exactly one `authorId` — the user who first ran `grayprint
  publish`. Co-authorship and ownership transfer aren't in Level 0 (see
  `docs/BACKLOG.md`).
- Write operations (`publish`, `patch`, `delete`) require a session-backed user or an
  API key scoped to `registry:write` AND owned by the template's author.
- The `requirePrincipal()` + `principalHasScope()` helpers in `apps/web/server/utils/`
  gate every write endpoint.

## Versioning policy

Use semver. `version` in `grayprint.json` is the source of truth. Suggested rules:

- **patch**: docs / metadata / non-breaking template fixes
- **minor**: new files or new opt-in features inside the template
- **major**: breaking changes (rename files, change install command, change the install
  output shape)

The CLI doesn't enforce semver — it stores whatever you put. But consumers (`pnpm create
grayprint <slug>@<version>`, agents reasoning about compatibility) parse it as semver, so
breaking it breaks them.

## Pricing model (Level 0: free only)

The schema has full pricing fields (`pricing`, `priceCents`, `polarProductId`) but Level
0 only accepts `pricing: 'free'`. Paid templates, pay-what-you-want, and creator
payouts are Level 1 — architecturally wired, not surfaced. See `docs/BACKLOG.md`.

## When something goes wrong

- `grayprint publish` fails with a 422 — your `grayprint.json` doesn't match the schema.
  The error message points at the failing field.
- `grayprint publish` fails with a 409 — you're trying to re-publish the same version.
  Bump `version` first.
- Your detail page is up but missing metadata — re-run `grayprint publish`. The first
  publish always uses the local `grayprint.json`; if it's incomplete, the page will be
  too.
