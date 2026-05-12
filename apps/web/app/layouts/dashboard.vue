<script setup lang="ts">
const nav = [
  { to: '/dashboard', label: 'Overview', icon: 'lucide:gauge' },
  { to: '/dashboard/templates', label: 'My templates', icon: 'lucide:layers' },
  { to: '/dashboard/agents', label: 'Agents', icon: 'lucide:bot' },
  { to: '/dashboard/billing', label: 'Billing', icon: 'lucide:credit-card' },
];
</script>

<template>
  <div class="flex min-h-screen flex-col bg-paper dark:bg-ink">
    <SiteHeader />
    <div class="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-6 py-10">
      <aside class="w-56 shrink-0">
        <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-paper/50">dashboard</div>
        <nav class="mt-3 space-y-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink/70 transition hover:bg-ink/5 hover:text-ink dark:text-paper/70 dark:hover:bg-paper/5 dark:hover:text-paper"
            active-class="bg-ink text-paper hover:bg-ink hover:text-paper dark:bg-paper dark:text-ink dark:hover:bg-paper dark:hover:text-ink"
          >
            <Icon :name="item.icon" class="h-4 w-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>
      <main class="min-w-0 flex-1">
        <slot />
      </main>
    </div>
    <SiteFooter />
  </div>
</template>
