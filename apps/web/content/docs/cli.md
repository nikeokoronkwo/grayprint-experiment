---
title: The CLI
description: grayprint and create-grayprint — installation, auth, and a complete workflow.
order: 2
---

There are two CLIs in the Grayprint family, both written in TypeScript and sharing the
same auth, configuration, and registry awareness. They feel like one product.

- **`create-grayprint`** — bootstrap a new project from a template. Optimized for first
  use.
- **`grayprint`** — manage, publish, and operate. Used after the first bootstrap.

## Authentication

Both CLIs use the same better-auth instance the website uses — your account is the same
account. Sign-in is via **device auth** (no passwords). The CLI prints a code and a URL;
you approve in your browser; the CLI receives a long-lived session token.

```bash
grayprint login
```

You stay signed in across both CLIs and your account is stored at
`~/.grayprint/config.json` (mode `0600`).

```bash
grayprint whoami
grayprint logout
```

## Using `create-grayprint`

Fast bootstrap for new projects:

```bash
# Pick a template interactively
pnpm create grayprint <project-name>

# Or specify the template up front
pnpm create grayprint nuxt-marketing-starter my-site
```

What happens:

1. CLI fetches the template's manifest (slug, version, install hints, dependencies) from
   the registry — same data backing the public detail page.
2. **Ownership / access verification.** If the template is free, the CLI proceeds. If
   it's paid (Level 1) or in a private registry (Level 1), the CLI checks your
   entitlements via the registry's `/api/entitlements/check` endpoint before downloading
   the tarball.
3. CLI downloads the template, expands it, runs `pnpm install`, and optionally runs the
   template's post-install hooks.
4. You get a working project directory and a "what to do next" message.

Speed matters. `create-grayprint` is a thin entrypoint — it doesn't load the full
`grayprint` CLI; it only does what bootstrap needs.

## Using `grayprint`

The management CLI. Commands:

```bash
grayprint login | logout | whoami     # device-auth based, no passwords
grayprint init                        # set up grayprint.json in this project
grayprint publish                     # push to the registry
grayprint templates list              # query the registry
grayprint templates get <slug>        # detail (JSON)
grayprint agents create <name>        # issue an agent API key
grayprint agents list                 # list your keys
grayprint agents revoke <id>          # revoke a key
grayprint mcp                         # run the MCP server over stdio
```

Run `grayprint <command> --help` for flags.

## The end-to-end publish workflow

For an author publishing a new template:

```bash
# 1. From inside your project repo
grayprint login            # one-time per machine
grayprint init             # scaffold grayprint.json
$EDITOR grayprint.json     # fill in metadata + AI block
grayprint publish          # push to the registry

# 2. The public detail page is live immediately at
#    https://grayprint.dev/templates/<slug>

# 3. Updates: edit grayprint.json, then re-publish.
grayprint publish
```

The first publish creates a `template` row + a `templateVersion` row. Subsequent
publishes add new `templateVersion` rows; the detail page shows the latest. See
[Publishing](/docs/publishing) for the metadata shape.

## Ownership verification

Templates have an `authorId` (the user that ran `grayprint publish`). The CLI passes your
session token on every write — the server-side `requirePrincipal()` and
`principalHasScope()` checks gate publish/patch/delete to your own templates.

For AI agents, the same checks apply against an API key issued via `grayprint agents
create`. Keys are scoped (`registry:read`, `registry:write`, `mcp:call`) so you can mint a
read-only key for an agent that should only inspect the registry, or a publish-capable
key for an agent that bootstraps and ships a template end-to-end.

## Designing templates to publish

Aim for the metadata to do the explaining. The detail page is the marketing — if a human
or an agent reads it cold, can they decide whether to use it?

- **Short summary** (~1 line). It's what shows on cards and in search results.
- **Description** (~1 paragraph). The "what and why" — the AI block carries the
  structured "how".
- **AI block** (`grayprint.json` → `ai`):
  - `purpose`: one sentence on what the template optimizes for
  - `capabilities`: bullets, ~3–6 of them
  - `nonGoals`: what it deliberately doesn't do (helps agents pick the right starter)
  - `components`: if applicable, list of primitives
  - `requirements`: runtime versions, env vars, etc.
  - `installHint`: a single canonical install command
  - `examples`: short, runnable snippets that show key usage
  - `compatibility`: runtimes, frameworks, package managers
- **License**: SPDX identifier (`MIT`, `Apache-2.0`, etc.)
- **Categories + tags**: pick from existing where they fit; minted tags get a public
  `/tags/<slug>` page.

See [AI-readability spec](/docs/ai-readability) for the full shape.

## MCP for agents

`grayprint mcp` runs an MCP server over stdio that surfaces the same operations the CLI
exposes. Drop it into a Claude Desktop config or an agent runtime and the agent gets
`search_templates`, `get_template`, `list_categories`, `publish_template`. See
[MCP](/docs/mcp).
