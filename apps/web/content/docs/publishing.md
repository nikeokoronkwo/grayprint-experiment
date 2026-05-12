---
title: Publishing a template
description: From local project to public listing in three commands.
order: 1
---

Publishing a template takes three steps.

## 1. Authenticate the CLI

Sign in with device auth — no passwords:

```bash
grayprint login
```

The CLI prints a code and a URL. Open it in your browser and approve.

## 2. Initialize the project

Inside your project, run:

```bash
grayprint init
```

This creates a `grayprint.json` next to your `package.json` capturing your template's
metadata, AI-readability block, install hint, components, and dependencies.

## 3. Publish

```bash
grayprint publish
```

The CLI uploads your metadata to the registry. The public detail page is live immediately
at `/templates/<slug>`. Search indexes update on the next request.

## Updates

Your `grayprint.json` is the source of truth — re-run `grayprint publish` to push updates.
Versions are tracked in the registry and exposed on the detail page.
