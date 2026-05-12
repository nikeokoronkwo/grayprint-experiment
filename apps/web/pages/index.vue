<script setup lang="ts">
// Placeholder landing — Phase 3 replaces this with the full hero + featured + AI surface story.
useSeoMeta({
  title: 'Grayprint',
  description:
    'A dynamic template marketplace where templates are content — discoverable, AI-readable, and built for both humans and agents.',
  ogTitle: 'Grayprint — the blueprint for templates',
  ogDescription: 'Premium templates as discoverable, AI-readable content.',
});
</script>

<template>
  <main class="bp-grid-paper relative min-h-[100svh] overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-accent-zing opacity-50" />
    <section class="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div class="font-mono text-xs uppercase tracking-[0.2em] text-blueprint-600">
        grayprint · level 0
      </div>
      <h1 class="mt-6 max-w-3xl font-display text-6xl font-bold leading-[1.02] tracking-tight text-ink sm:text-7xl">
        The blueprint for
        <span class="relative inline-block">
          <span class="relative z-10">templates.</span>
          <span class="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent-400/70" aria-hidden="true" />
        </span>
      </h1>
      <p class="mt-6 max-w-xl text-pretty text-lg text-ink/70">
        A dynamic template marketplace where templates are content — discoverable, AI-readable,
        and built for both humans and agents.
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <NuxtLink to="/templates" class="btn-primary">Browse templates</NuxtLink>
        <NuxtLink to="/docs" class="btn-outline">Read the docs</NuxtLink>
      </div>
      <div class="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <Stat label="Templates" value="—" hint="seeding soon" />
        <Stat label="Frameworks" value="9+" hint="nuxt · next · astro · …" />
        <Stat label="MCP tools" value="4" hint="search · get · publish · list" />
        <Stat label="License" value="MIT" hint="open foundation" />
      </div>
    </section>
  </main>
</template>

<script lang="ts">
// Inline stat tile — Phase 3 promotes this to a real component in /components.
export default {};
</script>

<style scoped>
/* leave styling token-driven via Tailwind preset */
</style>
