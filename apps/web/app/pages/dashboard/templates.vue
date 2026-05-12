<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'] });
useSeoMeta({ title: 'My templates', description: 'Manage your templates.' });

// TODO: filter by authorId on the server side once /api/dashboard/templates exists.
const { data: results, pending } = useTemplateSearch(() => ({ perPage: 24 }));
</script>

<template>
  <div>
    <header class="mb-8 flex items-end justify-between">
      <div>
        <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">templates</div>
        <h1 class="mt-1 font-display text-3xl font-bold tracking-tight">My templates</h1>
      </div>
      <NuxtLink to="/docs/publishing" class="btn-accent">
        <Icon name="lucide:upload" class="h-4 w-4" /> Publish a template
      </NuxtLink>
    </header>
    <TemplateGrid :templates="results?.items ?? []" :loading="pending" />
  </div>
</template>
