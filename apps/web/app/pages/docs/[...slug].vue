<script setup lang="ts">
const route = useRoute();
const path = `/docs/${(route.params.slug as string[]).join('/')}`;

const { data: doc } = await useAsyncData(`docs:${path}`, () =>
  queryCollection('docs').path(path).first(),
);

if (!doc.value) throw createError({ statusCode: 404, statusMessage: 'Not found' });

useSeoMeta({
  title: doc.value.title,
  description: doc.value.description || `Grayprint docs — ${doc.value.title}`,
});
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-14">
    <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">docs</div>
    <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">{{ doc!.title }}</h1>
    <p v-if="doc!.description" class="mt-3 text-pretty text-ink/70">{{ doc!.description }}</p>

    <article
      class="prose prose-neutral mt-10 max-w-none
             prose-headings:font-display prose-headings:tracking-tight
             prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-bold
             prose-h3:mt-8 prose-h3:text-xl prose-h3:font-semibold
             prose-p:text-pretty prose-p:text-ink/80
             prose-a:text-blueprint-700 prose-a:no-underline hover:prose-a:underline
             prose-strong:text-ink
             prose-code:rounded prose-code:bg-ink/5 prose-code:px-1.5 prose-code:py-0.5
             prose-code:font-mono prose-code:text-[0.85em] prose-code:text-ink
             prose-code:before:content-none prose-code:after:content-none
             prose-pre:rounded-xl prose-pre:border prose-pre:border-ink/10
             prose-pre:bg-ink prose-pre:text-paper
             prose-li:text-ink/80
             prose-hr:border-ink/10"
    >
      <ContentRenderer :value="doc!" />
    </article>

    <div class="mt-12">
      <NuxtLink to="/docs" class="btn-outline text-sm">← All docs</NuxtLink>
    </div>
  </main>
</template>
