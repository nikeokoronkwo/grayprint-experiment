<script setup lang="ts">
useSeoMeta({
  title: 'Docs',
  description: 'Documentation for Grayprint — publishing, CLI, MCP, AI-readability.',
});
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-14">
    <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">docs</div>
    <h1 class="mt-1 font-display text-4xl font-bold tracking-tight">The blueprint</h1>
    <p class="mt-3 text-pretty text-ink/70">
      Grayprint is a dynamic template marketplace where every template is content. The docs below
      cover publishing, the CLI, the MCP server, and the AI-readability spec.
    </p>

    <ul class="mt-10 grid gap-3">
      <NuxtLink
        v-for="d in [
          { to: '/docs/publishing', title: 'Publishing a template', sub: 'From local project to public listing in three commands.' },
          { to: '/docs/cli', title: 'The CLI', sub: 'grayprint and create-grayprint — installation, auth, commands.' },
          { to: '/docs/mcp', title: 'MCP server', sub: 'Streamable HTTP + stdio. Authenticated via agent API keys.' },
          { to: '/docs/ai-readability', title: 'AI-readability spec', sub: 'application/grayprint+json — the machine surface every template ships.' },
        ]"
        :key="d.to"
        :to="d.to"
        class="group flex items-start justify-between gap-4 rounded-xl border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-pop"
      >
        <div>
          <div class="font-display text-lg font-bold tracking-tight">{{ d.title }}</div>
          <div class="mt-1 text-sm text-ink/60">{{ d.sub }}</div>
        </div>
        <Icon name="lucide:arrow-up-right" class="h-5 w-5 shrink-0 text-ink/40 transition group-hover:text-blueprint-700" />
      </NuxtLink>
    </ul>
  </main>
</template>
