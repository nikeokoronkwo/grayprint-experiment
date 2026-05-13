# Grayprint Level 0 — Validation Report

Date: 2026-05-12
Branch: `chore/level0-validation-report` against `main` @ `4dcf00a`
Method: live boot + Playwright/WebKit walk + curl + Drizzle/Zod inline scripts.
Test infrastructure intentionally not installed (per user direction).

## Summary

| # | Area                                      | Result    | Bugs surfaced                                                              |
|---|-------------------------------------------|-----------|----------------------------------------------------------------------------|
| 1 | Static marketplace & rendering            | ✅ pass   | (known: dashboard hydration warning, pre-existing)                         |
| 2 | Metadata spec enforcement                 | ✅ pass   | —                                                                          |
| 3 | Search & discovery                        | ❌ fail   | `/api/search` ignores `tag`+`category` filters; wrong `total` count        |
| 4 | Publishing flow (via session)             | ✅ pass   | —                                                                          |
| 5 | Auth lifecycle                            | ⚠️ partial | `/api/auth/sign-out` returns 403; UI signout broken                        |
| 6 | shadcn component listing                  | ✅ pass¹  | (reinterpreted — no live previews exist in Level 0, by design)             |
| 7 | Route stability & build integrity         | ⚠️ partial | Prod build OK; **prod server fails to boot** (baseline polar ESM mismatch) |

Plus one collateral bug found during check 4 setup:
- **`/api/agents POST` is broken** — better-auth API misuse → "server-only property" error. Users can't issue agent API keys via the dashboard.

**Bug count: 4 (3 functional, 1 ship-readiness).** Level 0 *features* are largely present and correct; the listed bugs are real and gateable for ship.

¹ Copy button executes without errors; clipboard read-back skipped due to WebKit permission model — not an app issue.

---

## Check 1 — Static marketplace & rendering ✅

Walked `/`, `/templates`, `/templates/nuxt-marketing-starter`, `/categories`, `/tags/nuxt`, `/search?q=nuxt`, `/login`, `/dashboard` via Playwright/WebKit at 1440×900. All 7 routes return HTTP 200 with the expected titles and h1s. No `pageerror`. No `requestfailed`.

One pre-existing, already-documented `console.error`: `Hydration completed but contains mismatches.` on `/dashboard`. Cause: client-only auth middleware bails on SSR, so the dashboard layout SSRs once before the client redirect to `/login`. Not a regression.

Screenshots: `/tmp/grayprint-e2e/shots/{01-landing,02-marketplace,03-detail,04-categories,05-search,06-login,07-dashboard}.png`.

## Check 2 — Metadata spec enforcement ✅

All 6 seeded templates parse cleanly against `template` Zod schema (`packages/schemas/src/template.ts`). All 6 AI blocks parse against `aiMetadata` schema with `schemaVersion: 'grayprint.ai/v1'`. Negative case (template missing `ai`) correctly rejected with `ZodError` on path `'ai'`.

### Schema field-name mapping (checklist → actual)

The validation checklist uses different field names than the schema actually exposes:

| Checklist name | Actual schema field      | Notes                                                                                 |
|----------------|--------------------------|---------------------------------------------------------------------------------------|
| `slug`         | `slug`                   | match                                                                                 |
| `title`        | `title`                  | match                                                                                 |
| `description`  | `description`            | match                                                                                 |
| `summary`      | `summary`                | match                                                                                 |
| `templateType` | `kind`                   | enum: `app`, `component`, `starter`, `snippet`, `theme`, `workflow`                   |
| `categories`   | `categoryIds` / `categories` | write side uses ids, read projection hydrates `{id, slug, name}[]`                |
| `tags`         | `tagIds` / `tags`        | same shape as categories                                                              |
| `visibility`   | `visibility`             | match: `public`, `unlisted`, `private`                                                |
| `creator`      | `authorId` / `author`    | write side uses cuid, read projection hydrates the public user shape                  |
| `preview`      | `preview`                | match: `{hero, thumbnail, gallery, demoUrl, repoUrl}`                                 |
| `technical`    | (distributed)            | spread across `install`, `components`, `dependencies`, `version`, `license`, `framework`, `pricing`, `priceCents` |
| `aiReadability`| `ai`                     | full `AiMetadata` shape with `schemaVersion: grayprint.ai/v1`                         |
| `publishState` | `status`                 | enum: `draft`, `published`, `archived`                                                |

## Check 3 — Search & discovery ❌

FTS works correctly. **`tag` and `category` filters are ignored.**

### Pass cases

