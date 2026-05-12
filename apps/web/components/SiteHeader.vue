<script setup lang="ts">
const route = useRoute();

const nav = [
  { to: '/templates', label: 'Templates' },
  { to: '/categories', label: 'Categories' },
  { to: '/docs', label: 'Docs' },
];

const session = useSession() as unknown as {
  value?: { data?: { user?: { id: string; email: string; name?: string | null } } } | null;
};

const isHome = computed(() => route.path === '/');
</script>

<template>
  <header
    :class="[
      'sticky top-0 z-40 border-b backdrop-blur-md transition-colors',
      isHome ? 'border-ink/10 bg-paper/70' : 'border-ink/10 bg-paper/90',
    ]"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
      <NuxtLink to="/" class="-mx-1 rounded-md p-1 transition hover:opacity-90">
        <Logo size="md" />
      </NuxtLink>

      <nav class="hidden items-center gap-0.5 sm:flex">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="relative rounded-md px-3 py-1.5 text-sm text-ink/65 transition hover:text-ink"
          active-class="text-ink"
        >
          {{ item.label }}
          <span
            v-if="route.path.startsWith(item.to)"
            class="absolute inset-x-3 -bottom-px h-px bg-ink"
            aria-hidden="true"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-1.5">
        <NuxtLink
          to="/search"
          aria-label="Search"
          class="hidden items-center gap-2 rounded-pill border border-ink/10 bg-paper/60 px-3 py-1.5 text-xs text-ink/55 transition hover:border-ink/20 hover:text-ink/80 sm:inline-flex"
        >
          <Icon name="lucide:search" class="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd class="rounded border border-ink/15 px-1 font-mono text-[10px]">⌘K</kbd>
        </NuxtLink>
        <template v-if="session?.value?.data?.user">
          <NuxtLink to="/dashboard" class="btn-outline text-sm">Dashboard</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="btn-ghost text-sm">Sign in</NuxtLink>
          <NuxtLink to="/templates" class="btn-accent text-sm">
            <span>Browse</span>
            <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" />
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>
