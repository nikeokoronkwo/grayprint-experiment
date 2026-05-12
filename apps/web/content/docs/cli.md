---
title: The CLI
description: grayprint and create-grayprint — installation, auth, and commands.
order: 2
---

There are two CLIs in the Grayprint family.

## `create-grayprint`

Fast bootstrap for new projects:

```bash
pnpm create grayprint <project-name>
```

Interactive prompts pick a template from the registry and scaffold it locally.

## `grayprint`

The management CLI. Commands:

- `login` / `logout` / `whoami` — device-auth based, no passwords
- `init` — set up a publishable `grayprint.json` in your project
- `publish` — push your template to the registry
- `templates list|get` — query the registry
- `agents create|list|revoke` — manage agent API keys
- `mcp` — run the MCP server over stdio (use this from Claude Desktop, etc.)
