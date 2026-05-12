# Grayprint

> Dynamic template marketplace and template-as-content engine. SEO-first, AI-native, premium.

Grayprint is a monorepo containing:

| Path | Purpose |
|---|---|
| `apps/web` | Nuxt full-stack app — marketplace, registry API, MCP HTTP transport |
| `packages/schemas` | Zod schemas + TypeScript types, the shared domain vocabulary |
| `packages/ui` | Tailwind preset, design tokens, shadcn-vue primitives, GSAP utilities |
| `packages/sdk` | Typed registry client used by CLIs and MCP |
| `packages/cli-core` | Shared CLI logic (device auth, config, registry awareness) |
| `packages/cli` | `grayprint` — general management CLI |
| `packages/create` | `create-grayprint` — fast bootstrap CLI |
| `packages/mcp` | Authenticated MCP server (stdio + HTTP) |
| `docs/` | Public skill docs, agent guidance |

## Stack

- **Nuxt** + Nitro (TypeScript, SSR)
- **NuxtHub** for portable database / blob / cache (Vercel, Node, Cloudflare)
- **Drizzle ORM** on Postgres (PGLite local fallback)
- **better-auth** with `magicLink`, `emailOTP`, `deviceAuthorization`, `apiKey`, `mcp`, `polar` plugins
- **Polar.sh** as Merchant of Record via `@polar-sh/better-auth`
- **Tailwind CSS** + **shadcn-vue** + **GSAP**
- **MCP** via `@modelcontextprotocol/sdk`

## Quickstart

```bash
pnpm install
cp .env.example .env       # edit values
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open <http://localhost:3000>.

## Scripts

```bash
pnpm dev           # everything in parallel
pnpm build         # all packages + Nuxt build
pnpm typecheck     # workspace-wide
pnpm lint          # biome
pnpm db:generate   # generate Drizzle migrations
pnpm db:migrate    # apply migrations
pnpm db:seed       # seed templates + categories
```

## CLIs

```bash
pnpm create grayprint my-template   # scaffold a new project
grayprint login                     # device-auth flow
grayprint publish                   # publish a template
grayprint mcp                       # run the MCP server over stdio
```

## AI surface

- `GET /llms.txt` — concise project map for LLMs
- `GET /llms-full.txt` — full marketplace catalogue with metadata
- `GET /api/mcp` — authenticated Streamable HTTP MCP transport
- Every template page embeds a `<script type="application/grayprint+json">` block + JSON-LD

## Status

**Level 0 MVP.** Public publishing, search, marketplace, AI-readability, dual CLIs, MCP. Level 1 (private registries, creator monetization, Dub attribution) is architected but not exposed.

See [CLAUDE.md](./CLAUDE.md) for the original build brief.
