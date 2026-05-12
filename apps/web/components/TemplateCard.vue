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
</script>

<template>
  <NuxtLink
    :to="`/templates/${props.template.slug}`"
    class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-paper transition-all duration-base ease-standard hover:-translate-y-0.5 hover:shadow-pop"
  >
    <div class="relative aspect-[16/10] overflow-hidden bg-ink">
      <div class="absolute inset-0 bg-grid-dense opacity-15" />
      <div
        v-if="props.template.preview?.thumbnail"
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${props.template.preview.thumbnail})` }"
      />
      <div v-else class="absolute inset-0 grid place-items-center">
        <div class="font-display text-3xl font-bold text-paper/30">
          {{ props.template.title.slice(0, 1) }}
        </div>
      </div>
      <div class="absolute left-3 top-3 flex gap-1.5">
        <span class="chip border-paper/20 bg-ink/60 text-paper/90 backdrop-blur">
          {{ kindLabel[props.template.kind] ?? props.template.kind }}
        </span>
        <span class="chip border-paper/20 bg-ink/60 text-paper/90 backdrop-blur">
          {{ frameworkLabel[props.template.framework] ?? props.template.framework }}
        </span>
      </div>
      <div class="absolute right-3 top-3">
        <span
          v-if="props.template.pricing === 'free'"
          class="chip border-accent-400/40 bg-accent-400/20 text-accent-900 backdrop-blur"
        >
          Free
        </span>
        <span v-else class="chip border-spark-300/40 bg-spark-500/20 text-paper backdrop-blur">
          {{ props.template.pricing === 'subscription' ? 'Sub' : 'Paid' }}
        </span>
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-5">
      <div class="font-display text-lg font-bold leading-tight tracking-tight text-ink group-hover:text-blueprint-700">
        {{ props.template.title }}
      </div>
      <p class="line-clamp-2 text-sm text-ink/65">{{ props.template.summary }}</p>
      <div class="mt-auto flex items-center justify-between gap-2 pt-1">
        <div class="flex items-center gap-2 text-xs text-ink/55">
          <div class="grid h-5 w-5 place-items-center rounded-full bg-ink text-paper">
            <span class="font-mono text-[9px] font-bold">
              {{ (props.template.author?.handle ?? '?').slice(0, 1).toUpperCase() }}
            </span>
          </div>
          <span>{{ props.template.author?.handle ?? 'unknown' }}</span>
        </div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="t in props.template.tags?.slice(0, 2) ?? []"
            :key="t.slug"
            class="chip"
          >
            {{ t.name }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
