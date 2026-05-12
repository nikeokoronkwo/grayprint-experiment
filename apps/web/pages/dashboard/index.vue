<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'] });
useSeoMeta({ title: 'Dashboard', description: 'Your Grayprint dashboard.' });

const session = useSession();
const user = computed(() => session?.data?.value?.user);

const { data: templates } = useTemplateSearch(() => ({ perPage: 4 }));
</script>

<template>
  <div>
    <header class="mb-8">
      <div class="font-mono text-[10px] uppercase tracking-widest text-blueprint-700">overview</div>
      <h1 class="mt-1 font-display text-3xl font-bold tracking-tight">
        Welcome{{ user?.name ? `, ${user.name}` : '' }}
      </h1>
      <p class="mt-1 text-ink/60">Manage your templates, agents, and billing from here.</p>
    </header>

    <div class="grid gap-4 sm:grid-cols-3">
      <NuxtLink
        to="/dashboard/templates"
        class="group rounded-xl border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-pop"
      >
        <Icon name="lucide:layers" class="h-5 w-5 text-blueprint-600" />
        <div class="mt-3 font-display text-xl font-bold">Templates</div>
        <p class="mt-1 text-sm text-ink/60">Create, publish, and manage your templates.</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/agents"
        class="group rounded-xl border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-pop"
      >
        <Icon name="lucide:bot" class="h-5 w-5 text-blueprint-600" />
        <div class="mt-3 font-display text-xl font-bold">Agents</div>
        <p class="mt-1 text-sm text-ink/60">API keys for AI agents and the MCP server.</p>
      </NuxtLink>
      <NuxtLink
        to="/dashboard/billing"
        class="group rounded-xl border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-pop"
      >
        <Icon name="lucide:credit-card" class="h-5 w-5 text-blueprint-600" />
        <div class="mt-3 font-display text-xl font-bold">Billing</div>
        <p class="mt-1 text-sm text-ink/60">Polar-managed subscriptions and orders.</p>
      </NuxtLink>
    </div>

    <section class="mt-12">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="font-display text-xl font-bold tracking-tight">Latest in marketplace</h2>
        <NuxtLink to="/templates" class="text-sm text-blueprint-700">Browse all →</NuxtLink>
      </div>
      <TemplateGrid :templates="templates?.items?.slice(0, 4) ?? []" />
    </section>
  </div>
</template>
