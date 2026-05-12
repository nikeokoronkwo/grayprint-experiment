<script setup lang="ts">
import type { TemplateCard } from '@grayprint/schemas';

defineProps<{ templates: TemplateCard[]; loading?: boolean }>();
</script>

<template>
  <div v-if="loading && templates.length === 0" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="i in 6" :key="i" class="aspect-[16/22] animate-pulse rounded-xl border border-ink/10 bg-ink/[0.02]" />
  </div>
  <div v-else-if="templates.length === 0" class="rounded-xl border border-dashed border-ink/15 p-10 text-center">
    <div class="font-display text-xl font-bold text-ink/80">Nothing here yet.</div>
    <div class="mt-1 text-sm text-ink/60">Try a different filter, or publish the first one yourself.</div>
  </div>
  <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <TemplateCard v-for="t in templates" :key="t.id" :template="t" />
  </div>
</template>
