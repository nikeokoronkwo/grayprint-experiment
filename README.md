# Grayprint

> Dynamic template marketplace and template-as-content engine. SEO-first, AI-native, premium.

Grayprint is a monorepo containing the marketplace web app, a shared domain vocabulary, two CLIs, and an authenticated MCP server. Public template pages double as discoverable content — for humans, search engines, and AI agents.

```
apps/web              Nuxt full-stack app — marketplace, registry API, MCP HTTP transport
packages/schemas      Zod schemas + TS types, the shared domain vocabulary
packages/ui           Tailwind preset, design tokens, GSAP utilities, logo SVGs
packages/sdk          Typed registry client (used by CLIs and the MCP server)
packages/cli-core     Shared CLI logic — device-auth, config, registry awareness
packages/cli          `grayprint` — management CLI
packages/create       `create-grayprint` — bootstrap CLI
packages/mcp          Authenticated MCP server (stdio + Streamable HTTP)
docs/                 Agent skill docs, AI-readability spec source
```

## Stack

| Concern | Choice |
|---|---|
| App | **Nuxt 3** + Nitro (TypeScript, SSR), typed pages |
| Portable infra | **NuxtHub v0.10+** — Postgres, blob, KV, cache; works on Vercel & Node |
| ORM | **Drizzle** on Postgres (PGLite local fallback), `tsvector` + GIN for FTS |
| Auth | **better-auth** with `magicLink`, `emailOTP`, `deviceAuthorization`, `apiKey`, `mcp` |
| Payments | **Polar.sh** as Merchant of Record via `@polar-sh/better-auth` |
| Email | **nodemailer** SMTP (free starter: Resend SMTP) |
| Design | **Tailwind** + shadcn-vue + **GSAP** (tasteful motion) |
| MCP | `@modelcontextprotocol/sdk` — stdio + Streamable HTTP |
| Monorepo | **pnpm workspaces** + **Turborepo** |

## Quickstart

```bash
pnpm install
cp .env.example .env             # fill in DATABASE_URL, BETTER_AUTH_SECRET, SMTP_*, POLAR_*
pnpm db:generate                 # Drizzle migrations
pnpm db:migrate                  # apply
pnpm db:seed                     # 1 admin, 3 categories, 12 tags, 6 templates
pnpm dev                         # http://localhost:3000
```

### Required env

- `DATABASE_URL` — any Postgres (Neon, Supabase, Vercel, local docker). Locally NuxtHub falls back to PGLite if unset.
- `BETTER_AUTH_SECRET` — any 32+ char random string.
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` — Resend SMTP is the recommended free starter (3k emails/month).
- `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_ENVIRONMENT=sandbox|production` — leave blank to disable; everything still boots.

See `.env.example` for the full list.

## Common commands

```bash
pnpm dev               # apps/web on :3000
pnpm build             # all packages + Nuxt build
pnpm typecheck         # workspace-wide tsc
pnpm lint              # biome
pnpm db:generate       # generate Drizzle migrations from schema
pnpm db:migrate        # apply migrations
pnpm db:seed           # seed development data
pnpm db:studio         # Drizzle Studio
```

## CLIs

```bash
# In a separate project:
pnpm dlx create-grayprint my-template     # interactive scaffold
pnpm add -g @grayprint/cli                # install management CLI globally
grayprint login                           # device-auth flow
grayprint init                            # write grayprint.json
grayprint publish                         # push to the registry
grayprint mcp                             # run MCP server over stdio
```

## AI surface

Every public template page emits two machine-readable blocks:

- `<script type="application/ld+json">` — Schema.org `SoftwareSourceCode` (for crawlers / search).
- `<script type="application/grayprint+json">` — canonical AI-readability shape (`grayprint.ai/v1`), versioned. The same shape is returned by the SDK and the MCP `get_template` tool.

Additional surfaces:

- `GET /llms.txt` — concise project map for context windows.
- `GET /llms-full.txt` — full marketplace catalogue with each template's AI block.
- `GET /sitemap.xml` — every URL, DB-driven.
- `POST /api/mcp` — authenticated Streamable HTTP MCP transport. `Authorization: Bearer <agent-api-key>`.

Spec: [`docs/ai-readability/spec.md`](./docs/ai-readability/spec.md). Skill docs: [`docs/skills/`](./docs/skills/).

## Identity model

- **Sessions** — magic link or email OTP, issued by better-auth.
- **Device auth** — CLI sign-in flow (RFC 8628) over `POST /api/auth/device/{code,token}`.
- **Agent API keys** — long-lived bearer tokens for AI agents and CI; scoped (`registry:read`, `registry:write`, `mcp:call`); created from `/dashboard/agents`.

The MCP HTTP transport authenticates the same `Authorization: Bearer …` header through better-auth's `apiKey` plugin.

## Payments

Polar is wired via `@polar-sh/better-auth` from day one. At Level 0 it's not heavily exposed in the UI — `/dashboard/billing` links to the Polar customer portal and a Pro upgrade flow. Entitlement types are defined in `@grayprint/schemas/entitlement`; `useEntitlements()` (composable) and `checkEntitlement()` (server) are the integration points. When Level 1 ships, paid templates and private registries gate through this layer without rearchitecting.

## What's Level 0 vs Level 1

**Level 0 (shipped):**
- Public marketplace with filtering, search, category/tag browsing
- AI-readability spec + machine-readable surfaces (`/llms.txt`, `/api/mcp`, JSON-LD + `application/grayprint+json`)
- Dual CLI (`grayprint`, `create-grayprint`)
- better-auth (magic link, OTP, device, apiKey, mcp)
- Polar wired, entitlement domain defined
- 6 seeded templates across 3 categories

**Level 1 (architected, not exposed):**
- Private registries
- Creator monetisation / paid templates
- Dub.co attribution (env-flagged; inert until `DUB_API_KEY`)
- Full Polar checkout/entitlement reconciliation

## Brand

- **Logo**: stylised G inside a blueprint grid, with a corner zing (lime → blueprint gradient).
- **Palette**: blueprint navy `#0A1330`, warm paper `#F5F2E8`, blueprint cyan `#3B82F6`, lime zing `#A3E635`, magenta spark `#EC4899` (sparingly).
- Tokens live in `packages/ui/src/tokens.ts` — single source of truth for the Tailwind preset and Vue components.

## License

MIT. See [LICENSE](./LICENSE).
