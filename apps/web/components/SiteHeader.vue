<script setup lang="ts">
const nav = [
  { to: '/templates', label: 'Templates' },
  { to: '/categories', label: 'Categories' },
  { to: '/docs', label: 'Docs' },
];

const session = useSession() as unknown as {
  value?: { data?: { user?: { id: string; email: string; name?: string | null } } } | null;
};
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
      <NuxtLink to="/" class="flex items-center gap-2 font-display text-base font-bold tracking-tight">
        <span
          class="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-ink text-paper"
          aria-hidden="true"
        >
          <span class="absolute inset-0 bg-grid bg-blueprint-grid-dense opacity-30" />
          <span class="relative font-display text-sm font-bold">g</span>
          <span
            class="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-accent-400 shadow-[0_0_12px_rgba(163,230,53,0.7)]"
          />
        </span>
        grayprint
      </NuxtLink>

      <nav class="hidden items-center gap-1 sm:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-md px-3 py-1.5 text-sm text-ink/70 transition hover:bg-ink/5 hover:text-ink"
          active-class="bg-ink/5 text-ink"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <NuxtLink to="/search" aria-label="Search" class="hidden rounded-md p-2 text-ink/60 hover:bg-ink/5 hover:text-ink sm:inline-flex">
          <Icon name="lucide:search" class="h-4 w-4" />
        </NuxtLink>
        <template v-if="session?.value?.data?.user">
          <NuxtLink to="/dashboard" class="btn-outline text-sm">Dashboard</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="btn-ghost text-sm">Sign in</NuxtLink>
          <NuxtLink to="/templates" class="btn-accent text-sm">Browse</NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
