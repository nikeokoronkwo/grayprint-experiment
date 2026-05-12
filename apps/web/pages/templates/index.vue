<script setup lang="ts">
import type { TemplateCard, SearchQuery } from '@grayprint/schemas';

useSeoMeta({
  title: 'Templates',
  description: 'Browse premium templates — starters, components, themes, agent workflows.',
});

const route = useRoute();
const router = useRouter();

const q = ref<string>((route.query.q as string) ?? '');
const kind = ref<SearchQuery['kind'] | undefined>(route.query.kind as SearchQuery['kind'] | undefined);
const framework = ref<SearchQuery['framework'] | undefined>(
  route.query.framework as SearchQuery['framework'] | undefined,
);

const query = computed(() => ({
  q: q.value,
  kind: kind.value,
  framework: framework.value,
  perPage: 24,
}));

const { data, pending } = useTemplateSearch(() => query.value);

watch(query, (v) => {
  const next: Record<string, string> = {};
  if (v.q) next.q = v.q;
  if (v.kind) next.kind = v.kind;
  if (v.framework) next.framework = v.framework;
  router.replace({ query: next });
});

const kinds: { value: NonNullable<SearchQuery['kind']>; label: string }[] = [
  { value: 'starter', label: 'Starters' },
  { value: 'component', label: 'Components' },
  { value: 'theme', label: 'Themes' },
  { value: 'workflow', label: 'Workflows' },
  { value: 'snippet', label: 'Snippets' },
];

const frameworks: { value: NonNullable<SearchQuery['framework']>; label: string }[] = [
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'next', label: 'Next.js' },
  { value: 'astro', label: 'Astro' },
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'agnostic', label: 'Agnostic' },
];

function toggleKind(v: NonNullable<SearchQuery['kind']>) {
  kind.value = kind.value === v ? undefined : v;
}
function toggleFramework(v: NonNullable<SearchQuery['framework']>) {
  framework.value = framework.value === v ? undefined : v;
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-12">
    <header class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">marketplace</div>
        <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">Templates</h1>
        <p class="mt-2 max-w-xl text-pretty text-ink/65">
          {{ data?.total ?? 0 }} published — starters, components, themes, and agent-ready workflows.
        </p>
      </div>
      <div class="w-full sm:w-96">
        <SearchBar v-model="q" />
      </div>
    </header>

    <div class="mb-6 flex flex-wrap items-center gap-2">
      <span class="font-mono text-[10px] uppercase tracking-widest text-ink/50">kind</span>
      <button
        v-for="k in kinds"
        :key="k.value"
        :class="[
          'chip transition',
          kind === k.value
            ? 'border-ink bg-ink text-paper'
            : 'hover:border-ink/25',
        ]"
        @click="toggleKind(k.value)"
      >
        {{ k.label }}
      </button>
    </div>
    <div class="mb-10 flex flex-wrap items-center gap-2">
      <span class="font-mono text-[10px] uppercase tracking-widest text-ink/50">framework</span>
      <button
        v-for="f in frameworks"
        :key="f.value"
        :class="[
          'chip transition',
          framework === f.value
            ? 'border-blueprint-500 bg-blueprint-50 text-blueprint-700'
            : 'hover:border-ink/25',
        ]"
        @click="toggleFramework(f.value)"
      >
        {{ f.label }}
      </button>
    </div>

    <TemplateGrid :templates="data?.items ?? []" :loading="pending" />
  </main>
</template>
