<script setup lang="ts">
import type { TemplateCard } from '@grayprint/schemas';

const route = useRoute();
const slug = route.params.slug as string;

const { data: cat } = await useAsyncData(`category:${slug}`, () =>
  $fetch(`/api/categories/${slug}`).catch(() => null),
);
if (!cat.value) throw createError({ statusCode: 404 });

const { data: results } = useTemplateSearch(() => ({ category: slug, perPage: 24 }));

useSeoMeta({
  title: cat.value!.name,
  description: cat.value!.description || `Browse ${cat.value!.name} templates`,
});
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-12">
    <header class="mb-10">
      <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">
        category
      </div>
      <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">{{ cat?.name }}</h1>
      <p v-if="cat?.description" class="mt-2 max-w-xl text-ink/65">{{ cat.description }}</p>
    </header>
    <TemplateGrid :templates="results?.items ?? []" />
  </main>
</template>
