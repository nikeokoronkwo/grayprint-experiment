<script setup lang="ts">
const nav = [
  { to: '/templates', label: 'Templates' },
  { to: '/categories', label: 'Categories' },
  { to: '/docs', label: 'Docs' },
];
</script>

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-40 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span class="grid h-7 w-7 place-items-center rounded-md bg-ink text-paper">
            <span class="font-mono text-[11px] font-bold">g</span>
          </span>
          grayprint
        </NuxtLink>
        <nav class="hidden items-center gap-1 sm:flex">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="rounded-md px-3 py-1.5 text-sm text-ink/70 transition hover:bg-ink/5 hover:text-ink"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-2">
          <NuxtLink to="/login" class="btn-ghost text-sm">Sign in</NuxtLink>
          <NuxtLink to="/templates" class="btn-accent text-sm">Browse</NuxtLink>
        </div>
      </div>
    </header>

    <slot />

    <footer class="border-t border-ink/10 bg-paper">
      <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-4">
        <div class="sm:col-span-2">
          <div class="font-display text-lg font-bold">grayprint</div>
          <p class="mt-2 max-w-xs text-sm text-ink/60">
            Premium templates as discoverable, AI-readable content. Built for humans and agents.
          </p>
        </div>
        <div>
          <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50">Product</div>
          <ul class="mt-3 space-y-2 text-sm">
            <li><NuxtLink to="/templates" class="hover:text-blueprint-700">Templates</NuxtLink></li>
            <li><NuxtLink to="/categories" class="hover:text-blueprint-700">Categories</NuxtLink></li>
            <li><NuxtLink to="/search" class="hover:text-blueprint-700">Search</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50">Develop</div>
          <ul class="mt-3 space-y-2 text-sm">
            <li><NuxtLink to="/docs" class="hover:text-blueprint-700">Docs</NuxtLink></li>
            <li><NuxtLink to="/docs/cli" class="hover:text-blueprint-700">CLI</NuxtLink></li>
            <li><NuxtLink to="/docs/mcp" class="hover:text-blueprint-700">MCP</NuxtLink></li>
            <li><a href="/llms.txt" class="hover:text-blueprint-700">llms.txt</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-ink/10">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs text-ink/50">
          <div>© {{ new Date().getFullYear() }} Grayprint</div>
          <div class="font-mono">v0.0.0 · level 0</div>
        </div>
      </div>
    </footer>
  </div>
</template>
