---
name: using-the-registry
description: Read from and act on the Grayprint registry via the SDK or HTTP API. Covers search, get, list.
version: 1
---

# Using the Grayprint registry

## When to use this skill

When the user (or an agent) needs to search Grayprint for a template, inspect a specific
template's metadata, or list categories/tags.

## SDK (recommended)

```ts
import { GrayprintClient } from '@grayprint/sdk';

const sdk = new GrayprintClient({
  apiUrl: 'https://grayprint.dev',
  token: process.env.GRAYPRINT_TOKEN, // optional for public reads
});

// Search
const { items } = await sdk.search({ q: 'nuxt marketing', framework: 'nuxt', perPage: 12 });

// Fetch one
const tpl = await sdk.getTemplate('nuxt-marketing-starter');

// Categories
const categories = await sdk.listCategories();
```

## HTTP

```
GET https://grayprint.dev/api/search?q=nuxt&framework=nuxt&perPage=12
GET https://grayprint.dev/api/templates/<slug>
GET https://grayprint.dev/api/categories
GET https://grayprint.dev/api/tags
```

All public reads work anonymously. Writes require `Authorization: Bearer <agent-api-key>` with `registry:write` scope.

## What you get back

Every template includes a normalised `ai` block — `application/grayprint+json` shape — with `summary`, `purpose`, `capabilities`, `installHint`, and `compatibility`. Use that directly to reason about whether a template fits the user's task; don't scrape the HTML.
