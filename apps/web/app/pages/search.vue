<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const q = ref<string>((route.query.q as string) ?? '');

const { data, pending } = useTemplateSearch(() => ({ q: q.value, perPage: 36 }));

watch(q, (v) => {
  router.replace({ query: v ? { q: v } : {} });
});

useSeoMeta({ title: q.value ? `Search "${q.value}"` : 'Search', description: 'Search Grayprint templates.' });
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-12">
    <header class="mb-8">
      <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">search</div>
      <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">
        {{ q ? `Results for “${q}”` : 'Search templates' }}
      </h1>
    </header>
    <div class="mb-8 max-w-2xl">
      <SearchBar v-model="q" placeholder="Search by title, summary, framework, tag…" />
    </div>
    <TemplateGrid :templates="data?.items ?? []" :loading="pending" />
  </main>
</template>
