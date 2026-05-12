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

    <!-- Featured -->
    <section class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div class="flex items-end justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden="true" />
            <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">
              recently published
            </div>
          </div>
          <h2 class="mt-3 font-display text-4xl font-bold tracking-tight">
            Featured templates
          </h2>
          <p class="mt-2 max-w-md text-pretty text-ink/60">
            A hand-picked slice of the catalogue — full project starters, drop-in components, and
            agent-ready workflows.
          </p>
        </div>
        <NuxtLink to="/templates" class="hidden btn-ghost text-sm sm:inline-flex">
          See all <Icon name="lucide:arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </div>

      <div class="mt-10">
        <TemplateGrid :templates="featured?.items ?? []" />
      </div>
    </section>

    <!-- For agents — dark band -->
    <section class="relative overflow-hidden border-y border-ink/10 bg-ink text-paper">
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.07]"
        :style="{
          backgroundImage:
            'linear-gradient(to right, rgba(245,242,232,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,242,232,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blueprint-500/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent-400/15 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div class="grid gap-14 md:grid-cols-2 md:items-center">
          <div>
            <div class="inline-flex items-center gap-2 rounded-pill border border-paper/15 px-3 py-1">
              <span class="h-1.5 w-1.5 rounded-full bg-accent-400 shadow-[0_0_10px_rgba(163,230,53,0.8)]" />
              <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-300">
                for agents
              </span>
            </div>
            <h2 class="mt-5 max-w-md font-display text-5xl font-bold leading-[1.05] tracking-tight">
              Every template,
              <span class="text-accent-400">machine-readable.</span>
            </h2>
            <p class="mt-6 max-w-md text-pretty text-lg text-paper/75">
              Each public template ships with a canonical
              <code class="rounded bg-paper/10 px-1.5 py-0.5 font-mono text-sm text-accent-300">application/grayprint+json</code>
              metadata block: purpose, capabilities, install hints, compatibility — exactly the
              shape an agent needs to reason about a template and act on it.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink to="/docs/mcp" class="btn-accent">
                <span>Use the MCP server</span>
                <Icon name="lucide:arrow-right" class="h-4 w-4" />
              </NuxtLink>
              <a
                href="/llms.txt"
                class="btn-outline border-paper/20 bg-transparent text-paper hover:border-paper/40 hover:bg-paper/5"
              >
                Read llms.txt
              </a>
            </div>
          </div>

          <div class="relative">
            <div
              class="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-br from-accent-400/30 via-transparent to-blueprint-500/30 opacity-60 blur-xl"
              aria-hidden="true"
            />
            <div class="relative overflow-hidden rounded-xl border border-paper/10 bg-black/55 shadow-2xl backdrop-blur">
              <div class="flex items-center gap-2 border-b border-paper/10 px-4 py-2.5">
                <span class="h-2 w-2 rounded-full bg-spark-500/80" />
                <span class="h-2 w-2 rounded-full bg-accent-400/80" />
                <span class="h-2 w-2 rounded-full bg-blueprint-400/80" />
                <span class="ml-3 font-mono text-[10px] uppercase tracking-widest text-paper/55">
                  application/grayprint+json
                </span>
                <span class="ml-auto font-mono text-[10px] text-paper/40">v1</span>
              </div>
              <pre class="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-paper/85"><code><span class="text-paper/50">{</span>
  <span class="text-blueprint-300">"schemaVersion"</span><span class="text-paper/50">:</span> <span class="text-accent-300">"grayprint.ai/v1"</span><span class="text-paper/50">,</span>
  <span class="text-blueprint-300">"summary"</span><span class="text-paper/50">:</span> <span class="text-accent-300">"Nuxt marketing starter with motion + SEO."</span><span class="text-paper/50">,</span>
  <span class="text-blueprint-300">"capabilities"</span><span class="text-paper/50">: [</span>
    <span class="text-accent-300">"blog with MDC"</span><span class="text-paper/50">,</span>
    <span class="text-accent-300">"animated hero"</span><span class="text-paper/50">,</span>
    <span class="text-accent-300">"OG image generation"</span>
  <span class="text-paper/50">],</span>
  <span class="text-blueprint-300">"compatibility"</span><span class="text-paper/50">: {</span>
    <span class="text-blueprint-300">"frameworks"</span><span class="text-paper/50">: [</span><span class="text-accent-300">"nuxt"</span><span class="text-paper/50">],</span>
    <span class="text-blueprint-300">"package_managers"</span><span class="text-paper/50">: [</span><span class="text-accent-300">"pnpm"</span><span class="text-paper/50">,</span> <span class="text-accent-300">"npm"</span><span class="text-paper/50">]</span>
  <span class="text-paper/50">},</span>
  <span class="text-blueprint-300">"installHint"</span><span class="text-paper/50">:</span> <span class="text-accent-300">"pnpm create grayprint nuxt-marketing-starter my-site"</span>
<span class="text-paper/50">}</span></code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature row -->
    <section class="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <div class="grid gap-10 md:grid-cols-3">
        <div class="rounded-xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:shadow-card">
          <div class="grid h-10 w-10 place-items-center rounded-lg bg-ink text-paper">
            <Icon name="lucide:terminal" class="h-4 w-4" />
          </div>
          <h3 class="mt-5 font-display text-xl font-bold tracking-tight">Dual CLI</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/65">
            <code class="font-mono text-blueprint-700">create-grayprint</code> bootstraps a project
            in one command.
            <code class="font-mono text-blueprint-700">grayprint</code> manages publishing, agents,
            and your registry.
          </p>
        </div>
        <div class="rounded-xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:shadow-card">
          <div class="grid h-10 w-10 place-items-center rounded-lg bg-blueprint-500 text-paper">
            <Icon name="lucide:cpu" class="h-4 w-4" />
          </div>
          <h3 class="mt-5 font-display text-xl font-bold tracking-tight">AI-native</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/65">
            Authenticated MCP server, machine-readable metadata, and llms.txt — agents can search,
            inspect, and publish without scraping a single HTML page.
          </p>
        </div>
        <div class="rounded-xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:shadow-card">
          <div class="grid h-10 w-10 place-items-center rounded-lg bg-accent-400 text-ink">
            <Icon name="lucide:layers" class="h-4 w-4" />
          </div>
          <h3 class="mt-5 font-display text-xl font-bold tracking-tight">Premium catalog</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink/65">
            Templates as content. Each page is curated, discoverable, and optimised for search —
            not a dashboard listing.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA strip -->
    <section class="border-t border-ink/10 bg-paper">
      <div class="mx-auto max-w-6xl px-6 py-14">
        <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Ship a template in an afternoon.
            </h2>
            <p class="mt-2 max-w-lg text-pretty text-ink/65">
              Three commands —
              <code class="font-mono text-blueprint-700">login</code>,
              <code class="font-mono text-blueprint-700">init</code>,
              <code class="font-mono text-blueprint-700">publish</code>. Your detail page goes live
              instantly, fully AI-readable.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/docs/publishing" class="btn-primary">
              Publishing guide
              <Icon name="lucide:arrow-right" class="h-4 w-4" />
            </NuxtLink>
            <NuxtLink to="/docs/cli" class="btn-outline">CLI reference</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
