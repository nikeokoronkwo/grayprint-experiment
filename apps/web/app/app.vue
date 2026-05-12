<script setup lang="ts">
useHead({
  titleTemplate: (chunk?: string) =>
    !chunk || chunk.includes('Grayprint') ? (chunk ?? 'Grayprint') : `${chunk} — Grayprint`,
});
</script>

<template>
  <div class="min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
