<script setup lang="ts">
import { onMounted, ref } from 'vue';

const scope = ref<HTMLElement | null>(null);
const reducedMotion = ref(false);

onMounted(async () => {
  if (typeof window === 'undefined' || !scope.value) return;
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion.value) return;

  const { gsap } = await import('gsap');
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('[data-hero-line]', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 })
      .from('[data-hero-accent]', { scaleX: 0, transformOrigin: '0 50%', duration: 0.7 }, '-=0.4')
      .from('[data-hero-meta]', { y: 16, opacity: 0, duration: 0.6, stagger: 0.06 }, '-=0.3')
      .from('[data-hero-stat]', { y: 16, opacity: 0, duration: 0.5, stagger: 0.05 }, '-=0.3');
  }, scope.value);

  return () => ctx.revert();
});
</script>

<template>
  <section ref="scope" class="bp-grid-paper relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-accent-zing opacity-40" aria-hidden="true" />
    <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blueprint-500/20 blur-3xl" aria-hidden="true" />

    <div class="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-28">
      <div data-hero-meta class="font-mono text-xs uppercase tracking-[0.22em] text-blueprint-700">
        grayprint · level 0 · the blueprint for templates
      </div>
      <h1 class="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-7xl">
        <span data-hero-line class="block">Templates as</span>
        <span data-hero-line class="block">
          <span class="relative inline-block">
            <span class="relative z-10">discoverable</span>
            <span
              data-hero-accent
              class="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent-400/80"
              aria-hidden="true"
            />
          </span>
          content.
        </span>
      </h1>
      <p
        data-hero-meta
        class="mt-7 max-w-xl text-pretty text-lg text-ink/70"
      >
        A premium template marketplace where every template is content — SEO-strong, AI-readable,
        and shipped with a CLI and an MCP server for agents to act on.
      </p>
      <div data-hero-meta class="mt-9 flex flex-wrap gap-3">
        <NuxtLink to="/templates" class="btn-primary">
          <span>Browse templates</span>
          <Icon name="lucide:arrow-right" class="h-4 w-4" />
        </NuxtLink>
        <NuxtLink to="/docs" class="btn-outline">Read the docs</NuxtLink>
        <a href="/llms.txt" class="btn-ghost">
          <Icon name="lucide:terminal" class="h-4 w-4" /> llms.txt
        </a>
      </div>

      <dl class="mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat data-hero-stat label="Frameworks" value="9+" hint="nuxt · next · astro · …" />
        <Stat data-hero-stat label="MCP tools" value="4" hint="search · get · publish · list" />
        <Stat data-hero-stat label="AI surface" value="v1" hint="application/grayprint+json" />
        <Stat data-hero-stat label="License" value="MIT" hint="open foundation" />
      </dl>
    </div>
  </section>
</template>
