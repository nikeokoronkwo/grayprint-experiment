<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="relative overflow-hidden border-t border-ink/10 bg-paper dark:border-paper/10 dark:bg-ink">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-px"
      :style="{
        background:
          'linear-gradient(to right, transparent 0%, rgba(59,130,246,0.4) 30%, rgba(163,230,53,0.6) 70%, transparent 100%)',
      }"
      aria-hidden="true"
    />
    <div class="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12">
      <div class="md:col-span-5">
        <NuxtLink to="/"><Logo size="md" /></NuxtLink>
        <p class="mt-4 max-w-sm text-pretty text-sm text-ink/60 dark:text-paper/60">
          Premium templates as discoverable, AI-readable content. Built for humans and agents.
        </p>
        <div class="mt-6 flex items-center gap-2">
          <span class="font-mono text-[10px] uppercase tracking-widest text-ink/45 dark:text-paper/45">level</span>
          <span class="inline-flex h-1 w-12 rounded-full bg-accent-400" aria-hidden="true" />
          <span class="font-mono text-[10px] uppercase tracking-widest text-ink/45 dark:text-paper/45">0 · alpha</span>
        </div>
      </div>

      <div class="md:col-span-2">
        <div class="font-mono text-[10px] uppercase tracking-widest text-ink/45 dark:text-paper/45">Marketplace</div>
        <ul class="mt-3 space-y-2 text-sm text-ink/70 dark:text-paper/70">
          <li><NuxtLink to="/templates" class="hover:text-ink dark:hover:text-paper">Templates</NuxtLink></li>
          <li><NuxtLink to="/categories" class="hover:text-ink dark:hover:text-paper">Categories</NuxtLink></li>
          <li><NuxtLink to="/search" class="hover:text-ink dark:hover:text-paper">Search</NuxtLink></li>
          <li><NuxtLink to="/dashboard" class="hover:text-ink dark:hover:text-paper">Dashboard</NuxtLink></li>
        </ul>
      </div>

      <div class="md:col-span-2">
        <div class="font-mono text-[10px] uppercase tracking-widest text-ink/45 dark:text-paper/45">Develop</div>
        <ul class="mt-3 space-y-2 text-sm text-ink/70 dark:text-paper/70">
          <li><NuxtLink to="/docs" class="hover:text-ink dark:hover:text-paper">Docs</NuxtLink></li>
          <li><NuxtLink to="/docs/cli" class="hover:text-ink dark:hover:text-paper">CLI</NuxtLink></li>
          <li><NuxtLink to="/docs/mcp" class="hover:text-ink dark:hover:text-paper">MCP</NuxtLink></li>
          <li><NuxtLink to="/docs/ai-readability" class="hover:text-ink dark:hover:text-paper">AI spec</NuxtLink></li>
        </ul>
      </div>

      <div class="md:col-span-3">
        <div class="font-mono text-[10px] uppercase tracking-widest text-ink/45 dark:text-paper/45">For agents</div>
        <ul class="mt-3 space-y-2 text-sm">
          <li>
            <a href="/llms.txt" class="group inline-flex items-center gap-1.5 text-ink/70 hover:text-ink dark:text-paper/70 dark:hover:text-paper">
              <Icon name="lucide:file-text" class="h-3.5 w-3.5 text-blueprint-600 dark:text-blueprint-300" />
              llms.txt
              <Icon name="lucide:arrow-up-right" class="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
            </a>
          </li>
          <li>
            <a href="/llms-full.txt" class="group inline-flex items-center gap-1.5 text-ink/70 hover:text-ink dark:text-paper/70 dark:hover:text-paper">
              <Icon name="lucide:file-text" class="h-3.5 w-3.5 text-blueprint-600 dark:text-blueprint-300" />
              llms-full.txt
              <Icon name="lucide:arrow-up-right" class="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
            </a>
          </li>
          <li>
            <span class="inline-flex items-center gap-1.5 text-ink/70 dark:text-paper/70">
              <Icon name="lucide:cpu" class="h-3.5 w-3.5 text-accent-500" />
              <code class="font-mono">/api/mcp</code>
              <span class="rounded-pill bg-accent-100 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-900 dark:bg-accent-400/20 dark:text-accent-200">auth</span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-ink/10 dark:border-paper/10">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 text-xs text-ink/45 dark:text-paper/45">
        <div>© {{ year }} Grayprint. The blueprint for templates.</div>
        <div class="hidden font-mono sm:block">v0.0.0 · {{ new Date().toISOString().slice(0, 10) }}</div>
      </div>
    </div>
  </footer>
</template>
