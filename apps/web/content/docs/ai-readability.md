---
title: AI-readability spec
description: application/grayprint+json — the machine surface every template ships.
order: 4
---

Every public template page embeds two machine-readable blocks.

## JSON-LD

`<script type="application/ld+json">` — standard Schema.org `SoftwareSourceCode` for
crawler and search consumers.

## Grayprint AI block

`<script type="application/grayprint+json">` — the canonical AI-readability shape,
versioned. Contains:

- `schemaVersion` (currently `"grayprint.ai/v1"`)
- `summary`, `purpose`, `capabilities`, `nonGoals`
- `components` — composable parts contributed by this template
- `requirements` — runtime / peer / service deps the consumer must already provide
- `installHint` — single-paragraph install/use prose for LLMs
- `examples` — labelled, self-contained usage blocks
- `compatibility` — runtimes, frameworks, package managers

## Discovery surfaces

Two extra surfaces help agents discover content without scraping HTML:

- `/llms.txt` — concise project map
- `/llms-full.txt` — full marketplace catalogue with metadata

On the MCP side, the same shape is returned by `get_template`.
