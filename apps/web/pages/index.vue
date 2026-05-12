<script setup lang="ts">
import type { TemplateCard } from '@grayprint/schemas';

useSeoMeta({
  title: 'Grayprint',
  description:
    'A dynamic template marketplace where templates are content — discoverable, AI-readable, and built for both humans and agents.',
  ogTitle: 'Grayprint — the blueprint for templates',
  ogDescription: 'Premium templates as discoverable, AI-readable content.',
  ogImage: '/og/default.png',
  twitterCard: 'summary_large_image',
});

const { data: featured } = await useAsyncData('home:featured', () =>
  $fetch<{ items: TemplateCard[] }>('/api/templates', {
    query: { perPage: 6, sort: 'newest' },
  }).catch(() => ({ items: [] })),
);
</script>

<template>
  <main>
    <HeroBlueprint />

    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="flex items-end justify-between gap-4">
        <div>
          <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">
            recently published
          </div>
          <h2 class="mt-2 font-display text-3xl font-bold tracking-tight">Featured templates</h2>
        </div>
        <NuxtLink to="/templates" class="btn-ghost text-sm">
          See all <Icon name="lucide:arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </div>

      <div class="mt-8">
        <TemplateGrid :templates="featured?.items ?? []" />
      </div>
    </section>

    <section class="border-y border-ink/10 bg-ink text-paper">
      <div class="relative mx-auto max-w-6xl overflow-hidden px-6 py-24">
        <div class="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-10" aria-hidden="true" />
        <div class="relative grid gap-12 md:grid-cols-2">
          <div>
            <div class="font-mono text-[10px] uppercase tracking-widest text-accent-400">
              for agents
            </div>
            <h2 class="mt-2 max-w-md font-display text-4xl font-bold tracking-tight">
              Every template, machine-readable.
            </h2>
            <p class="mt-5 max-w-md text-pretty text-paper/75">
              Each public template ships with a canonical
              <code class="rounded bg-paper/10 px-1 py-0.5 font-mono text-accent-300">application/grayprint+json</code>
              metadata block: purpose, capabilities, install hints, compatibility — exactly the
              shape an agent needs to reason about a template and act on it.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink to="/docs/mcp" class="btn-accent">Use the MCP server</NuxtLink>
              <a href="/llms.txt" class="btn-outline border-paper/20 bg-transparent text-paper hover:border-paper/40">
                Read llms.txt
              </a>
            </div>
          </div>
          <pre class="self-center overflow-x-auto rounded-xl border border-paper/10 bg-black/40 p-5 font-mono text-xs leading-relaxed text-paper/90"><code>{
  "schemaVersion": "grayprint.ai/v1",
  "summary": "Nuxt marketing starter with motion + SEO.",
  "capabilities": [
    "blog with MDC",
    "animated hero",
    "OG image generation"
  ],
  "compatibility": {
    "frameworks": ["nuxt"],
    "package_managers": ["pnpm", "npm"]
  },
  "installHint": "pnpm create grayprint nuxt-marketing-starter my-site"
}</code></pre>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid gap-12 md:grid-cols-3">
        <div>
          <Icon name="lucide:terminal" class="h-6 w-6 text-blueprint-600" />
          <h3 class="mt-3 font-display text-xl font-bold tracking-tight">Dual CLI</h3>
          <p class="mt-2 text-sm text-ink/70">
            <code class="font-mono text-blueprint-700">create-grayprint</code> bootstraps a project in one command.
            <code class="font-mono text-blueprint-700">grayprint</code> manages publishing, agents, and your registry.
          </p>
        </div>
        <div>
          <Icon name="lucide:cpu" class="h-6 w-6 text-blueprint-600" />
          <h3 class="mt-3 font-display text-xl font-bold tracking-tight">AI-native</h3>
          <p class="mt-2 text-sm text-ink/70">
            Authenticated MCP server, machine-readable metadata, and llms.txt — agents can search,
            inspect, and publish without scraping.
          </p>
        </div>
        <div>
          <Icon name="lucide:layers" class="h-6 w-6 text-blueprint-600" />
          <h3 class="mt-3 font-display text-xl font-bold tracking-tight">Premium catalog</h3>
          <p class="mt-2 text-sm text-ink/70">
            Templates as content. Each page is curated, discoverable, and optimised for search —
            not a dashboard listing.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
