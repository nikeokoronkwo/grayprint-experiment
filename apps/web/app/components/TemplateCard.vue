<script setup lang="ts">
import type { TemplateCard } from '@grayprint/schemas';

const props = defineProps<{ template: TemplateCard }>();

const kindLabel: Record<string, string> = {
  app: 'App',
  component: 'Component',
  starter: 'Starter',
  snippet: 'Snippet',
  theme: 'Theme',
  workflow: 'Workflow',
};

const frameworkLabel: Record<string, string> = {
  nuxt: 'Nuxt',
  next: 'Next.js',
  sveltekit: 'SvelteKit',
  remix: 'Remix',
  astro: 'Astro',
  vue: 'Vue',
  react: 'React',
  svelte: 'Svelte',
  solid: 'Solid',
  angular: 'Angular',
  agnostic: 'Agnostic',
};

/** Deterministic accent so each card looks distinct without thumbnails. */
const accent = computed(() => {
  const palette = [
    'from-blueprint-500/30 via-blueprint-700/40 to-ink',
    'from-accent-400/30 via-accent-600/30 to-ink',
    'from-spark-400/25 via-blueprint-600/30 to-ink',
    'from-blueprint-400/30 via-accent-500/20 to-ink',
    'from-spark-500/20 via-blueprint-700/35 to-ink',
    'from-accent-300/25 via-blueprint-500/25 to-ink',
  ];
  let h = 0;
  for (let i = 0; i < props.template.slug.length; i++)
    h = (h * 31 + props.template.slug.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
});
</script>

<template>
  <NuxtLink
    :to="`/templates/${props.template.slug}`"
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-paper transition-all duration-base ease-standard hover:-translate-y-1 hover:border-ink/20 hover:shadow-pop dark:border-paper/10 dark:bg-ink/60 dark:hover:border-paper/20"
  >
    <!-- Preview -->
    <div class="relative aspect-[16/10] overflow-hidden">
      <div :class="['absolute inset-0 bg-gradient-to-br', accent]" aria-hidden="true" />
      <div
        class="absolute inset-0 opacity-25 mix-blend-overlay"
        :style="{
          backgroundImage:
            'linear-gradient(to right, rgba(245,242,232,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,242,232,0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }"
        aria-hidden="true"
      />
      <div
        v-if="props.template.preview?.thumbnail"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${props.template.preview.thumbnail})` }"
      />
      <div v-else class="absolute inset-0 grid place-items-center">
        <div class="font-display text-[120px] font-extrabold leading-none text-paper/[0.08]">
          {{ props.template.title.slice(0, 1) }}
        </div>
      </div>

      <!-- Top-left chips -->
      <div class="absolute left-3 top-3 flex gap-1.5">
        <span class="chip border-paper/15 bg-ink/65 text-paper/90 backdrop-blur-md">
          {{ kindLabel[props.template.kind] ?? props.template.kind }}
        </span>
        <span class="chip border-paper/15 bg-ink/65 text-paper/90 backdrop-blur-md">
          {{ frameworkLabel[props.template.framework] ?? props.template.framework }}
        </span>
      </div>

      <!-- Top-right pricing pill -->
      <div class="absolute right-3 top-3">
        <span
          v-if="props.template.pricing === 'free'"
          class="chip border-accent-400/50 bg-accent-400/85 text-ink shadow-glow"
        >
          Free
        </span>
        <span v-else class="chip border-spark-400/40 bg-spark-500/80 text-paper backdrop-blur-md">
          {{ props.template.pricing === 'subscription' ? 'Subscription' : 'Paid' }}
        </span>
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/85 to-transparent p-3 text-paper opacity-0 transition-opacity duration-base group-hover:opacity-100"
      >
        <span class="font-mono text-[10px] uppercase tracking-widest text-paper/80">view template</span>
        <Icon
          name="lucide:arrow-right"
          class="h-4 w-4 -translate-x-1 transition-transform duration-base group-hover:translate-x-0"
        />
      </div>
    </div>

    <!-- Body -->
    <div class="flex flex-1 flex-col gap-3 p-5">
      <div>
        <h3
          class="font-display text-lg font-bold leading-tight tracking-tight text-ink transition-colors group-hover:text-blueprint-700 dark:text-paper dark:group-hover:text-blueprint-300"
        >
          {{ props.template.title }}
        </h3>
        <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/65 dark:text-paper/65">
          {{ props.template.summary }}
        </p>
      </div>

      <div class="mt-auto flex items-center justify-between gap-2 pt-1">
        <div class="flex items-center gap-2 text-xs text-ink/55 dark:text-paper/55">
          <div
            class="grid h-5 w-5 place-items-center rounded-full bg-ink text-paper ring-1 ring-ink/5"
            aria-hidden="true"
          >
            <span class="font-mono text-[9px] font-bold">
              {{ (props.template.author?.handle ?? '?').slice(0, 1).toUpperCase() }}
            </span>
          </div>
          <span>{{ props.template.author?.handle ?? 'unknown' }}</span>
        </div>
        <div class="flex flex-wrap gap-1">
          <span v-for="t in props.template.tags?.slice(0, 2) ?? []" :key="t.slug" class="chip">
            {{ t.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- AI hint footer -->
    <div
      class="flex items-center gap-2 border-t border-ink/[0.06] bg-ink/[0.015] px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink/45 dark:border-paper/[0.08] dark:bg-paper/[0.02] dark:text-paper/45"
    >
      <Icon name="lucide:cpu" class="h-3 w-3 text-blueprint-600 dark:text-blueprint-300" />
      <span>ai-readable</span>
      <span class="ml-auto text-ink/30 dark:text-paper/30">grayprint.ai/v1</span>
    </div>
  </NuxtLink>
</template>
