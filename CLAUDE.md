# Grayprint Level 0 MVP — Build Instructions

## Mission

Build **Grayprint** as a fully functional, production-ready Level 0 MVP: a dynamic template marketplace and template-as-content engine. The platform must feel **premium**, **design-forward**, and **deeply technical**—supporting both human creators and AI agents from day one.

Output a **working monorepo** with:
- Complete Nuxt full-stack application (marketplace + registry service)
- Shared TypeScript domain types and schemas
- Two CLI entrypoints (general + scaffold)
- Authenticated MCP server surface
- AI-readability spec and machine-accessible metadata layer
- Production-ready frontend shell with GSAP, Tailwind, and shadcn-vue

**Key constraint**: Structure the codebase so Level 1 (private registries, creator monetization) can be grafted on without major rewrites.

---

## Product Vision

**Grayprint** is an **SEO-first template marketplace** where public template pages behave as **discoverable content**, attracting creators and users organically. 

- **Level 0 focus**: Public publishing, discoverability, search, and premium browser experience
- **Future vision** (Level 1): Creator seeding, passive income through private registries
- **Do not implement** Level 1 yet, but architect so it fits naturally

---

## Core Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Full-stack app** | Nuxt (TypeScript) | SSR marketplace + registry API |
| **Language** | TypeScript | Monorepo, CLIs, shared packages, APIs |
| **Motion** | GSAP | Tasteful, energy-adding animations |
| **UI framework** | Tailwind CSS + shadcn-vue | Consistent, themeable components |
| **Auth** | better-auth (TypeScript) | Unified identity for web + CLI |
| **Payments** | Polar (polar.sh) | Merchant of Record, entitlements |

