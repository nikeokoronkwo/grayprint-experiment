<script setup lang="ts">
const route = useRoute();
const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : (route.params.slug as string);

const docs: Record<string, { title: string; body: string }> = {
  publishing: {
    title: 'Publishing a template',
    body: `Publishing a template takes three steps.

1) Authenticate the CLI with device auth:

   grayprint login

2) Inside your project, run:

   grayprint init

   This creates a \`grayprint.json\` next to your \`package.json\` capturing your template's
   metadata, AI-readability block, install hint, components, and dependencies.

3) Publish:

   grayprint publish

   The CLI uploads your metadata to the registry. The public detail page is live immediately
   at /templates/<slug>. Search indexes update on the next request.

Your \`grayprint.json\` is the source of truth — re-run \`grayprint publish\` to push updates.
Versions are tracked in the registry and exposed on the detail page.`,
  },
  cli: {
    title: 'The CLI',
    body: `There are two CLIs in the Grayprint family.

create-grayprint
   Fast bootstrap: \`pnpm create grayprint <project-name>\`. Interactive prompts pick a
   template from the registry and scaffold it locally.

grayprint
   The management CLI. Commands:
   • login / logout / whoami — device-auth based, no passwords
   • init — set up a publishable grayprint.json in your project
   • publish — push your template to the registry
   • templates list|get — query the registry
   • agents create|list|revoke — manage agent API keys
   • mcp — run the MCP server over stdio (use this from Claude Desktop, etc.)`,
  },
  mcp: {
    title: 'MCP server',
    body: `Grayprint ships an authenticated Model Context Protocol server. Two transports:

stdio
   For local agents and editor integrations. Run:
     grayprint mcp
   Then configure your client (Claude Desktop, etc.) to spawn that command.

Streamable HTTP
   The marketplace exposes /api/mcp. Authenticate with a bearer token from an agent API
   key (create one in /dashboard/agents).

Tools available:
   • search_templates — full-text + filtered search
   • get_template — fetch the full public record by slug
   • list_categories — enumerate categories
   • publish_template — auth-gated publish (registry:write scope required)

All shapes are defined by @grayprint/schemas — the same Zod contracts the website uses.`,
  },
  'ai-readability': {
    title: 'AI-readability spec',
    body: `Every public template page embeds two machine-readable blocks.

JSON-LD (application/ld+json)
   Standard Schema.org SoftwareSourceCode for crawler / search consumers.

Grayprint AI block (application/grayprint+json)
   The canonical AI-readability shape, versioned. Contains:
   • schemaVersion (currently "grayprint.ai/v1")
   • summary, purpose, capabilities, nonGoals
   • components — composable parts contributed by this template
   • requirements — runtime / peer / service deps the consumer must already provide
   • installHint — single-paragraph install/use prose for LLMs
   • examples — labelled, self-contained usage blocks
   • compatibility — runtimes, frameworks, package managers

Two extra surfaces help agents discover content without scraping HTML:
   • /llms.txt — concise project map
   • /llms-full.txt — full marketplace catalogue with metadata

And on the MCP side, the same shape is returned by \`get_template\`.`,
  },
};

const doc = docs[slug];
if (!doc) throw createError({ statusCode: 404, statusMessage: 'Not found' });

useSeoMeta({ title: doc.title, description: `Grayprint docs — ${doc.title}` });
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-14">
    <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">docs</div>
    <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">{{ doc.title }}</h1>
    <pre class="mt-8 whitespace-pre-wrap text-pretty font-sans text-base leading-relaxed text-ink/80">{{ doc.body }}</pre>
    <div class="mt-12">
      <NuxtLink to="/docs" class="btn-outline text-sm">← All docs</NuxtLink>
    </div>
  </main>
</template>
