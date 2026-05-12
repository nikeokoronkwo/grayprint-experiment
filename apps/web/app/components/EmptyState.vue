<script setup lang="ts">
defineProps<{ title: string; description?: string; icon?: string }>();
</script>

<template>
  <div
    class="relative overflow-hidden rounded-xl border border-dashed border-ink/15 bg-paper/60 px-6 py-14 text-center dark:border-paper/15 dark:bg-ink/40"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-40"
      :style="{
        backgroundImage:
          'linear-gradient(to right, rgba(10,19,48,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,19,48,0.04) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }"
      aria-hidden="true"
    />
    <div class="relative">
      <div
        v-if="icon"
        class="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl border border-ink/10 bg-paper text-ink/55 shadow-card dark:border-paper/10 dark:bg-ink dark:text-paper/55"
      >
        <Icon :name="icon" class="h-5 w-5" />
      </div>
      <div class="font-display text-xl font-bold tracking-tight text-ink/85 dark:text-paper/85">{{ title }}</div>
      <p v-if="description" class="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink/55 dark:text-paper/55">
        {{ description }}
      </p>
      <slot />
    </div>
  </div>
</template>