**Critical integration**: Polar must attach directly to better-auth. Payments, entitlements, and identity must be unified architecturally from the start (even if Level 0 UI doesn't expose full commerce).

---

## Authentication & Identity

**Single unified auth layer** for web + CLI. No separate auth systems.

### better-auth Configuration

Use **TypeScript implementation**. Enable these modules from the start:

- **Dub**: Link management and attribution tracking
- **Email OTP + Magic Link**: User onboarding flows
- **Agent Auth**: AI agent authentication
- **Device Auth**: CLI login (preferred flow for CLI, not password-based)

The CLI and website must share the **same better-auth instance** and identity configuration.

### Principles

- **Level 0**: Keep auth UI simple and focused
- **Architecture**: Wire for creator/admin flows, agent workflows, and attribution—even if not fully exposed in UI
- **Future-proof**: Ensure Polar, entitlements, and identity can be unified later without rearchitecting

---

## Payments & Entitlements

**Use Polar as Merchant of Record** (polar.sh). 

- **Level 0**: Polar is wired into architecture but not heavily exposed in UI
- **Design**: Build the scaffolding so purchases, access, and entitlements can later be tied to template registries and creator monetization
- **Architecture**: Payments, entitlements, and identity must work together cleanly
- **Domain model**: Already account for monetized registries and creator revenue paths

---

## CLI Architecture

**Two entrypoints**, one cohesive product family:

### 1. `create-grayprint` (pnpm create grayprint)
- **Purpose**: Fast bootstrap path for new projects
- **Character**: Opinionated, beautiful, immediately usable
- **Speed**: Must be fast to invoke
- **Scope**: Provides a strong default scaffold
- **Example**: `pnpm create grayprint my-template`

### 2. `grayprint` (general CLI)
- **Purpose**: Developer and registry operations
- **Commands**: Registry management, publishing, auth, metadata operations
- **Scope**: Ongoing management after initial scaffold
- **Design**: Grows into a more complete platform CLI over time

### Shared Principles

- Both written in **TypeScript**
- Both use **device auth** for login (not password-based)
- Share **core internal logic** for auth, configuration, and registry awareness
- Feel like a **coherent product family**, not separate tools
- Consistent branding, command naming, and output style

---

## AI-Native Platform Requirements

Grayprint must be **AI-native from day one**—not an afterthought.

### What to build:

- **llms.txt**: Nuxt-based implementation for LLM and agent context
- **Public skill docs**: Machine-readable documentation of templates and platform
- **Template metadata**: Structured, machine-accessible data on every public template
- **Authenticated MCP server**: Extensible surface for agents and automation

### Design principle:

Make docs and template pages structured enough for crawlers, agents, and LLMs to:
- Understand the marketplace and publishing model
- Learn template usage, dependencies, and composition
- Act on registry operations

The platform should be **easy for AI agents to read, index, and act on**.

---

## Level 0 Product Scope

### Core deliverables:

1. **Static marketplace** — Public marketplace for templates with listing pages, detail pages, category browsing, tags, and discoverable publishing
2. **Public publishing** — Template pages indexed by search engines, consumable by humans and AI systems, with canonical metadata
3. **shadcn components** — Host shadcn-style components and component-based templates alongside full templates
4. **AI-readability spec** — Structured metadata spec for every template page (canonical data, categories, tags, components, dependencies, installation, examples, compatibility, machine-readable blocks)
5. **Basic search** — Simple, useful search across titles, descriptions, tags, categories, and key metadata
6. **Frontend shell** — Polished Nuxt interface: landing page, marketplace index, detail pages, category browsing, search UI, docs entry points
7. **Registry service** — Clean internal API and data model for storing, listing, publishing, querying templates
8. **Auth foundation** — better-auth wired for unified identity across web + CLI
9. **Payments foundation** — Polar integrated as Merchant of Record, with architecture ready for future entitlements
10. **Dual CLI** — Both `grayprint` and `create-grayprint` with coherent branding
11. **Machine access** — llms.txt, public skill docs, authenticated MCP surface

---

## Registry & Template Model

### Template schema (minimum fields):

- **Metadata**: slug, title, description, summary, template type (static/dynamic)
- **Organization**: categories, tags, visibility, status
- **Creator**: author metadata, creator info
- **Preview**: preview data, component references
- **Technical**: usage metadata, installation hints, compatibility info, dependency data
- **AI readiness**: AI-readability metadata, structured blocks
- **Publishing**: public publish state, search document fields
- **Future**: entitlement hooks, private registry placeholders

### Registry API capabilities:

- **CRUD**: Create, read, list, publish, update metadata
- **Organization**: Basic categorization, tagging
- **Access**: Public read for published items, authenticated write
- **Search**: Full-text, filtering by category/tag
- **Interfaces**: Suitable for Nuxt frontend and both CLIs

---

## Frontend Design Direction

**Non-generic, inspirational, modern, minimal, vibrant.**

The UI must:
- Portray **variety and design variance** (avoid repetitive dashboard look)
- Use **deliberate layout variation**, strong typography, thoughtful whitespace
- Feature **tasteful motion** with GSAP (adds energy where it matters, not everywhere)
- Present templates as a **premium design catalog**, not boilerplate listing
- Feel **curated and useful**, not generic or utilitarian

---

## Implementation Guidance

### Auth implementation:

- Use **TypeScript better-auth** (not JavaScript)
- Plan so **Polar can attach directly** to the auth system
- Enable **Dub** for attribution and link management
- Enable **Email OTP + Magic Link** for user flows
- Enable **Agent Auth** for AI workflows
- Enable **Device Auth** for CLI login (preferred over passwords)
- **Unified identity**: Same instance for CLI and website, no separate auth stacks

### Payments implementation:

- Use **Polar as Merchant of Record** from day one
- Design **purchases, access, and entitlements** with future template registries and creator revenue in mind
- Keep **payments layer aligned** with auth and registry model
- Even if Level 0 UI doesn't expose commerce, the **domain model must account for it**

### CLI implementation:

- **`grayprint` CLI**: Management-oriented, registry operations, publishing, auth, metadata
- **`create-grayprint` CLI**: Fast bootstrap, opinionated scaffold, immediately usable
- Both use **shared logic** for auth, configuration, registry awareness
- Use **device auth** for login
- Design for eventual support of publishing, listing, auth, registry administration

### MCP and agents:

- Provide an **authenticated MCP server** surface (minimal for Level 0, real and extensible)
- Keep it **ready for registry and template operations**
- Enable **AI agents, internal tools, and automation** without separate implementation later

---

## Architecture Expectations

### Monorepo structure:

Organize packages to avoid duplication and enable clean future evolution:

- **Shared schemas**: Domain types and validation for templates, categories, publishing, search, AI metadata, auth hints, entitlements
- **Nuxt app**: Marketplace frontend and registry service
- **CLI packages**: Shared logic + two entrypoints
- **Docs**: Skill documentation, llms.txt, agent guidance
- **Utils**: Shared utilities and helpers

**Golden rule**: Use the same vocabulary (types, models) everywhere—frontend, registry, CLIs, docs, MCP. No duplication across packages.

---

## What NOT to do

- ❌ **Do not** build Level 1 private registries yet
- ❌ **Do not** overbuild multi-tenant billing
- ❌ **Do not** create separate auth systems for web and CLI
- ❌ **Do not** invent unnecessary infrastructure
- ❌ **Do not** make the frontend generic or dashboard-like
- ❌ **Do not** duplicate schema definitions across packages
- ❌ **Do not** make the CLI and website feel like separate products

---

## Quality Bar

The result should feel like **the first serious version of a product that can actually ship**.

- **Visually distinctive**: Non-generic, thoughtful, premium feel
- **Technically coherent**: Clean abstractions, shared types, intentional architecture
- **Easy to extend**: Minimal but complete foundation for future features
- **Core primitives**: Shared identity, AI-readability, public publishing are first-class concerns, not afterthoughts
- **Future-proof**: Scaffolding supports Level 1 (private registries, creator monetization, seeding) without major rewrites

---

## Now build Grayprint accordingly