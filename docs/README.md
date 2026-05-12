# Grayprint docs source

Markdown source for documentation surfaces.

- `ai-readability/spec.md` — authoritative spec for `application/grayprint+json` (mirrors `@grayprint/schemas/ai`).
- `skills/*.md` — agent skill docs. Front-matter-tagged, `name`/`description`/`version`. Loadable by tools that follow the Agent Skills format.

The Nuxt app renders the same content via `/docs` and serves the AI surface routes (`/llms.txt`, `/llms-full.txt`) from the server.