```
/api/search?q=Nuxt%20Marketing%20Starter  → 1, first: nuxt-marketing-starter   ✓
/api/search?q=saas                        → 1, first: next-saas-foundation     ✓
/api/search?q=shell                       → 2, includes nuxt-dashboard-shell   ✓
/api/search?q=xyzzyqqzzz                  → 0                                  ✓
/api/search?kind=component                → 1, shadcn-vue-pricing              ✓
/api/search?framework=nuxt                → 2, nuxt-{marketing,dashboard}      ✓
/search?q=xyzzyqqzzz HTML → renders "No templates" empty state                 ✓
```

### Fail cases

```
/api/search?tag=nuxt        → returns ALL 6 (expected 2)        ❌
/api/search?tag=ai          → returns ALL 6 (expected 1)        ❌
/api/search?tag=missing     → returns ALL 6 (expected 0)        ❌
/api/search?category=starters → returns ALL 6 (expected 4)      ❌
```

User-facing impact:
- `/tags/nuxt` page shows all 6 templates instead of the 2 with the `nuxt` tag
- `/categories/starters` page shows all 6 templates instead of the 4 starters

### Root cause

`apps/web/server/api/search.get.ts` only filters on `kind`, `framework`, `pricing`, and FTS. The `tag` and `category` params are accepted by the Zod schema (`packages/schemas/src/search.ts`) but never threaded into the Drizzle query.

Also: `total: items.length` is returned (line 45 of search.get.ts) — this is the page size, not the true match count, so pagination calculation breaks on page 2+. `/api/templates/index.get.ts` does this correctly with a separate count query — the same pattern needs to be ported here.

### Remediation

In `apps/web/server/api/search.get.ts`:
1. When `q.category` set: `inArray(template.id, db.select(templateCategory.templateId).from(templateCategory).innerJoin(category, eq(category.id, templateCategory.categoryId)).where(eq(category.slug, q.category)))` and push into `filters`.
2. When `q.tag` set: same shape against `templateTag` + `tag`.
3. Replace `total: items.length` with a separate `count()` query over the same `where` clause.

`/api/templates/index.get.ts` already does both correctly — port that pattern.

## Check 4 — Publishing flow (API) ✅

Authentication strategy: drove the magic-link login flow in Playwright (capturing the link from dev `jsonTransport` stdout), then issued API calls with the session cookie. Could **not** create an agent API key (see check 4-bonus below).

Steps (in order, all PASS):

```
POST /api/templates                       → 200, status=draft
POST /api/templates/<slug>/publish        → 200, publishedAt set
GET  /api/templates/<slug>                → 200, status=published, publishedAt present
GET  /api/search?q=validation             → 200, total=1, slug appears
GET  /templates/<slug>  (HTML)            → 200, both <script type=application/ld+json>
                                              and <script type=application/grayprint+json> present
DELETE /api/templates/<slug>              → 200
```

Zero browser-side errors during the flow.

### Check 4-bonus — `/api/agents POST` broken ❌

While trying to set up check 4 with an agent API key (the intended Level 0 flow for non-human callers), the POST failed:

```
POST /api/agents
status=400
body=The property you're trying to set can only be set from the server auth instance only.
```

**Root cause:** `apps/web/server/api/agents/index.post.ts` calls `auth.api.createApiKey` with both `headers: event.headers` AND `body: { permissions: {...} }`. With `headers` present, better-auth treats this as a client-initiated call and rejects the server-only `permissions` field.

**Remediation:** drop `headers` from the `createApiKey` call and add `userId: principal.userId` to the body:

```ts
const principal = await requireUser(event);
const result = await auth.api.createApiKey({
  body: {
    name: parsed.data.name,
    userId: principal.userId,
    permissions: { registry: ['read', 'write'], mcp: ['call'] },
    expiresIn: parsed.data.expiresIn,
  },
});
```

Reachable from `/dashboard/agents` "New key" button → users can't create agent API keys today.

## Check 5 — Auth lifecycle ⚠️

| Step                                                | Result |
|-----------------------------------------------------|--------|
| `/login` page renders                               | ✅     |
| Magic-link send (POST `/api/auth/sign-in/magic-link`) | ✅     |
| Magic-link consume → `/dashboard`                   | ✅     |
| Session persists across reload                      | ✅     |
| Session cookie name `better-auth.session_token`     | ✅     |
| Fresh context (no cookies) `/dashboard` → `/login`  | ✅     |
| **POST `/api/auth/sign-out` returns 403**           | ❌     |
| After failed sign-out, `/dashboard` still accessible | ❌    |

**Root cause for sign-out:** the better-auth sign-out endpoint requires a CSRF token / specific origin header that the test POST didn't supply. Worth confirming whether the actual UI signs out correctly (no UI signout button is wired up today — the dashboard does not have a "Sign out" affordance in `SiteHeader.vue` or `dashboard.vue`). If the UI path also fails, users cannot sign out.

**Remediation:** add a sign-out button to the dashboard header that calls `authClient.signOut()` (the client SDK handles CSRF correctly) AND make sure the server endpoint accepts properly-sent CSRF tokens.

