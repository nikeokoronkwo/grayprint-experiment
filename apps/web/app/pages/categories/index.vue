<script setup lang="ts">
type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string | null;
};

useSeoMeta({
  title: 'Categories',
  description: 'Browse Grayprint templates by category.',
});

const { data: categories } = await useAsyncData('categories', () =>
  $fetch('/api/categories').catch(() => []),
);
</script>

<template>
  <main class="mx-auto max-w-6xl px-6 py-12">
    <header class="mb-10">
      <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">marketplace</div>
      <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">Categories</h1>
    </header>

    <div v-if="!categories || categories.length === 0" class="rounded-xl border border-dashed border-ink/15 p-10 text-center">
      <div class="font-display text-xl font-bold">No categories yet.</div>
      <div class="mt-1 text-sm text-ink/60">Run <code class="font-mono">pnpm db:seed</code> to populate.</div>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="c in categories"
        :key="c.slug"
        :to="`/categories/${c.slug}`"
        class="group relative overflow-hidden rounded-xl border border-ink/10 bg-paper p-6 transition-all hover:-translate-y-0.5 hover:shadow-pop"
      >
        <div class="absolute inset-0 bg-blueprint-grid opacity-10" aria-hidden="true" />
        <div class="relative">
          <div class="grid h-10 w-10 place-items-center rounded-lg bg-ink text-paper">
            <Icon :name="c.icon ?? 'lucide:folder'" class="h-5 w-5" />
          </div>
          <div class="mt-4 font-display text-xl font-bold tracking-tight">{{ c.name }}</div>
          <p class="mt-1 text-sm text-ink/65">{{ c.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>
