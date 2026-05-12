<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: results } = useTemplateSearch(() => ({ tag: slug, perPage: 24 }));

useSeoMeta({
  title: `#${slug}`,
  description: `Templates tagged ${slug}`,
});
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-12">
    <header class="mb-10">
      <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">tag</div>
      <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">#{{ slug }}</h1>
    </header>
    <TemplateGrid :templates="results?.items ?? []" />
  </main>
</template>