## Check 6 — shadcn component listing ✅ (reinterpreted)

Original checklist asked for "hosted shadcn components render correctly and display accurate usage snippets" with live previews. Level 0 reality: no live interactive previews; detail pages show metadata + install command. User confirmed the reinterpretation.

Verified on `/templates/shadcn-vue-pricing`:

```
title:              "shadcn-vue Pricing Block — Grayprint"  ✓
h1:                 "shadcn-vue Pricing Block"               ✓
install hint in HTML: "grayprint add shadcn-vue-pricing"     ✓
AI-readable badge:  present                                  ✓
capability text in HTML: pricing/tier/monthly/yearly         ✓
copy button:        present, clicks without error            ✓
JSON-LD block:      present                                  ✓
grayprint+json block: present                                ✓
  schemaVersion:    grayprint.ai/v1                          ✓
  capabilities:     monthly/yearly toggle, recommended tier
                    highlight, FAQ accordion (matches seed)  ✓
  installHint:      pnpm dlx grayprint add shadcn-vue-pricing
                    (matches seed)                           ✓
```

Note: clipboard read-back via Playwright/WebKit was denied by the user-agent permission model. The button's click handler executed without errors — the issue is harness-side, not app-side.

Gap from original spec (interactive shadcn-vue previews) is captured in `docs/BACKLOG.md` under Level 1.

## Check 7 — Route stability & build integrity ⚠️

### Production build: ✅

```
$ PUBLIC_SITE_URL=https://grayprint.dev NODE_ENV=production \
    pnpm --filter @grayprint/web build
...
[nitro] ✔ You can preview this build using node .output/server/index.mjs
✨ Build complete!  (44.5 MB total, 15.1 MB gzip)
```

No warnings or errors.

### Production server boot: ❌

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'.output/server/node_modules/@polar-sh/sdk/dist/esm/webhooks.js'
imported from '.output/server/node_modules/@polar-sh/better-auth/dist/index.js'
```

**This is a ship-blocker for actual deployment.** The peer-dep mismatch between `@polar-sh/sdk` and `@polar-sh/better-auth` (the latter imports `webhooks.js` which doesn't exist in the former's bundled output) was previously documented as a baseline issue in PR #5's description.

**Remediation:** bump `@polar-sh/sdk` and `@polar-sh/better-auth` to a compatible peer pair (verify against the latest matching versions on npm), or pin to an older known-good pair. This is not a new regression — it has affected every prod-boot attempt since Phase A.

### Smoke routes (dev server substitute): ✅

All return HTTP 200:

```
/                                  200
/templates                         200
/templates/nuxt-marketing-starter  200
/login                             200
/llms.txt                          200
/sitemap.xml                       200
/robots.txt                        200
/api/health                        200
```

### Secret-leak scan: ✅

Collected 167 KB of HTML + API responses across `/`, `/templates`, `/templates/<slug>`, `/login`, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, `/api/templates`, `/api/search`. Searched for: `BETTER_AUTH_SECRET`, the actual secret value, `postgresql://` connection strings, `SMTP_PASS`, `re_your_api_key`, `POLAR_ACCESS_TOKEN`, `BLOB_READ_WRITE_TOKEN`. **0 hits across all keys.**

---

## Recommendations for ship-readiness

In priority order:

1. **(P0 — ship-blocker)** Fix the `@polar-sh/sdk` ↔ `@polar-sh/better-auth` peer dep so the prod server can boot. Without this, the Level 0 site cannot be deployed.
2. **(P0)** Fix `/api/search` to honor `tag` and `category` filters and return the true `total` count. The user-facing `/tags/<slug>` and `/categories/<slug>` pages are noticeably wrong without it.
3. **(P1)** Fix `/api/agents POST` so users can create agent API keys from the dashboard. Currently broken end-to-end.
4. **(P1)** Wire a sign-out button into the dashboard / site header and verify `/api/auth/sign-out` accepts the client SDK's CSRF token. Currently no UI path to sign out.
5. **(P2 — documented as known)** Fix the dashboard hydration mismatch by moving the auth middleware check to a server-aware version (better-auth's server `getSession` with request cookies) so the client doesn't render the dashboard layout before redirecting.

## Files / artifacts produced this pass

- `/tmp/grayprint-e2e/walk.mjs` — main route walker (existing, reused)
- `/tmp/grayprint-e2e/check4-5-auth-publish.mjs` — magic-link login + publish flow
- `/tmp/grayprint-e2e/check6-component.mjs` — component detail verification
- `/tmp/grayprint-e2e/shots/` — Playwright screenshots
- `/tmp/leak-scan.txt` — secret-leak scan corpus
- This file — committed at `docs/level0-validation.md` on branch `chore/level0-validation-report`
