<script setup lang="ts">
import type { TemplateCard } from '@grayprint/schemas';

defineProps<{ templates: TemplateCard[]; loading?: boolean }>();
</script>

<template>
  <div v-if="loading && templates.length === 0" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in 6"
      :key="i"
      class="overflow-hidden rounded-xl border border-ink/10 bg-paper"
    >
      <div class="relative aspect-[16/10] overflow-hidden bg-ink/[0.04]">
        <div
          class="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-paper/70 to-transparent"
        />
      </div>
      <div class="space-y-3 p-5">
        <div class="h-4 w-2/3 rounded bg-ink/[0.06]" />
        <div class="h-3 w-full rounded bg-ink/[0.04]" />
        <div class="h-3 w-4/5 rounded bg-ink/[0.04]" />
      </div>
    </div>
  </div>

  <EmptyState
    v-else-if="templates.length === 0"
    icon="lucide:layers"
    title="No templates match"
    description="Try a different combination of filters, or publish the first one yourself."
  >
    <NuxtLink to="/docs/publishing" class="btn-outline mt-5 text-sm">
      How to publish →
    </NuxtLink>
  </EmptyState>

  <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <TemplateCard v-for="t in templates" :key="t.id" :template="t" />
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
