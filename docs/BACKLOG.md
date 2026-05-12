# Backlog

Items intentionally deferred past Level 0. Architecture is in place for each — the
schema, the better-auth + Polar wiring, and the entitlement model all account for these
flows. What's missing is the UI surface and the public-facing docs page.

## Level 1 — creator monetization

### Paid templates
- Surface `pricing: 'paid' | 'pay_what_you_want'` in the publish flow (`grayprint
  publish --price <cents>` and the dashboard form)
- Polar product creation hook: when a template is first published with `pricing !=
  free`, mint a Polar product and store the `polarProductId` on the template row
- Detail page: show price, "Buy this template" CTA → Polar checkout via
  `@polar-sh/better-auth`
- Webhook handler: on `order.paid`, create an `entitlement` row binding the buyer's
  userId to the template

### Buyer flow
- New docs page: **"Buying a template"** — covers checkout, receipts, where the
  purchased templates live in the dashboard, refund policy
- New dashboard page at `/dashboard/library` listing purchased templates
- `grayprint install <slug>` from a paid template: verify entitlement via
  `/api/entitlements/check` before download
- Receipt email on purchase (uses the existing nodemailer transport)

### Buyer-side management
- New docs page: **"Managing purchased templates"** — re-downloading, updating to new
  versions, ownership records, requesting refunds
- Dashboard CTA: "Re-download" runs the same fetch the CLI does
- Entitlements expire? Currently `validUntil` is nullable; need policy on whether paid
  templates are one-time-purchase or subscription

### Creator payouts
- Polar Connect-style payout splits (Polar handles the merchant-of-record + KYC)
- New docs page: **"Earnings and payouts"** — how splits work, payout schedule, tax
  forms
- Dashboard at `/dashboard/earnings`

### Private registries
- Schema is ready: `visibility: 'private'` + a `registry` table for tenant-scoped
  catalogues
- API: registry-scoped read paths, registry-scoped publish
- CLI: `grayprint registry create | invite | publish --registry=<id>`
- Docs: **"Private registries"**

## Documentation gaps to address in Level 1

These were noted in the Level-0 review pass but punted:

- "What is Grayprint?" comparison table vs. specific named alternatives (GitHub
  templates, shadcn-vue, boilerplate-marketplaces) — currently a prose comparison
- Step-by-step "browse to install" tutorial (the current marketplace doc is structural,
  not a walkthrough)
- Programmatic "complete workflow" video / screencast
- Template ownership transfer flow (co-authors, hand-offs)
- Schema reference page — auto-generated from the Zod schemas

## Open architectural questions

- Do paid templates ship the full source tree from day 1, or do we gate the
  downloadable tarball behind the entitlement check?
- Single-template-per-purchase vs. bundles vs. subscriptions — schema supports all
  three; policy choice TBD
- Refund window — Polar supports per-product policy; default policy TBD
- Search rank: should paid templates be surfaced more prominently? Less? Algorithm
  should be explicit
