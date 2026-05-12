<script setup lang="ts">
useHead({
  titleTemplate: (chunk?: string) => (chunk ? `${chunk} — Grayprint` : 'Grayprint'),
});
</script>

<template>
  <div class="min-h-screen bg-paper text-ink">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
