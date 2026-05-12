<script setup lang="ts">
defineProps<{ title: string; description?: string; icon?: string }>();
</script>

<template>
  <div class="rounded-xl border border-dashed border-ink/15 px-6 py-12 text-center">
    <div v-if="icon" class="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-ink/5 text-ink/50">
      <Icon :name="icon" class="h-5 w-5" />
    </div>
    <div class="font-display text-xl font-bold text-ink/85">{{ title }}</div>
    <p v-if="description" class="mt-1 text-sm text-ink/60">{{ description }}</p>
    <slot />
  </div>
</template>
