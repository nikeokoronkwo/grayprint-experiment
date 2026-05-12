<script setup lang="ts">
const colorMode = useColorMode();

const order = ['light', 'dark', 'system'] as const;
type Preference = (typeof order)[number];

function cycle() {
  const idx = order.indexOf(colorMode.preference as Preference);
  colorMode.preference = order[(idx + 1) % order.length]!;
}

const iconName = computed(() => {
  if (colorMode.preference === 'system') return 'lucide:monitor';
  return colorMode.value === 'dark' ? 'lucide:moon' : 'lucide:sun';
});

const label = computed(() => {
  if (colorMode.preference === 'system') return 'Theme: system';
  return colorMode.value === 'dark' ? 'Theme: dark' : 'Theme: light';
});
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      :aria-label="label"
      :title="label"
      class="grid h-8 w-8 place-items-center rounded-pill border border-ink/10 bg-paper/60 text-ink/70 transition hover:border-ink/20 hover:text-ink dark:border-paper/15 dark:bg-ink/40 dark:text-paper/75 dark:hover:border-paper/25 dark:hover:text-paper"
      @click="cycle"
    >
      <Icon :name="iconName" class="h-4 w-4" />
    </button>

    <template #fallback>
      <div
        class="grid h-8 w-8 place-items-center rounded-pill border border-ink/10 bg-paper/60 text-ink/40 dark:border-paper/15 dark:bg-ink/40"
        aria-hidden="true"
      >
        <Icon name="lucide:sun" class="h-4 w-4" />
      </div>
    </template>
  </ClientOnly>
</template>
