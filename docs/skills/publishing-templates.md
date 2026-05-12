---
name: publishing-templates
description: Publish a project to the Grayprint registry using the grayprint CLI. Covers init, auth, publish, and updates.
version: 1
---

# Publishing templates to Grayprint

## When to use this skill

Use this skill when the user wants to publish a project as a Grayprint template,
update an already-published template, or set up a new project to be publishable.

## Steps

1. Verify the CLI is installed:
   ```bash
   grayprint --version
   ```
   If not present, install it with `pnpm add -g @grayprint/cli` (or the user's package manager equivalent).

2. Sign in (device auth — no password):
   ```bash
   grayprint login
   ```
   The CLI prints a code and a URL. The user opens the URL in their browser and approves.

3. Inside the project, create a publishable manifest:
   ```bash
   grayprint init
   ```
   This generates `grayprint.json` next to `package.json`. Fields you should populate carefully:
   - `slug` — lowercase, digits, hyphens; permanent
   - `title`, `summary`, `description`
   - `kind` (`starter` | `component` | `theme` | `snippet` | `workflow` | `app`)
   - `framework`, `license`, `version`
   - `ai.summary`, `ai.purpose`, `ai.capabilities`, `ai.installHint`

4. Publish:
   ```bash
   grayprint publish
   ```
   The CLI upserts the manifest and bumps the published version. The detail page goes live
   immediately at `https://grayprint.dev/templates/<slug>`.

5. For updates: edit `grayprint.json`, then re-run `grayprint publish`. To force a specific
   version, use `--version 0.2.0`. To add a changelog entry, `--message "added X"`.

## Common pitfalls

- The slug cannot be changed after the first publish — pick carefully.
- The AI-readability fields are *required* — they're how agents and crawlers understand the template.
- Free templates publish immediately. Paid templates require Polar product configuration (Level-0: free only).
