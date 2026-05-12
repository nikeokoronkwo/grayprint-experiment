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
    tl.from('[data-hero-eyebrow]', { y: 14, opacity: 0, duration: 0.6 })
      .from('[data-hero-line]', { y: 48, opacity: 0, duration: 0.95, stagger: 0.09 }, '-=0.2')
      .from('[data-hero-accent]', { scaleX: 0, transformOrigin: '0 50%', duration: 0.75 }, '-=0.5')
      .from('[data-hero-meta]', { y: 16, opacity: 0, duration: 0.55, stagger: 0.06 }, '-=0.4')
      .from('[data-hero-stat]', { y: 16, opacity: 0, duration: 0.5, stagger: 0.05 }, '-=0.3')
      .from('[data-hero-annot]', { opacity: 0, duration: 0.6, stagger: 0.05 }, '-=0.5');

    // Subtle continuous grid drift for life
    gsap.to('[data-hero-grid]', {
      backgroundPositionX: '32px',
      backgroundPositionY: '32px',
      duration: 18,
      repeat: -1,
      ease: 'none',
    });
  }, scope.value);

  return () => ctx.revert();
});
</script>

<template>
  <section ref="scope" class="relative overflow-hidden bg-paper">
    <!-- layered backdrops -->
    <div
      data-hero-grid
      class="pointer-events-none absolute inset-0"
      :style="{
        backgroundImage:
          'linear-gradient(to right, rgba(59,130,246,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.10) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-paper/40 to-paper"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute inset-0 bg-accent-zing opacity-40"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blueprint-500/20 blur-3xl"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-400/15 blur-3xl"
      aria-hidden="true"
    />

    <!-- corner annotations (blueprint vibes) -->
    <span
      data-hero-annot
      class="pointer-events-none absolute left-6 top-6 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blueprint-700/60 sm:flex"
    >
      <span class="h-2 w-2 rounded-full bg-blueprint-500" />
      A · grayprint.ai / v1
    </span>
    <span
      data-hero-annot
      class="pointer-events-none absolute right-6 top-6 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blueprint-700/60 sm:flex"
    >
      scale 1:1 <span class="h-2 w-2 rounded-full bg-blueprint-500" />
    </span>
    <span
      data-hero-annot
      class="pointer-events-none absolute bottom-6 left-6 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blueprint-700/60 sm:flex"
    >
      <span class="h-2 w-2 rounded-full bg-accent-500" />
      sheet 01 — landing
    </span>

    <div class="relative mx-auto max-w-6xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32">
      <div
        data-hero-eyebrow
        class="inline-flex items-center gap-2 rounded-pill border border-ink/10 bg-paper/70 px-3 py-1 backdrop-blur"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(163,230,53,0.7)]" />
        <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-blueprint-700">
          level 0 · alpha
        </span>
      </div>

      <h1 class="mt-7 max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-7xl">
        <span data-hero-line class="block">Templates as </span>
        <span data-hero-line class="block">
          <span class="relative inline-block">
            <span class="relative z-10">discoverable</span>
            <span
              data-hero-accent
              class="absolute inset-x-0 bottom-1 -z-0 h-3 bg-accent-400/85"
              aria-hidden="true"
            />
          </span>
          content.
        </span>
      </h1>

      <p
        data-hero-meta
        class="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink/70"
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
        <a href="/llms.txt" class="btn-ghost group">
          <Icon name="lucide:terminal" class="h-4 w-4" />
          <span>llms.txt</span>
          <Icon
            name="lucide:arrow-up-right"
            class="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          />
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
