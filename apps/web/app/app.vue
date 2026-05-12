<script setup lang="ts">
useHead({
  titleTemplate: (chunk?: string) =>
    !chunk || chunk.includes('Grayprint') ? (chunk ?? 'Grayprint') : `${chunk} — Grayprint`,
});
</script>

<template>
  <div class="min-h-screen bg-paper text-ink">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
