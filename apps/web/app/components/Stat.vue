<script setup lang="ts">
defineProps<{ label: string; value: string; hint?: string }>();
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-xl border border-ink/10 bg-paper/70 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:bg-paper/90 dark:border-paper/10 dark:bg-ink/50 dark:hover:border-paper/20 dark:hover:bg-ink/70"
  >
    <div
      class="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent-400/0 blur-xl transition-all duration-slow group-hover:bg-accent-400/30"
      aria-hidden="true"
    />
    <div class="flex items-center gap-2">
      <span class="h-1 w-1 rounded-full bg-blueprint-500" aria-hidden="true" />
      <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-paper/50">{{ label }}</div>
    </div>
    <div class="mt-3 font-display text-3xl font-bold tabular-nums tracking-tight text-ink dark:text-paper">
      {{ value }}
    </div>
    <div v-if="hint" class="mt-1 text-xs text-ink/55 dark:text-paper/55">{{ hint }}</div>
  </div>
</template>
