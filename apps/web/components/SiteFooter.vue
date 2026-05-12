<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-ink/10 bg-paper">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-4">
      <div class="sm:col-span-2">
        <div class="flex items-center gap-2 font-display text-lg font-bold">
          <span class="relative grid h-7 w-7 place-items-center rounded-md bg-ink text-paper">
            <span class="font-mono text-[11px] font-bold">g</span>
          </span>
          grayprint
        </div>
        <p class="mt-3 max-w-sm text-pretty text-sm text-ink/60">
          Premium templates as discoverable, AI-readable content. Built for humans and agents.
        </p>
        <div class="mt-5 inline-flex h-1.5 w-12 rounded-full bg-accent-400" aria-hidden="true" />
      </div>
      <div>
        <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50">Product</div>
        <ul class="mt-3 space-y-2 text-sm">
          <li><NuxtLink to="/templates" class="hover:text-blueprint-700">Templates</NuxtLink></li>
          <li><NuxtLink to="/categories" class="hover:text-blueprint-700">Categories</NuxtLink></li>
          <li><NuxtLink to="/search" class="hover:text-blueprint-700">Search</NuxtLink></li>
          <li><NuxtLink to="/dashboard" class="hover:text-blueprint-700">Dashboard</NuxtLink></li>
        </ul>
      </div>
      <div>
        <div class="font-mono text-[10px] uppercase tracking-widest text-ink/50">Develop</div>
        <ul class="mt-3 space-y-2 text-sm">
          <li><NuxtLink to="/docs" class="hover:text-blueprint-700">Docs</NuxtLink></li>
          <li><NuxtLink to="/docs/cli" class="hover:text-blueprint-700">CLI</NuxtLink></li>
          <li><NuxtLink to="/docs/mcp" class="hover:text-blueprint-700">MCP</NuxtLink></li>
          <li><a href="/llms.txt" class="hover:text-blueprint-700">llms.txt</a></li>
          <li><a href="/llms-full.txt" class="hover:text-blueprint-700">llms-full.txt</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-ink/10">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs text-ink/50">
        <div>© {{ year }} Grayprint</div>
        <div class="font-mono">v0.0.0 · level 0</div>
      </div>
    </div>
  </footer>
</template>
