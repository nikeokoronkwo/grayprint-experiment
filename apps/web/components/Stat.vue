<script setup lang="ts">
defineProps<{ label: string; value: string; hint?: string }>();
</script>

<template>
  <div class="rounded-xl border border-ink/10 bg-paper/80 p-5 backdrop-blur-sm">
    <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50">{{ label }}</div>
    <div class="mt-2 font-display text-3xl font-bold tabular-nums text-ink">{{ value }}</div>
    <div v-if="hint" class="mt-1 text-xs text-ink/60">{{ hint }}</div>
  </div>
</template>
